
import React, { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent } from '@/components/ui/tabs'; // Import Tabs root component
import { useAuth } from '@/context/AuthContext';
import { useReagents } from '@/hooks/useReagents';
import ReagentList from '@/components/reagents/ReagentList';
import ReagentForm from '@/components/reagents/ReagentForm';
import ReagentDetailsDialog from '@/components/reagents/ReagentDetailsDialog';
import { useKardex } from '@/hooks/useKardex';
import ReagentFilters from '@/components/reagents/ReagentFilters';
import ReagentTabsList from '@/components/reagents/ReagentTabs'; // Renamed component import for clarity
import { motion } from 'framer-motion';
import { PlusCircle, Loader2, FlaskConical } from 'lucide-react';

const ReagentsPage = () => {
  const { user } = useAuth();
  const { reagents, addReagent, updateReagent, deleteReagent, loading } = useReagents();
  const { addMovement, stockLevels } = useKardex();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingReagent, setEditingReagent] = useState(null);
  const [detailsReagent, setDetailsReagent] = useState(null);

  const [newReagentPending, setNewReagentPending] = useState(null);

  useEffect(() => {
    if (!newReagentPending) return;

    const exists = reagents.find(r => r.id === newReagentPending.id);
    if (exists) {
      const cantidad = parseFloat(newReagentPending.quantity);
      if (cantidad > 0) {
        addMovement({
          date: new Date().toISOString().split('T')[0],
          reagentId: newReagentPending.id,
          type: 'entrada',
          quantity: cantidad,
          responsable: user?.name || 'Sistema',
          clase: 'Registro inicial',
          description: 'Ingreso automático desde Inventario'
        });
      }

      setNewReagentPending(null); // Limpiamos después de ejecutar
    }
  }, [reagents, newReagentPending]);

  const isProfessor = user?.role === 'Profesor';

  const reagentTypes = useMemo(() => ['all', ...new Set(reagents.map(r => r.type || 'Sin Tipo').sort())], [reagents]);

  const filteredReagents = useMemo(() => {
    return reagents.filter(reagent => {
      const typeToCheck = reagent.type || 'Sin Tipo';
      const matchesTab = activeTab === 'all' || typeToCheck === activeTab;
      const nameMatches = reagent.name.toLowerCase().includes(searchTerm.toLowerCase());
      const formulaMatches = reagent.formula && reagent.formula.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSearch = searchTerm === '' || nameMatches || formulaMatches;
      return matchesTab && matchesSearch;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [reagents, activeTab, searchTerm]);



  const handleAddClick = () => {
    setEditingReagent(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (reagent) => {
    setEditingReagent(reagent);
    setIsFormOpen(true);
  };

  const handleDetailsClick = (reagent) => {
    setDetailsReagent(reagent);
    setIsDetailsOpen(true);
  };

  const handleFormSubmit = (formData) => {
    const isEditing = Boolean(editingReagent);
    const newId = isEditing ? editingReagent.id : `r${Date.now()}`;
    const fullReagent = { ...formData, id: newId };

    if (isEditing) {
      updateReagent(fullReagent);
    } else {
      addReagent(fullReagent);
      setNewReagentPending(fullReagent); // ⚠️ Aquí activamos el efecto
    }

    setIsFormOpen(false);
    setEditingReagent(null);
  };

  const handleDelete = (id) => {
    deleteReagent(id);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingReagent(null);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg border-blue-200 dark:border-slate-700 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700/80 p-4 md:p-6">
          <CardTitle className="text-2xl md:text-3xl font-bold text-primary-foreground dark:text-blue-300 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FlaskConical className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              <span>Base de Reactivos</span>
            </div>

            {isProfessor && (
              <Dialog open={isFormOpen} onOpenChange={(open) => {
                setIsFormOpen(open);
                if (!open) setEditingReagent(null);
              }}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md btn-effect" onClick={handleAddClick}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Agregar Reactivo
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[650px] bg-white dark:bg-slate-900 border dark:border-slate-700">
                  <DialogHeader>
                    <DialogTitle>{editingReagent ? 'Editar Reactivo' : 'Agregar Nuevo Reactivo'}</DialogTitle>
                    <DialogDescription>
                      {editingReagent ? 'Modifica la información del reactivo.' : 'Completa la información del nuevo reactivo químico.'}
                    </DialogDescription>
                  </DialogHeader>
                  <ReagentForm
                    onSubmit={handleFormSubmit}
                    initialData={editingReagent}
                    availableTypes={reagentTypes.filter(t => t !== 'all')}
                    onCancel={handleFormClose}
                  />
                </DialogContent>
              </Dialog>
            )}
          </CardTitle>
          <CardDescription className="text-muted-foreground dark:text-slate-400 pt-1">
            Consulta, agrega, edita y gestiona los reactivos químicos del laboratorio.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <ReagentFilters searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />

          {/* Wrap TabsList and TabsContent in Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <ReagentTabsList types={reagentTypes} />

            {/* Content for the active tab - Now correctly nested */}
            <TabsContent value={activeTab} className="mt-0 outline-none ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-foreground dark:text-blue-400" />
                  <span className="ml-2 text-muted-foreground">Cargando reactivos...</span>
                </div>
              ) : (
                <ReagentList
                  reagents={filteredReagents}
                  stockLevels={stockLevels} // ✅ este es el cambio clave
                  onDetails={handleDetailsClick}
                  onEdit={isProfessor ? handleEditClick : undefined}
                  onDelete={isProfessor ? handleDelete : undefined}
                  userRole={user?.role}
                />
              )}
            </TabsContent>
            {/* You can add more TabsContent blocks here if needed for other tabs, matching their 'value' */}
          </Tabs>
        </CardContent>
      </Card>

      {/* Details Modal */}
      <ReagentDetailsDialog
        reagent={detailsReagent}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        stockLevels={stockLevels} // ✅ aquí se lo pasamos
      />
    </motion.div>
  );
};

export default ReagentsPage;
