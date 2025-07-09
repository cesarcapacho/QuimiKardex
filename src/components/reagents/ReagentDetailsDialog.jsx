
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getPictogramIcon, getPictogramLabel } from '@/lib/pictograms';
import { fdsTitulos } from '@/constants/fdsTitulos';
import { Badge } from '@/components/ui/badge'; // Needs creation



const DetailItem = ({ label, value, isBlock = false, className = "" }) => (
    value || value === 0 ? ( // Allow showing 0 quantity
        <div className={`grid ${isBlock ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-3'} gap-1 py-2 border-b border-border/50 last:border-b-0 ${className}`}>
            <span className="font-semibold text-muted-foreground text-sm sm:col-span-1">{label}:</span>
            <div className={`sm:col-span-2 text-sm ${isBlock ? 'mt-1 whitespace-pre-wrap bg-slate-50 dark:bg-slate-700/50 p-3 rounded-md border dark:border-slate-600' : ''}`}>
                {value}
            </div>
        </div>
    ) : null
);


const ReagentDetailsDialog = ({ reagent, isOpen, onClose, stockLevels }) => {
    if (!reagent) return null;

    const renderPictograms = () => (
        <div className="flex flex-wrap gap-2 items-center">
            {reagent.pictograms?.length > 0 ? (
                reagent.pictograms.map(pId => (
                    <Badge key={pId} variant="outline" className="flex items-center space-x-1.5 py-1 px-2 border-border">
                        {getPictogramIcon(pId, 'h-4 w-4')}
                        <span className="text-xs">{getPictogramLabel(pId)}</span>
                    </Badge>
                ))
            ) : (
                <span className="text-muted-foreground italic">N/A</span>
            )}
        </div>
    );

    const puntos = Array.isArray(reagent.safetyPoints)
        ? reagent.safetyPoints
        : (reagent.safetyPoints || '').split('\n');

    const formattedSafetyPoints = puntos.length > 0
        ? puntos.map((texto, index) => (
            <div key={index} className="mb-4">
                <div className="font-semibold text-blue-700 dark:text-blue-300">
                    {index + 1}. {fdsTitulos[index] || `Punto ${index + 1}`}
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {texto}
                </p>
            </div>
        ))
        : <span className="text-muted-foreground italic">Información no disponible.</span>;



    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] bg-white dark:bg-slate-900 shadow-xl border dark:border-slate-700">
                <DialogHeader className="pr-10">
                    <DialogTitle className="text-2xl text-primary-foreground dark:text-blue-300">{reagent.name}</DialogTitle>
                    <DialogDescription>
                        Detalles completos del reactivo químico.
                    </DialogDescription>
                </DialogHeader>
                <Separator className="my-2 bg-border/60" />
                <ScrollArea className="max-h-[65vh] pr-4 -mr-2">
                    <div className="space-y-1">
                        <DetailItem label="Fórmula" value={reagent.formula || <span className="italic text-muted-foreground">N/A</span>} />
                        <DetailItem label="Tipo" value={reagent.type || <span className="italic text-muted-foreground">N/A</span>} />
                        <DetailItem label="Clasificación" value={reagent.classification || <span className="italic text-muted-foreground">N/A</span>} />
                        <DetailItem
                            label="Cantidad Actual"
                            value={`${(stockLevels?.[reagent.id]?.current ?? reagent.quantity ?? 0).toFixed(2)} ${reagent.unit}`}
                        />
                        <DetailItem label="Pictogramas" value={renderPictograms()} />
                        <DetailItem label="Descripción" value={reagent.description || <span className="italic text-muted-foreground">N/A</span>} isBlock />
                        <DetailItem label="Precauciones" value={reagent.precautions || <span className="italic text-muted-foreground">N/A</span>} isBlock />
                        <DetailItem label="Compatibilidad" value={reagent.compatibility || <span className="italic text-muted-foreground">N/A</span>} isBlock />
                        <DetailItem label="Ficha Seguridad (16 Puntos)" value={formattedSafetyPoints} isBlock className="border-b-0" />
                    </div>
                </ScrollArea>
                <DialogFooter className="mt-4 pt-4 border-t dark:border-slate-700">
                    <DialogClose asChild>
                        <Button type="button" variant="outline" className="btn-effect">Cerrar</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ReagentDetailsDialog;
