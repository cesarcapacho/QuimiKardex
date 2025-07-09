import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { getPictogramIcon } from '@/lib/pictograms';

const ReagentList = ({ reagents, stockLevels, onDetails, onEdit, onDelete, userRole }) => {
  const isProfessor = userRole === 'Profesor';

  const renderQuantity = (reagent) =>
    (stockLevels?.[reagent.id]?.current ?? reagent.quantity ?? 0).toFixed(2);

  const renderPictograms = (reagent) => {
    const icons = reagent.pictograms?.slice(0, 3) || [];
    return (
      <div className="flex space-x-1">
        {icons.map((pId) => (
          <span key={pId}>{getPictogramIcon(pId, 'h-4 w-4')}</span>
        ))}
        {reagent.pictograms?.length > 3 && (
          <span className="text-xs text-muted-foreground">
            +{reagent.pictograms.length - 3}
          </span>
        )}
      </div>
    );
  };

  const renderActions = (reagent) => (
    <div className="text-right space-x-1 py-3" onClick={(e) => e.stopPropagation()}>
      <Button
        variant="ghost"
        size="icon"
        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 h-8 w-8 btn-effect"
        onClick={() => onDetails(reagent)}
        title="Ver Detalles"
      >
        <Eye className="h-4 w-4" />
      </Button>

      {isProfessor && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300 h-8 w-8 btn-effect"
            onClick={() => onEdit(reagent)}
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 h-8 w-8 btn-effect"
                title="Eliminar"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="bg-white dark:bg-slate-900 border dark:border-slate-700">
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás realmente seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esto eliminará permanentemente el reactivo{' '}
                  <span className="font-semibold">{reagent.name}</span>.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(reagent.id)}
                  className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 btn-effect"
                >
                  Sí, eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );

  return (
    <div className="overflow-x-auto rounded-lg border dark:border-slate-700 shadow-md bg-white/50 dark:bg-slate-800/30">
      <Table>
        <TableHeader className="bg-slate-100 dark:bg-slate-700/50 sticky top-0 z-10">
          <TableRow>
            <TableHead className="w-[30%]">Nombre</TableHead>
            <TableHead>Fórmula</TableHead>
            <TableHead>Clasificación</TableHead>
            <TableHead className="text-right">Cantidad</TableHead>
            <TableHead>Unidad</TableHead>
            <TableHead>Pictogramas</TableHead>
            <TableHead className="text-right w-[120px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <AnimatePresence>
            {reagents.length > 0 ? (
              reagents.map((reagent) => (
                <motion.tr
                  key={reagent.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="hover:bg-primary-foreground/5 dark:hover:bg-blue-500/10 transition-colors duration-150 cursor-pointer"
                  onClick={() => onDetails(reagent)}
                >
                  <TableCell className="font-medium text-primary-foreground dark:text-blue-300 py-3">
                    {reagent.name}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground py-3">
                    {reagent.formula || '-'}
                  </TableCell>
                  <TableCell className="text-xs py-3">
                    {reagent.classification || '-'}
                  </TableCell>
                  <TableCell className="text-right font-semibold py-3">
                    {renderQuantity(reagent)}
                  </TableCell>
                  <TableCell className="py-3">{reagent.unit}</TableCell>
                  <TableCell className="py-3">{renderPictograms(reagent)}</TableCell>
                  <TableCell>{renderActions(reagent)}</TableCell>
                </motion.tr>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-32 text-center text-muted-foreground italic"
                >
                  No se encontraron reactivos que coincidan con la búsqueda o filtro actual.
                </TableCell>
              </TableRow>
            )}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  );
};

export default ReagentList;