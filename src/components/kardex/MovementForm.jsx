
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';

const MovementForm = ({ onSubmit, reagents, stockLevels, onCancel, user }) => {
  const defaultFormData = {
    date: new Date().toISOString().split('T')[0],
    reagentId: '',
    type: 'salida',
    quantity: '',
    responsable: user?.username || '', // Default to logged-in user
    clase: '',
    description: ''
  };

  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    // Reset form if needed, e.g., when dialog opens
    setFormData(defaultFormData);
  }, []); // Consider adding dependency if parent controls opening


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = onSubmit(formData);
    if (success) {
      // Parent component handles closing the dialog
    }
  };

  const selectedReagentUnit = reagents.find(r => r.id === formData.reagentId)?.unit || '';


  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4 max-h-[65vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="date" className="text-right">Fecha*</Label>
          <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} className="col-span-3" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="reagentId" className="text-right">Reactivo*</Label>
          <Select name="reagentId" required onValueChange={(value) => handleSelectChange('reagentId', value)} value={formData.reagentId}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Selecciona un reactivo" />
            </SelectTrigger>
            <SelectContent>
              {reagents.sort((a, b) => a.name.localeCompare(b.name)).map(r => (
                <SelectItem key={r.id} value={r.id}>
                  {r.name} ({stockLevels[r.id]?.current.toFixed(2) || '0.00'} {r.unit})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="type" className="text-right">Tipo*</Label>
          <Select name="type" required onValueChange={(value) => handleSelectChange('type', value)} value={formData.type}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Selecciona el tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="entrada">Entrada (+)</SelectItem>
              <SelectItem value="salida">Salida (-)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="quantity" className="text-right">Cantidad*</Label>
          <div className="col-span-3 flex items-center gap-2">
            <Input id="quantity" name="quantity" type="number" step="any" min="0.01" value={formData.quantity} onChange={handleInputChange} className="flex-grow" required />
            {selectedReagentUnit && <span className="text-sm text-muted-foreground">{selectedReagentUnit}</span>}
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="responsable" className="text-right">Responsable</Label>
          <Input id="responsable" name="responsable" value={formData.responsable} onChange={handleInputChange} className="col-span-3" placeholder="Nombre del usuario" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="clase" className="text-right">Clase/Exp.</Label>
          <Input id="clase" name="clase" value={formData.clase} onChange={handleInputChange} className="col-span-3" placeholder="Ej: Práctica 1, Síntesis X" />
        </div>
        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="description" className="text-right pt-2">Descripción Uso</Label>
          <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} className="col-span-3" rows={3} placeholder="Motivo del movimiento, detalles..." />
        </div>
      </div>
      <DialogFooter className="mt-4 pt-4 border-t">
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        </DialogClose>
        <Button type="submit" className="btn-effect">Guardar Movimiento</Button>
      </DialogFooter>
    </form>
  );
};

export default MovementForm;
