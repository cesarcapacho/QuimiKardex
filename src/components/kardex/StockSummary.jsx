
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Thresholds for traffic light (adjust as needed)
const STOCK_THRESHOLDS = {
  low: 2, // Quantity below or equal to this is 'low' (yellow)
  out: 0, // Quantity equal to this is 'out' (red)
};

const getStockStatusColor = (quantity) => {
  if (quantity === undefined || quantity === null) return 'text-gray-400 dark:text-gray-600'; // Unknown
  if (quantity <= STOCK_THRESHOLDS.out) return 'text-red-500 dark:text-red-600'; // Out of stock
  if (quantity <= STOCK_THRESHOLDS.low) return 'text-yellow-500 dark:text-yellow-400'; // Low stock
  return 'text-green-500 dark:text-green-400'; // Sufficient stock
};

const StockSummary = ({ stockLevels }) => {
  const sortedStockEntries = Object.entries(stockLevels).sort(([, a], [, b]) => a.name.localeCompare(b.name));

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-md border-cyan-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-primary-foreground dark:text-cyan-300">Resumen de Stock</CardTitle>
        <CardDescription className="text-muted-foreground dark:text-slate-400">Niveles actuales (Verde: Suficiente, Amarillo: Bajo, Rojo: Agotado).</CardDescription>
      </CardHeader>
      <CardContent>
        {sortedStockEntries.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-3">
            {sortedStockEntries.map(([id, stock]) => (
              <div key={id} className="flex items-center space-x-2 p-2 rounded-md bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
                <Circle className={cn("h-3.5 w-3.5 fill-current flex-shrink-0", getStockStatusColor(stock.current))} />
                <div className="overflow-hidden">
                  <div className="text-sm font-medium text-foreground dark:text-slate-200 truncate" title={stock.name}>{stock.name}</div>
                  <div className="text-xs text-muted-foreground dark:text-slate-400">{stock.current.toFixed(2)} {stock.unit}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic col-span-full text-center py-4">No hay datos de stock disponibles. Agrega reactivos primero.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StockSummary;
