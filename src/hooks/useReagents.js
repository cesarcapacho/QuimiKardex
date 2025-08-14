// hooks/useReagents.js (Versión CORREGIDA para la duplicación y manejo de ID)
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import {
  addReagent as addReagentToFirestore,
  updateReagent as updateReagentInFirestore,
  deleteReagent as deleteReagentFromFirestore
} from '@/firebase/firestoreService';
import {
  collection,
  query,
  onSnapshot,
  orderBy
} from 'firebase/firestore';
import { db } from '@/firebase/config';

export function useReagents() {
  const [reagents, setReagents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Esta función se encarga de escuchar los cambios en Firestore en tiempo real
  // y actualizar el estado 'reagents' localmente.
  // ¡Es la ÚNICA que debe modificar 'reagents' al cargar o por cambios en la DB!
  const loadReagentsFromFirestore = useCallback(() => {
    setLoading(true);
    setError(null);

    const q = query(collection(db, 'reagents'), orderBy('name', 'asc')); // Ordena por nombre para consistencia

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedReagents = querySnapshot.docs.map(doc => ({
        id: doc.id, // El ID ahora viene DIRECTAMENTE de Firebase
        ...doc.data()
      }));
      setReagents(fetchedReagents);
      setLoading(false);
    }, (err) => {
      console.error("Error al escuchar reactivos en Firestore:", err);
      setError("No se pudieron cargar los reactivos en tiempo real.");
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Error de conexión",
        description: "No se pudieron cargar los reactivos en tiempo real. Intenta recargar la página."
      });
    });

    return unsubscribe; // Retorna la función para desuscribirse cuando el componente se desmonte
  }, [toast]);

  // useEffect para iniciar la suscripción a Firestore cuando el componente se monta
  useEffect(() => {
    const unsubscribe = loadReagentsFromFirestore(); // Llamamos a la nueva función de carga
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe(); // Limpia la suscripción
      }
    };
  }, [loadReagentsFromFirestore]); // Asegúrate de que esta dependencia sea correcta

  // Función para agregar un nuevo reactivo a Firestore
  const addReagent = useCallback(async (newData) => {
    setLoading(true);
    try {
      // Llama a la función de Firebase Service para añadir el reactivo.
      // Firebase genera automáticamente el ID.
      const firebaseId = await addReagentToFirestore(newData); // FirestoreService retorna solo el ID.

      // Retornamos el objeto completo con el ID generado por Firebase.
      // El estado 'reagents' se actualizará automáticamente vía onSnapshot.
      toast({
        title: "Éxito",
        description: `Reactivo "${newData.name}" agregado correctamente.`,
        variant: "success",
      });
      return { id: firebaseId, ...newData }; // ¡Devuelve el objeto con el ID de Firebase!
    } catch (error) {
      console.error("Error al agregar reactivo:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo agregar el reactivo."
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Función para actualizar un reactivo existente en Firestore
  const updateReagent = useCallback(async (reagentId, updatedData) => {
    setLoading(true);
    try {
      await updateReagentInFirestore(reagentId, updatedData);
      // El estado 'reagents' se actualizará automáticamente vía onSnapshot.
      toast({
        title: "Éxito",
        description: `Reactivo "${updatedData.name}" actualizado correctamente.`,
        variant: "success",
      });
      return true;
    } catch (error) {
      console.error("Error al actualizar reactivo:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el reactivo."
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Función para eliminar un reactivo de Firestore
  const deleteReagent = useCallback(async (idToDelete) => {
    setLoading(true);
    try {
      await deleteReagentFromFirestore(idToDelete);
      // El estado 'reagents' se actualizará automáticamente vía onSnapshot.
      toast({
        title: "Éxito",
        description: "Reactivo eliminado correctamente.",
        variant: "success",
      });
      return true;
    } catch (error) {
      console.error("Error al eliminar reactivo:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el reactivo."
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    reagents,
    addReagent,
    updateReagent,
    deleteReagent,
    loading,
    error
  };
}