
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { fdsTitulos } from '@/constants/fdsTitulos';
import { Checkbox } from '@/components/ui/checkbox'; // Needs creation
import { Flame, FlaskConical as TypeIcon, TestTube, Droplet, Biohazard, Skull, Bot, HelpCircle, ShieldAlert, Atom } from 'lucide-react'; // Example icons

const pictogramOptions = [
  { id: 'flammable', label: 'Inflamable', icon: <Flame className="h-4 w-4 text-red-600" /> },
  { id: 'corrosive', label: 'Corrosivo', icon: <ShieldAlert className="h-4 w-4 text-yellow-600" /> },
  { id: 'toxic', label: 'Tóxico', icon: <Skull className="h-4 w-4 text-black dark:text-white" /> },
  { id: 'irritant', label: 'Irritante/Nocivo', icon: <HelpCircle className="h-4 w-4 text-orange-500" /> },
  { id: 'health_hazard', label: 'Peligro Salud', icon: <Biohazard className="h-4 w-4 text-blue-600" /> },
  { id: 'environment', label: 'Peligro Ambiental', icon: <Droplet className="h-4 w-4 text-green-600" /> },
  // Add more as needed
];

const classificationOptions = [
  'Corrosivo',
  'Inflamable',
  'Tóxico',
  'Irritante',
  'Peligro Salud',
  'Peligro Ambiental',
  'No Peligroso'
];

const typeOptions = [
  'Ácido',
  'Base',
  'Alcohol',
  'Solvente',
  'Sal',
  'Oxidante',
  'Reductor',
  'Metal',
  'No Peligroso'
];

const classificationToPictograms = {
  'Corrosivo': ['corrosive'],
  'Inflamable': ['flammable'],
  'Tóxico': ['toxic'],
  'Irritante': ['irritant'],
  'Peligro Salud': ['health_hazard'],
  'Peligro Ambiental': ['environment'],
  'No Peligroso': [],
};


