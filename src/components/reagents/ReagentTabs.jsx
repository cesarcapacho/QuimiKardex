
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs'; // Removed Tabs import

// Renamed component to reflect it only renders the list part
const ReagentTabsList = ({ types }) => {
  return (
    // Removed the wrapping <Tabs> component
    <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:flex lg:flex-wrap h-auto justify-start mb-4 p-1 bg-slate-100 dark:bg-slate-900/50 rounded-lg shadow-inner">
      {types.map((type) => (
        <TabsTrigger
          key={type}
          value={type} // This value must match a TabsContent value in the parent
          className="capitalize data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md text-xs sm:text-sm px-3 py-1.5 h-auto transition-all duration-200 ease-in-out"
        >
          {type === 'all' ? 'Todos' : type}
        </TabsTrigger>
      ))}
    </TabsList>
    // Removed the closing </Tabs> tag
  );
};

export default ReagentTabsList;
