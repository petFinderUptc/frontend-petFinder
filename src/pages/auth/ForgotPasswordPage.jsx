import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { forgotPassword } from '../../services/authService';
import { PUBLIC_ROUTES } from '../../constants/routes';
import { validateEmail } from '../../utils/validation';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setError(emailValidation.error);
      return;
    }

    try {
      setLoading(true);
      const response = await forgotPassword(email);
      setSuccess(response?.message || 'Si el correo existe, enviamos instrucciones para restablecer la contraseña.');
    } catch (err) {
      setError(err?.message || 'No fue posible procesar la solicitud. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center py-12 px-4 overflow-hidden relative"
      style={{ background: '#faf9f5' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      {/* Blob decorativo */}
      <motion.div
        className="pointer-events-none absolute rounded-full"
        style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(0,76,34,0.07) 0%, transparent 70%)', top: '-10%', right: '-10%' }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="w-full max-w-md relative z-10">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <img src="/LOGOPNG.png" alt="PetFinder" className="h-14 mx-auto mb-4" />
          <h1 className="text-3xl font-bold" style={{ color: '#1b1c1a', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Recuperar contraseña</h1>
          <p className="mt-2" style={{ color: '#555f70' }}>Te enviaremos un enlace para recuperar tu acceso</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle>¿Olvidaste tu contraseña?</CardTitle>
            <CardDescription>
              Ingresa tu correo para recibir instrucciones de restablecimiento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Alert className="mb-4 border-green-300 text-green-700">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                  Correo Electrónico
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.38 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  type="submit"
                  className="w-full text-white" style={{ background: 'linear-gradient(135deg, #004c22 0%, #166534 100%)' }}
                  disabled={loading}
                >
                  {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
                </Button>
              </motion.div>
            </form>

            <div className="mt-6 text-center">
              <Link
                to={PUBLIC_ROUTES.LOGIN}
                className="text-sm font-semibold hover:underline" style={{ color: '#004c22' }}
              >
                Volver a iniciar sesión
              </Link>
            </div>
          </CardContent>
        </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
