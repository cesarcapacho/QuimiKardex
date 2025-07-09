import { useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';

export function useRegistrarReactivoConEntrada({ addReagent, addMovement, user }) {
    const registrarReactivo = useCallback(async (formData, onDone = () => { }) => {
        const newId = `r${Date.now()}`;
        const fullReagent = { ...formData, id: newId };

        try {
            const reagentAdded = await addReagent(fullReagent);
            if (!reagentAdded) throw new Error('No se pudo registrar el reactivo');

            const cantidad = parseFloat(fullReagent.quantity);

            if (cantidad > 0) {
                // ⏳ Esperar brevemente para que Kardex sincronice el nuevo reactivo
                await new Promise(resolve => setTimeout(resolve, 300));

                const movementAdded = await addMovement({
                    id: `k${Date.now()}`,
                    date: new Date().toISOString().split("T")[0],
                    reagentId: newId,
                    type: "entrada",
                    quantity: cantidad,
                    responsable: user?.name || "Sistema",
                    clase: "Registro inicial",
                    description: "Ingreso automático al registrar reactivo",
                });

                if (!movementAdded) throw new Error('No se pudo registrar el movimiento');

                setTimeout(() => {
                    toast({
                        title: "Entrada registrada",
                        description: `${cantidad} unidad${cantidad !== 1 ? "es" : ""} de ${fullReagent.name} añadida correctamente.`,
                        variant: "success",
                    });
                }, 0);
            }

            onDone();
        } catch (error) {
            console.error("Error en registrarReactivo:", error);
            setTimeout(() => {
                toast({
                    title: "Error al registrar",
                    description: error.message,
                    variant: "destructive",
                });
            }, 0);
            onDone();
        }
    }, [addReagent, addMovement, user]);

    return { registrarReactivo };
}