const ReagentForm = ({ onSubmit, initialData, availableTypes, onCancel }) => {
  const defaultFormData = {
    id: null,
    name: '',
    type: '', // e.g., Ácido, Base, Solvente
    classification: '', // e.g., Corrosivo, Inflamable
    formula: '',
    quantity: '',
    unit: 'L',
    precautions: '',
    safetyPoints: Array(16).fill(''), // 16 points
    pictograms: [], // Array of pictogram IDs like ['flammable', 'toxic']
    compatibility: '',
    description: ''
  };

  const [formData, setFormData] = useState(initialData || defaultFormData);
  const [selectedPictograms, setSelectedPictograms] = useState(new Set(formData.pictograms));

  useEffect(() => {
    setFormData(initialData || defaultFormData);
    setSelectedPictograms(new Set(initialData?.pictograms || []));
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    const updatedForm = { ...formData, [name]: value };

    if (name === 'classification') {
      const autoPictos = classificationToPictograms[value] || [];
      updatedForm.pictograms = autoPictos;
      setSelectedPictograms(new Set(autoPictos)); // sincroniza visual
    }

    setFormData(updatedForm);
  };

  const handlePictogramChange = (pictogramId, checked) => {
    setSelectedPictograms(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(pictogramId);
      } else {
        newSet.delete(pictogramId);
      }
      setFormData({ ...formData, pictograms: Array.from(newSet) }); // Update form data immediately
      return newSet;
    });
  };

  const handleFDSChange = (index, value) => {
    const updatedPoints = [...formData.safetyPoints];
    updatedPoints[index] = value;
    setFormData({ ...formData, safetyPoints: updatedPoints });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, pictograms: Array.from(selectedPictograms) });
    // No reset needed here, parent component handles dialog closing/state
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4 max-h-[65vh] overflow-y-auto pr-2">
        {/* Nombre */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">Nombre*</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="col-span-3"
            required
          />
        </div>

        {/* Fórmula */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="formula" className="text-right">Fórmula</Label>
          <Input
            id="formula"
            name="formula"
            value={formData.formula}
            onChange={handleInputChange}
            className="col-span-3"
            placeholder="Ej: HCl, C2H5OH"
          />
        </div>

        {/* Tipo */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Tipo*</Label>
          <Select
            name="type"
            required
            onValueChange={(value) => handleSelectChange('type', value)}
            value={formData.type}
          >
            <SelectTrigger className="col-span-3 h-10 px-3 text-sm">
              <SelectValue placeholder="Selecciona un tipo" />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clasificación */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="classification" className="text-right">Clasificación*</Label>
          <Select
            name="classification"
            required
            onValueChange={(value) => handleSelectChange('classification', value)}
            value={formData.classification}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Selecciona una clasificación" />
            </SelectTrigger>
            <SelectContent>
              {classificationOptions.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Cantidad y unidad */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="quantity" className="text-right">Cantidad*</Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            step="any"
            min="0"
            value={formData.quantity}
            onChange={handleInputChange}
            className="col-span-2"
            required
          />
          <Select
            name="unit"
            required
            onValueChange={(value) => handleSelectChange('unit', value)}
            value={formData.unit}
          >
            <SelectTrigger className="col-span-1">
              <SelectValue placeholder="Unidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L">L</SelectItem>
              <SelectItem value="mL">mL</SelectItem>
              <SelectItem value="kg">kg</SelectItem>
              <SelectItem value="g">g</SelectItem>
              <SelectItem value="mg">mg</SelectItem>
              <SelectItem value="unidad">unidad</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Pictogramas */}
        <div className="grid grid-cols-4 items-start gap-4">
          <Label className="text-right pt-2">Pictogramas</Label>
          <div className="col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {pictogramOptions.map(p => (
              <div key={p.id} className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-700/50 p-2 rounded-md">
                <Checkbox
                  id={`pictogram-${p.id}`}
                  checked={selectedPictograms.has(p.id)}
                  onCheckedChange={(checked) => handlePictogramChange(p.id, checked)}
                />
                <Label htmlFor={`pictogram-${p.id}`} className="flex items-center gap-1 text-xs cursor-pointer">
                  {p.icon} {p.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Descripción */}
        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="description" className="text-right pt-2">Descripción</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="col-span-3"
            rows={2}
            placeholder="Uso principal, notas..."
          />
        </div>

        {/* Precauciones */}
        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="precautions" className="text-right pt-2">Precauciones</Label>
          <Textarea
            id="precautions"
            name="precautions"
            value={formData.precautions}
            onChange={handleInputChange}
            className="col-span-3"
            rows={3}
            placeholder="Medidas de seguridad específicas..."
          />
        </div>

        {/* Compatibilidad */}
        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="compatibility" className="text-right pt-2">Compatibilidad</Label>
          <Textarea
            id="compatibility"
            name="compatibility"
            value={formData.compatibility}
            onChange={handleInputChange}
            className="col-span-3"
            rows={3}
            placeholder="Sustancias a evitar..."
          />
        </div>

        {/* Ficha de Seguridad */}
        <div className="mt-8 space-y-6">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-100">
            Ficha de Datos de Seguridad (FDS)
          </h3>

          {fdsTitulos.map((titulo, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {index + 1}. {titulo}
              </label>
              <textarea
                rows={3}
                value={formData.safetyPoints[index]}
                onChange={(e) => handleFDSChange(index, e.target.value)}
                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-sm resize-vertical"
              />
            </div>
          ))}
        </div> {/* ✅ Cierre correcto del bloque FDS */}





        {/* Botones */}
        <DialogFooter className="mt-4 pt-4 border-t">
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" className="btn-effect">
            {formData.id ? 'Actualizar' : 'Guardar'} Reactivo
          </Button>
        </DialogFooter>

</div>
    </form>
  );
}

export default ReagentForm;
