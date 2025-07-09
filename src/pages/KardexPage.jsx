import React, { useState, useMemo } from 'react';

//  Componentes UI: importar desde archivos individuales button input
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

//  Íconos y animaciones
import {
  ClipboardList,
  PlusCircle,
  Search,
  X,
  Loader2,
  FlaskConical
} from 'lucide-react';
import { motion } from 'framer-motion';

// ✅ Hooks y lógica
import { useAuth } from '@/context/AuthContext';
import { useKardex } from '@/hooks/useKardex';
import { useRegistrarReactivoConEntrada } from '@/hooks/kardex/useRegistrarReactivoConEntrada';
import { useReagents } from '@/hooks/useReagents';

// ✅ Componentes del Kardex
import StockSummary from '@/components/kardex/StockSummary';
import MovementList from '@/components/kardex/MovementList';
import MovementForm from '@/components/kardex/MovementForm';

// ✅ Componente para el formulario de reactivos
import ReagentForm from '@/components/reagents/ReagentForm';

const KardexPage = () => {
  const { user } = useAuth();
  const isProfessor = user?.role === 'Profesor';

  const {
    movements,
    stockLevels,
    addMovement,
    deleteMovement,
    loading: kardexLoading,
    reagentList
  } = useKardex();

  const {
    reagents,
    addReagent,
    loading: reagentsLoading
  } = useReagents();

  const { registrarReactivo } = useRegistrarReactivoConEntrada({
    addReagent,
    addMovement,
    reagents,
    user
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterReagent, setFilterReagent] = useState('all');
  const [isMovementFormOpen, setIsMovementFormOpen] = useState(false);
  const [isReagentFormOpen, setIsReagentFormOpen] = useState(false);

  const isLoading = kardexLoading || reagentsLoading;

  const filteredMovements = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return movements
      .filter(m => {
        const matchReagent = filterReagent === 'all' || m.reagentId === filterReagent;
        const matchSearch =
          m.reagentName?.toLowerCase().includes(term) ||
          m.description?.toLowerCase().includes(term) ||
          m.clase?.toLowerCase().includes(term) ||
          m.responsable?.toLowerCase().includes(term);
        return matchReagent && matchSearch;
      })
      .sort((a, b) => new Date(b.date + 'T00:00:00') - new Date(a.date + 'T00:00:00'));
  }, [movements, filterReagent, searchTerm]);

  const reagentTypes = useMemo(
    () => [...new Set(reagents.map(r => r.type || 'Sin Tipo'))].sort(),
    [reagents]
  );

  const handleMovementFormSubmit = async formData => {
    const success = await addMovement(formData);
    if (success) setIsMovementFormOpen(false);
  };

  const handleReagentFormSubmit = async formData => {
    await registrarReactivo(formData, () => setIsReagentFormOpen(false));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-60">
          <Loader2 className="h-10 w-10 animate-spin text-primary-foreground dark:text-blue-400" />
          <span className="ml-3 text-muted-foreground">Cargando datos...</span>
        </div>
      ) : (
        <>
          <StockSummary stockLevels={stockLevels} />

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg border-blue-200 dark:border-slate-700 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700/80 p-4 md:p-6">
              <CardTitle className="text-2xl md:text-3xl font-bold text-primary-foreground dark:text-blue-300 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <ClipboardList className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                  <span>Kardex de Movimientos</span>
                </div>
                {isProfessor && (
                  <div className="flex gap-2 flex-wrap">
                    <Dialog open={isMovementFormOpen} onOpenChange={setIsMovementFormOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md btn-effect"
                        >
                          <PlusCircle className="mr-2 h-4 w-4" /> Registrar Movimiento
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[550px] bg-white dark:bg-slate-900 border dark:border-slate-700">
                        <DialogHeader>
                          <DialogTitle>Registrar Nuevo Movimiento</DialogTitle>
                          <DialogDescription>
                            Añade una nueva entrada o salida de reactivo al inventario.
                          </DialogDescription>
                        </DialogHeader>
                        <MovementForm
                          onSubmit={handleMovementFormSubmit}
                          reagents={reagentList}
                          stockLevels={stockLevels}
                          user={user}
                          onCancel={() => setIsMovementFormOpen(false)}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </CardTitle>
              <CardDescription className="text-muted-foreground dark:text-slate-400 pt-1">
                Historial detallado de entradas y salidas de reactivos.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-4 mb-5">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar en movimientos..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10 w-full rounded-full h-10 bg-white/70 dark:bg-slate-700/50"
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => setSearchTerm('')}
                      aria-label="Limpiar búsqueda"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Select onValueChange={setFilterReagent} value={filterReagent}>
                  <SelectTrigger className="w-full md:w-[250px] rounded-full h-10 bg-white/70 dark:bg-slate-700/50">
                    <SelectValue placeholder="Filtrar por reactivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los reactivos</SelectItem>
                    {reagentList
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map(r => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <MovementList
                movements={filteredMovements}
                onDelete={isProfessor ? deleteMovement : undefined}
                userRole={user?.role}
              />
            </CardContent>
          </Card>
        </>
      )}
    </motion.div>
  );
};

export default KardexPage;