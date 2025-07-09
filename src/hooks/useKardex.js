import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useReagents } from '@/hooks/useReagents';

const KARDEX_STORAGE_KEY = 'labKardexMovements';

export function useKardex() {
  const { reagents, loading: reagentsLoading } = useReagents();
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // 🧮 Calcular stock basado en movimientos + inventario base
  const stockLevels = useMemo(() => {
    const stock = {};

    reagents.forEach(r => {
      const baseQty = parseFloat(r.quantity) || 0;
      stock[r.id] = { name: r.name, unit: r.unit, current: 0 };
    });

    movements.forEach(m => {
      const qty = parseFloat(m.quantity) || 0;
      if (!stock[m.reagentId]) return;

      if (m.type === 'entrada') stock[m.reagentId].current += qty;
      if (m.type === 'salida') stock[m.reagentId].current -= qty;
    });

    Object.values(stock).forEach(s => {
      s.current = Math.max(0, s.current);
    });

    return stock;
  }, [movements, reagents]);

  // 📦 Cargar movimientos desde localStorage al iniciar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(KARDEX_STORAGE_KEY);
      if (stored) {
        setMovements(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error cargando Kardex:", error);
      setTimeout(() => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo cargar el Kardex."
        });
      }, 0);
      setMovements([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // 💾 Guardar Kardex en localStorage
  const updateLocalStorage = useCallback((updated) => {
    try {
      localStorage.setItem(KARDEX_STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Error guardando Kardex:", error);
      setTimeout(() => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo guardar el Kardex."
        });
      }, 0);
    }
  }, [toast]);

  // ➕ Agregar nuevo movimiento
  const addMovement = useCallback(async (data) => {
    const reagent =
      reagents.find(r => r.id === data.reagentId) ||
      (() => {
        try {
          const localData = localStorage.getItem('labReagents');
          const parsed = JSON.parse(localData || '[]');
          return parsed.find(r => r.id === data.reagentId);
        } catch {
          return null;
        }
      })();

    if (!reagent) {
      setTimeout(() => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Reactivo no encontrado."
        });
      }, 0);
      return false;
    }

    const qty = parseFloat(data.quantity) || 0;
    const current = stockLevels[data.reagentId]?.current || 0;

    if (data.type === 'salida' && qty > current) {
      setTimeout(() => {
        toast({
          variant: "destructive",
          title: "Stock insuficiente",
          description: `No hay suficiente ${reagent.name}. Stock actual: ${current.toFixed(2)} ${reagent.unit}.`
        });
      }, 0);
      return false;
    }

    try {
      const newMovement = {
        ...data,
        id: data.id || `k${Date.now()}`,
        reagentName: reagent.name,
        unit: reagent.unit,
        quantity: qty,
      };

      setMovements(prev => {
        const updated = [...prev, newMovement];
        updateLocalStorage(updated);

        setTimeout(() => {
          toast({
            title: "Éxito",
            description: `Movimiento de ${reagent.name} registrado.`,
            variant: "success",
          });
        }, 0);

        return updated;
      });

      return true;
    } catch (error) {
      console.error("Error en addMovement:", error);
      setTimeout(() => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo registrar el movimiento."
        });
      }, 0);
      return false;
    }
  }, [reagents, stockLevels, toast, updateLocalStorage]);

  // 🗑️ Eliminar movimiento
  const deleteMovement = useCallback((idToDelete) => {
    const movement = movements.find(m => m.id === idToDelete);
    if (!movement) return;

    setMovements(prev => {
      const updated = prev.filter(m => m.id !== idToDelete);
      updateLocalStorage(updated);

      setTimeout(() => {
        toast({
          title: "Éxito",
          description: `Movimiento eliminado.`,
          variant: "success",
        });
      }, 0);

      return updated;
    });
  }, [movements, toast, updateLocalStorage]);

  // 🧪 Retornar hook completo
  return {
    movements,
    stockLevels,
    addMovement,
    deleteMovement,
    loading: loading || reagentsLoading,
    reagentList: reagents
  };
}