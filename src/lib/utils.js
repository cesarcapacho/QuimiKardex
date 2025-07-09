import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}
import { toast } from '@/components/ui/use-toast';

export const registrarNuevoReactivo = async ({
	fullReagent,
	reagents,
	addReagent,
	reagentList,
	addMovement,
	user,
	onDone = () => { },
}) => {
	const newId = fullReagent.id;
	addReagent(fullReagent);

	let attempts = 0;

	const intervalo = setInterval(() => {
		const exists = reagent.find(r => r.id === newId);

		if (exists || attempts >= 10) {
			clearInterval(intervalo);

			if (exists) {
				const cantidad = parseFloat(fullReagent.quantity);
				if (cantidad > 0) {
					const success = addMovement({
						id: `k${Date.now()}`,
						date: new Date().toISOString().split('T')[0],
						reagentId: newId,
						type: 'entrada',
						quantity: cantidad,
						responsable: user?.name || 'Sistema',
						clase: 'Registro inicial',
						description: 'Ingreso automático al registrar reactivo',
					});

					if (success) {
						setTimeout(() => {
							toast({
								title: 'Entrada registrada en Kardex',
								description: `${cantidad} unidad${cantidad !== 1 ? 'es' : ''} de ${fullReagent.name} añadida correctamente.`,
							});
						}, 0);
					}
				}
			} else {
				setTimeout(() => {
					toast({
						title: 'Error: Reactivo no encontrado',
						description: 'No se logró vincular el movimiento al reactivo en 1 segundo.',
						variant: 'destructive',
					});
				}, 0);
			}

			onDone?.();
		}

		attempts++;
	}, 100); 
};// ✅ Es
	// te es el cierre correcto del setInterval)