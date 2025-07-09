
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'; // Corrected import
import { motion } from 'framer-motion';
import { Hand, FlaskConical, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const DashboardPage = () => {
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-xl border-none overflow-hidden rounded-lg">
          <CardHeader className="p-6">
            <CardTitle className="text-3xl md:text-4xl font-bold flex items-center drop-shadow-md">
              <motion.div
                animate={{ rotate: [0, 14, -8, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ display: 'inline-block', marginRight: '12px' }}
              >
                <Hand className="h-8 w-8 md:h-9 md:w-9" />
              </motion.div>
              ¡Bienvenido, {user?.username}!
            </CardTitle>
            <CardDescription className="text-blue-100 text-lg mt-1">
              Sistema de Gestión de Laboratorio de Química
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <p className="text-blue-50">
              Navega por las secciones usando el menú lateral o los accesos directos a continuación.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
      >
        <motion.div variants={itemVariants}>
          <Card className="h-full flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-blue-200 dark:border-slate-700 rounded-lg overflow-hidden group">
            <CardHeader className="!pb-3">
              <CardTitle className="flex items-center text-xl font-semibold text-primary-foreground dark:text-blue-300">
                <FlaskConical className="mr-3 h-7 w-7 text-cyan-600 dark:text-cyan-400 transition-transform duration-300 group-hover:rotate-[-12deg]" />
                Base de Reactivos
              </CardTitle>
              <CardDescription className="text-muted-foreground dark:text-slate-400 pt-1">
                Gestiona el inventario de reactivos químicos.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col items-center justify-center text-center">
              <img
                className="w-32 h-32 object-contain mb-4 opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                alt="Ilustración de reactivos químicos"
                src="https://images.unsplash.com/photo-1554475900-0a0350e3fc7b" />
              <p className="mb-4 text-sm text-foreground dark:text-slate-300 max-w-xs">
                Consulta fichas de seguridad, compatibilidad, agrega o elimina reactivos.
              </p>
            </CardContent>
            <CardFooter className="p-4 bg-slate-50 dark:bg-slate-800/50">
              <Link to="/reagents" className="w-full">
                <Button variant="outline" className="w-full border-primary-foreground/50 text-primary-foreground dark:border-blue-400/50 dark:text-blue-300 hover:bg-primary-foreground/10 dark:hover:bg-blue-500/20 btn-effect">
                  Ir a Reactivos
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-cyan-200 dark:border-slate-700 rounded-lg overflow-hidden group">
            <CardHeader className="!pb-3">
              <CardTitle className="flex items-center text-xl font-semibold text-primary-foreground dark:text-cyan-300">
                <ClipboardList className="mr-3 h-7 w-7 text-blue-600 dark:text-blue-400 transition-transform duration-300 group-hover:scale-110" />
                Kardex de Inventario
              </CardTitle>
              <CardDescription className="text-muted-foreground dark:text-slate-400 pt-1">
                Registra entradas y salidas de materiales.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col items-center justify-center text-center">
              <img
                className="w-32 h-32 object-contain mb-4 opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                alt="Ilustración de un kardex o inventario"
                src="https://images.unsplash.com/photo-1586282023426-f4f6f305fa07" />
              <p className="mb-4 text-sm text-foreground dark:text-slate-300 max-w-xs">
                Lleva un control detallado del uso de reactivos y materiales, con alertas de stock.
              </p>
            </CardContent>
            <CardFooter className="p-4 bg-slate-50 dark:bg-slate-800/50">
              <Link to="/kardex" className="w-full">
                <Button variant="outline" className="w-full border-primary-foreground/50 text-primary-foreground dark:border-cyan-400/50 dark:text-cyan-300 hover:bg-primary-foreground/10 dark:hover:bg-cyan-500/20 btn-effect">
                  Ir a Kardex
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;
