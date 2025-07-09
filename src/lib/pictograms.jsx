
import React from 'react';
import { Flame, ShieldAlert, Skull, HelpCircle, Biohazard, Droplet, Bomb, Radiation as Radioactive, CircleDot } from 'lucide-react'; // Add more icons as needed
import { cn } from '@/lib/utils';


// Centralized pictogram definition
export const pictogramDefinitions = {
  flammable: { label: 'Inflamable', icon: Flame, color: 'text-red-600 dark:text-red-500' },
  corrosive: { label: 'Corrosivo', icon: ShieldAlert, color: 'text-yellow-600 dark:text-yellow-500' },
  toxic: { label: 'Tóxico Agudo', icon: Skull, color: 'text-black dark:text-gray-300' },
  irritant: { label: 'Irritante/Nocivo', icon: HelpCircle, color: 'text-orange-500' },
  health_hazard: { label: 'Peligro Salud', icon: Biohazard, color: 'text-blue-600 dark:text-blue-400' },
  environment: { label: 'Peligro Ambiental', icon: Droplet, color: 'text-green-600 dark:text-green-400' },
  explosive: { label: 'Explosivo', icon: Bomb, color: 'text-red-700' },
  oxidizing: { label: 'Comburente', icon: Flame, color: 'text-orange-600' }, // Often similar icon to flammable, adjust if needed
  gas_pressure: { label: 'Gas a Presión', icon: CircleDot, color: 'text-gray-500' }, // Placeholder icon
  // radioactive: { label: 'Radioactivo', icon: Radioactive, color: 'text-yellow-400' }, // Example if needed
};

export const getPictogramIcon = (id, className = 'h-5 w-5') => {
  const pictogram = pictogramDefinitions[id];
  if (!pictogram) return <HelpCircle className={cn(className, 'text-gray-400')} title="Pictograma Desconocido" />;

  const IconComponent = pictogram.icon;
  return <IconComponent className={cn(className, pictogram.color)} title={pictogram.label} />;
};

export const getPictogramLabel = (id) => {
  return pictogramDefinitions[id]?.label || 'Desconocido';
};

// Export options for forms etc.
export const pictogramOptionsList = Object.entries(pictogramDefinitions).map(([id, { label, icon, color }]) => ({
    id,
    label,
    icon: React.createElement(icon, {className: cn('h-4 w-4', color)}) // Pre-render icon for forms
}));
