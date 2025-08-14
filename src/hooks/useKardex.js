// src/hooks/useKardex.js (Versión CORREGIDA para Firestore y sincronización con Reagents)
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useReagents } from '@/hooks/useReagents';

// ************************************************************
// *** C A M B I O S   A Q U Í : Importaciones directas de firestoreService.js ***
// ************************************************************
import {
  addMovement, // Importa directamente 'addMovement'
  deleteMovement // Importa directamente 'deleteMovement'
} from '@/firebase/firestoreService';
// ************************************************************

import {
  collection,
  query,
  onSnapshot,
  orderBy
} from 'firebase/firestore';
import { db } from '@/firebase/config';

const KARDEX_COLLECTION_NAME = 'kardexMovements';

export function useKardex() {
  const { reagents, loading: reagentsLoading, error: reagentsError } = useReagents();
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // 🧮 Calcular stock basado en movimientos + inventario base (Reactivos)
  const stockLevels = useMemo(() => {
    const stock = {};

    // Primero, inicializamos el stock con la cantidad base de cada reactivo
    reagents.forEach(r => {
      const baseQty = parseFloat(r.quantity) || 0; // Usamos r.quantity como la base
      stock[r.id] = { name: r.name, unit: r.unit, current: baseQty };
    });

    // Luego, aplicamos los movimientos del Kardex
    movements.forEach(m => {
      const qty = parseFloat(m.quantity) || 0;
      if (!stock[m.reagentId]) {
        // Esto puede ocurrir si un movimiento existe para un reactivo que ya no está,
        // o si los movimientos cargan antes que los reactivos.
        console.warn(`Movimiento encontrado para reactivo desconocido: ${m.reagentId}`);
        return;
      }

      if (m.type === 'entrada') stock[m.reagentId].current += qty;
      if (m.type === 'salida') stock[m.reagentId].current -= qty;
    });

    // Asegura que las cantidades no sean negativas
    Object.values(stock).forEach(s => {
      s.current = Math.max(0, s.current);
    });

    return stock;
  }, [movements, reagents]);


  // 📦 Cargar movimientos desde Firestore en tiempo real
  const loadKardexMovementsFromFirestore = useCallback(() => {
    setLoading(true);
    setError(null);

    // Ordenar por 'createdAt' que agregamos al guardar los movimientos
    const q = query(collection(db, KARDEX_COLLECTION_NAME), orderBy('createdAt', 'desc')); 

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedMovements = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convertir Timestamp a Date si es necesario para mostrar o manipular
        // Asegúrate que 'date' sea un objeto Date
        date: doc.data().date instanceof Date ? doc.data().date : new Date(doc.data().date),
        // Firestore Timestamp a Date (usa optional chaining por si el campo no existe)
        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(doc.data().createdAt), 
      }));
      setMovements(fetchedMovements);
      setLoading(false);
    }, (err) => {
      console.error("Error al escuchar movimientos de Kardex en Firestore:", err);
      setError("No se pudieron cargar los movimientos del Kardex en tiempo real.");
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Error de conexión",
        description: "No se pudieron cargar los movimientos del Kardex en tiempo real. Intenta recargar la página."
      });
    });

    return unsubscribe;
  }, [toast]);

  useEffect(() => {
    // Solo iniciamos la carga de movimientos si los reactivos ya están cargados (o si no hay error en ellos)
    // Esto previene que se calculen stockLevels con una lista de reactivos vacía temporalmente.
    if (!reagentsLoading && !reagentsError) {
      const unsubscribe = loadKardexMovementsFromFirestore();
      return () => {
        if (unsubscribe && typeof unsubscribe === 'function') {
          unsubscribe();
        }
      };
    }
  }, [reagentsLoading, reagentsError, loadKardexMovementsFromFirestore]);


  // ➕ Agregar nuevo movimiento a Firestore
  // ************************************************************
  // *** C A M B I O   A Q U Í : Ahora 'addMovement' usa la función importada directamente ***
  // ************************************************************
  const addMovement = useCallback(async (data) => {
    const reagent = reagents.find(r => r.id === data.reagentId);

    if (!reagent) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Reactivo no encontrado para registrar el movimiento. Recarga la página."
      });
      return false;
    }

    const qty = parseFloat(data.quantity) || 0;
    const current = stockLevels[data.reagentId]?.current || 0;

    if (data.type === 'salida' && qty > current) {
      toast({
        variant: "destructive",
        title: "Stock insuficiente",
        description: `No hay suficiente ${reagent.name}. Stock actual: ${current.toFixed(2)} ${reagent.unit}.`
      });
      return false;
    }

    try {
      const movementToSave = {
        ...data,
        quantity: qty,
        reagentName: reagent.name,
        unit: reagent.unit,
        createdAt: new Date(),
      };
      
      const addedMovement = await addMovement(movementToSave); // <--- Llama a la función importada 'addMovement'
      
      toast({
        title: "Éxito",
        description: `Movimiento de ${reagent.name} registrado.`,
        variant: "success",
      });
      return addedMovement;
    } catch (error) {
      console.error("Error en addMovement (Firestore):", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo registrar el movimiento."
      });
      return false;
    }
  }, [reagents, stockLevels, toast]); // Agregué 'reagents' aquí para asegurar que 'reagent' esté actualizado

  // 🗑️ Eliminar movimiento de Firestore
  // ************************************************************
  // *** C A M B I O   A Q U Í : Ahora 'deleteMovement' usa la función importada directamente ***
  // ************************************************************
  const deleteMovement = useCallback(async (idToDelete) => {
    try {
      await deleteMovement(idToDelete); // <--- Llama a la función importada 'deleteMovement'
      
      toast({
        title: "Éxito",
        description: `Movimiento eliminado.`,
        variant: "success",
      });
      return true;
    } catch (error) {
      console.error("Error al eliminar movimiento (Firestore):", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el movimiento."
      });
      return false;
    }
  }, [toast]);

  return {
    movements,
    stockLevels,
    addMovement,
    deleteMovement,
    loading: loading || reagentsLoading,
    error: error || reagentsError,
    reagentList: reagents // Mantener si otros componentes lo usan
  };
}