import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { resetPassword } from '../../services/authService';
import { PUBLIC_ROUTES } from '../../constants/routes';
import { validatePassword, validatePasswordMatch } from '../../utils/validation';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Token de recuperación inválido o ausente.');
      return;
    }

    const passwordValidation = validatePassword(formData.newPassword);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.error);
      return;
    }

    const matchValidation = validatePasswordMatch(formData.newPassword, formData.confirmPassword);
    if (!matchValidation.isValid) {
      setError(matchValidation.error);
      return;
    }

    try {
      setLoading(true);
      const response = await resetPassword({ token, newPassword: formData.newPassword });
      setSuccess(response?.message || 'Contraseña actualizada correctamente.');
      setTimeout(() => {
        navigate(PUBLIC_ROUTES.LOGIN, { replace: true });
      }, 1500);
    } catch (err) {
      setError(err?.message || 'No fue posible actualizar la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  const fieldVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.35 } },
  };
  const fieldItem = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
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
        style={{ width: 350, height: 350, background: 'radial-gradient(circle, rgba(0,76,34,0.08) 0%, transparent 70%)', bottom: '-8%', left: '-8%' }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="w-full max-w-md relative z-10">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <img src="/LOGOPNG.png" alt="PetFinder" className="h-14 mx-auto mb-4" />
          <h1 className="text-3xl font-bold" style={{ color: '#1b1c1a', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Nueva contraseña</h1>
          <p className="mt-2" style={{ color: '#555f70' }}>Configura una contraseña segura para tu cuenta</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 45, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle>Restablecer contraseña</CardTitle>
            <CardDescription>
              Ingresa tu nueva contraseña y confírmala.
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
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              >
                <Alert className="mb-4 border-green-300 text-green-700">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4"
              variants={fieldVariants}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={fieldItem}>
                <label htmlFor="newPassword" className="block text-sm font-medium text-foreground mb-1">
                  Nueva contraseña
                </label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.newPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
              </motion.div>

              <motion.div variants={fieldItem}>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1">
                  Confirmar contraseña
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
              </motion.div>

              <motion.div variants={fieldItem} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Button
                  type="submit"
                  className="w-full text-white" style={{ background: 'linear-gradient(135deg, #004c22 0%, #166534 100%)' }}
                  disabled={loading}
                >
                  {loading ? 'Actualizando...' : 'Actualizar contraseña'}
                </Button>
              </motion.div>
            </motion.form>

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
