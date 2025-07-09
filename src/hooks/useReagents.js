import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

const REAGENTS_STORAGE_KEY = 'labReagents';
const initialReagentsData = [];

export function useReagents() {
  const [reagents, setReagents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(REAGENTS_STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : initialReagentsData;
      setReagents(parsed);

      if (!stored) {
        localStorage.setItem(REAGENTS_STORAGE_KEY, JSON.stringify(initialReagentsData));
      }
    } catch (error) {
      console.error("Error cargando reactivos:", error);
      setReagents(initialReagentsData);

      setTimeout(() => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar los reactivos."
        });
      }, 0);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateLocalStorage = useCallback((updated) => {
    try {
      localStorage.setItem(REAGENTS_STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Error guardando reactivos:", error);
      setTimeout(() => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo guardar el inventario."
        });
      }, 0);
    }
  }, [toast]);

  const addReagent = useCallback(async (newData) => {
    const newReagent = {
  ...newData,
  id: newData.id || `r${Date.now()}`,
  quantity: parseFloat(newData.quantity) || 0, //  Guarda lo que se ingreso en el formulario
  // Puedes mantener otros campos como unit, name, etc.
};


    try {
      const updated = [...reagents, newReagent];
      setReagents(updated);
      updateLocalStorage(updated);

      setTimeout(() => {
        toast({
          title: "Éxito",
          description: `Reactivo "${newReagent.name}" agregado correctamente.`,
          variant: "success",
        });
      }, 0);

      return true;
    } catch (error) {
      console.error("Error al agregar reactivo:", error);
      setTimeout(() => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo agregar el reactivo."
        });
      }, 0);
      return false;
    }
  }, [reagents, updateLocalStorage, toast]);

  const updateReagent = useCallback(async (updatedData) => {
    try {
      const updated = reagents.map(r =>
        r.id === updatedData.id
          ? {
            ...r,
            ...updatedData,
            quantity: parseFloat(updatedData.quantity) || 0
          }
          : r
      );
      setReagents(updated);
      updateLocalStorage(updated);

      setTimeout(() => {
        toast({
          title: "Éxito",
          description: `Reactivo "${updatedData.name}" actualizado correctamente.`,
          variant: "success",
        });
      }, 0);

      return true;
    } catch (error) {
      console.error("Error al actualizar reactivo:", error);
      setTimeout(() => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo actualizar el reactivo."
        });
      }, 0);
      return false;
    }
  }, [reagents, updateLocalStorage, toast]);

  const deleteReagent = useCallback(async (idToDelete) => {
    try {
      const reagentToDelete = reagents.find(r => r.id === idToDelete);
      const updated = reagents.filter(r => r.id !== idToDelete);
      setReagents(updated);
      updateLocalStorage(updated);

      setTimeout(() => {
        toast({
          title: "Éxito",
          description: `Reactivo "${reagentToDelete?.name}" eliminado correctamente.`,
          variant: "success",
        });
      }, 0);

      return true;
    } catch (error) {
      console.error("Error al eliminar reactivo:", error);
      setTimeout(() => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo eliminar el reactivo."
        });
      }, 0);
      return false;
    }
  }, [reagents, updateLocalStorage, toast]);

  return {
    reagents,
    addReagent,
    updateReagent,
    deleteReagent,
    loading,
    setReagents
  };
}
