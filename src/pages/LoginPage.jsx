
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { LogIn, AlertCircle, TestTube as TestTubeDiagonal } from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const success = login(username, password);
    if (success) {
      toast({
        title: "Inicio de Sesión Exitoso",
        description: `Bienvenido de nuevo, ${username}! Redirigiendo...`,
        className: "bg-green-100 dark:bg-green-800 border-green-300 dark:border-green-600",
      });
      navigate('/');
    } else {
      setError('Usuario o contraseña incorrectos.');
      toast({
        variant: "destructive",
        title: "Error de Inicio de Sesión",
        description: "Las credenciales proporcionadas no son válidas.",
      });
    }
  };

  return (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100 dark:from-slate-900 dark:via-blue-950 dark:to-cyan-950 p-4">
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-sm sm:max-w-md"
    >
      <Card className="shadow-2xl border-none bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-xl overflow-hidden">
        <CardHeader className="text-center bg-gradient-to-r from-blue-500 to-cyan-500 p-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
            className="mx-auto mb-4 p-4 rounded-full bg-white/20 text-white shadow-lg backdrop-blur-sm"
          >
            <TestTubeDiagonal className="h-10 w-10" />
          </motion.div>
          <CardTitle className="text-3xl font-bold text-white drop-shadow-md">
            SENA - QuimiKardex
          </CardTitle>
          <CardDescription className="text-blue-100">
            Sistema de Gestión de Reactivos
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-primary-foreground dark:text-blue-300">
                Iniciar Sesión
              </h2>
              <p className="text-sm text-muted-foreground dark:text-slate-400">
                Accede al sistema
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-white/60 dark:bg-slate-700/60 border-border focus:border-primary-foreground focus:ring-primary-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/60 dark:bg-slate-700/60 border-border focus:border-primary-foreground focus:ring-primary-foreground"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center text-sm text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/40 p-3 rounded-md border border-red-200 dark:border-red-800/50"
              >
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg h-11 text-base btn-effect"
            >
              <LogIn className="mr-2 h-5 w-5" /> Ingresar
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-xs bg-secondary/50 dark:bg-slate-900/30 p-3 flex justify-center text-muted-foreground dark:text-slate-500">
  <p className="text-center leading-tight">


    Desarrollado por <span className="font-semibold text-blue-700 dark:text-blue-300">Cesar Capacho</span><br />
    Est. Tg. Analisis y Desarrollo de Software — SENA, 2025
  </p>

        </CardFooter>
      </Card>
    </motion.div>
  </div>
);}

export default LoginPage;
