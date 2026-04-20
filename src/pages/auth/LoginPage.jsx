import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { PUBLIC_ROUTES, PROTECTED_ROUTES } from '../../constants/routes';
import { validateEmail, validatePassword } from '../../utils/validation';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  const from = location.state?.from?.pathname || PROTECTED_ROUTES.DASHBOARD;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setLoginError('');
  };

  const validateForm = () => {
    const newErrors = {};

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) newErrors.email = emailValidation.error;

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) newErrors.password = passwordValidation.error;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await login({ email: formData.email, password: formData.password }, rememberMe);
      navigate(from, { replace: true });
    } catch (error) {
      setLoginError(
        error.message ||
          error.response?.data?.message ||
          'Error al iniciar sesión. Por favor verifica tus credenciales.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldVariants = {
    hidden: { opacity: 0, x: 24 },
    show:   { opacity: 1, x: 0 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden" style={{ background: '#faf9f5' }}>
      {/* Blobs ambientales */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(0,76,34,0.1) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-24 h-[380px] w-[380px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(22,101,52,0.08) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo + heading */}
        <div className="text-center mb-8">
          <motion.img
            src="/LOGOPNG.png" alt="PetFinder"
            className="h-14 mx-auto mb-4"
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 20 }}
          />
          <motion.h1
            className="text-3xl font-bold"
            style={{ color: '#1b1c1a', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22,1,0.36,1], delay: 0.15 }}
          >
            Bienvenido
          </motion.h1>
          <motion.p
            style={{ color: '#555f70' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            Inicia sesión en tu cuenta
          </motion.p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 240, damping: 26, delay: 0.2 }}
        >
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle>Iniciar Sesión</CardTitle>
              <CardDescription>Ingresa tus credenciales para acceder a tu cuenta</CardDescription>
            </CardHeader>

            <CardContent>
              {loginError && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-4">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{loginError}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <motion.form
                onSubmit={handleSubmit}
                className="space-y-4"
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.09, delayChildren: 0.35 } } }}
              >
                <motion.div variants={fieldVariants} transition={{ duration: 0.4, ease: [0.22,1,0.36,1] }}>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">Correo Electrónico</label>
                  <Input id="email" name="email" type="email" placeholder="tu@email.com"
                    value={formData.email} onChange={handleChange}
                    className={errors.email ? 'border-red-500' : ''} disabled={isSubmitting} />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </motion.div>

                <motion.div variants={fieldVariants} transition={{ duration: 0.4, ease: [0.22,1,0.36,1] }}>
                  <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">Contraseña</label>
                  <div className="relative">
                    <Input id="password" name="password" type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••" value={formData.password} onChange={handleChange}
                      className={errors.password ? 'border-red-500 pr-10' : 'pr-10'} disabled={isSubmitting} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" disabled={isSubmitting}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </motion.div>

                <motion.div variants={fieldVariants} transition={{ duration: 0.4, ease: [0.22,1,0.36,1] }}
                  className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="rounded border-gray-300" />
                    <span className="text-muted-foreground">Recordarme <span className="text-xs opacity-60">(30 días)</span></span>
                  </label>
                  <Link to={PUBLIC_ROUTES.FORGOT_PASSWORD} className="font-semibold hover:underline" style={{ color: '#004c22' }}>
                    ¿Olvidaste tu contraseña?
                  </Link>
                </motion.div>

                <motion.div variants={fieldVariants} transition={{ duration: 0.4, ease: [0.22,1,0.36,1] }}>
                  <motion.button
                    type="submit"
                    className="w-full py-2.5 rounded-xl text-sm font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #004c22 0%, #166534 100%)' }}
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02, boxShadow: '0 6px 24px rgba(0,76,34,0.35)' }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </motion.button>
                </motion.div>
              </motion.form>

              <motion.div
                className="mt-6 text-center"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              >
                <p className="text-sm text-muted-foreground">
                  ¿No tienes una cuenta?{' '}
                  <Link to={PUBLIC_ROUTES.REGISTER} className="font-semibold hover:underline" style={{ color: '#004c22' }}>
                    Regístrate aquí
                  </Link>
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
        >
          <Link to={PUBLIC_ROUTES.HOME} className="text-sm text-muted-foreground hover:text-foreground hover:underline">
            ← Volver al inicio
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
