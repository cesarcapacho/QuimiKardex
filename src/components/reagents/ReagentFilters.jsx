
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

const ReagentFilters = ({ searchTerm, onSearchTermChange }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-5">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar por nombre o fórmula..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="pl-10 w-full rounded-full h-10 bg-white/70 dark:bg-slate-700/50"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={() => onSearchTermChange('')}
            aria-label="Limpiar búsqueda"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {/* Placeholder for potential future filters like classification */}
    </div>
  );
};

export default ReagentFilters;
