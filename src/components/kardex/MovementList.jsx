
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpCircle, ArrowDownCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const MovementList = ({ movements, onDelete, userRole }) => {
  const isProfessor = userRole === 'Profesor';

  const formatDate = (dateString) => {
    try {
      // Adding 'T00:00:00' ensures the date is interpreted in the local timezone, not UTC
      return new Date(dateString + 'T00:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return dateString; // Fallback
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border dark:border-slate-700 shadow-md">
      <Table>
        <TableHeader className="bg-slate-50 dark:bg-slate-700/50 sticky top-0">
          <TableRow>
            <TableHead className="w-[100px]">Fecha</TableHead>
            <TableHead>Reactivo</TableHead>
            <TableHead className="w-[100px]">Tipo</TableHead>
            <TableHead className="text-right w-[90px]">Cantidad</TableHead>
            <TableHead className="w-[50px]">Unid.</TableHead>
            <TableHead>Clase/Exp.</TableHead>
            <TableHead>Responsable</TableHead>
            <TableHead>Descripción</TableHead>
            {isProfessor && <TableHead className="text-right w-[80px]">Acciones</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {movements.length > 0 ? (
              movements.map((mov) => (
                <motion.tr
                  key={mov.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors duration-150 text-sm"
                >
                  <TableCell>{formatDate(mov.date)}</TableCell>
                  <TableCell className="font-medium">{mov.reagentName}</TableCell>
                  <TableCell>
                    {mov.type === 'entrada' ? (
                      <span className="flex items-center text-green-600 dark:text-green-400 font-medium">
                        <ArrowUpCircle className="mr-1 h-4 w-4 flex-shrink-0" /> Entrada
                      </span>
                    ) : (
                      <span className="flex items-center text-red-600 dark:text-red-400 font-medium">
                        <ArrowDownCircle className="mr-1 h-4 w-4 flex-shrink-0" /> Salida
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono">{mov.quantity?.toFixed(2)}</TableCell>
                  <TableCell className="text-muted-foreground">{mov.unit}</TableCell>
                  <TableCell className="text-xs">{mov.clase || '-'}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{mov.responsable || '-'}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate" title={mov.description}>{mov.description || '-'}</TableCell>
                  {isProfessor && (
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 h-8 w-8 btn-effect" title="Eliminar Movimiento">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white dark:bg-slate-800">
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Eliminará el registro de <span className="font-semibold">{mov.type === 'entrada' ? 'entrada' : 'salida'}</span> de <span className="font-semibold">{mov.quantity?.toFixed(2)} {mov.unit}</span> de <span className="font-semibold">{mov.reagentName}</span> del día {formatDate(mov.date)}. <span className="font-bold text-destructive dark:text-red-400">El stock se reajustará.</span>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(mov.id)} className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 btn-effect">
                              Sí, eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  )}
                </motion.tr>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={isProfessor ? 9 : 8} className="h-24 text-center text-muted-foreground italic">
                  No se encontraron movimientos con los filtros actuales.
                </TableCell>
              </TableRow>
            )}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  );
};

export default MovementList;
