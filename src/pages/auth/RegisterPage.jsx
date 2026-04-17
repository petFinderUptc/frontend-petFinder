import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PUBLIC_ROUTES, PROTECTED_ROUTES } from '../../constants/routes';
import {
  validateEmail,
  validatePassword,
  validateUsername,
  validatePasswordMatch,
  validatePersonName,
  validateColombianPhone,
} from '../../utils/validation';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
      <AlertCircle className="h-3 w-3 flex-shrink-0" />
      {message}
    </p>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [registerError, setRegisterError] = useState('');

  // Per-field validators (returns '' when valid, error string when invalid)
  const validators = {
    firstName: (v) => {
      const r = validatePersonName(v, 'El nombre');
      return r.isValid ? '' : r.error;
    },
    lastName: (v) => {
      const r = validatePersonName(v, 'El apellido');
      return r.isValid ? '' : r.error;
    },
    email: (v) => {
      const r = validateEmail(v);
      return r.isValid ? '' : r.error;
    },
    username: (v) => {
      const r = validateUsername(v);
      return r.isValid ? '' : r.error;
    },
    phoneNumber: (v) => {
      if (!v || !v.trim()) return ''; // optional field
      const r = validateColombianPhone(v);
      return r.isValid ? '' : r.error;
    },
    password: (v) => {
      const r = validatePassword(v);
      return r.isValid ? '' : r.error;
    },
    confirmPassword: (v) => {
      const r = validatePasswordMatch(formData.password, v);
      return r.isValid ? '' : r.error;
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setRegisterError('');
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (!validators[name]) return;
    const error = validators[name](value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(validators).forEach((name) => {
      const error = validators[name](formData[name]);
      if (error) newErrors[name] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegisterError('');

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const userData = {
        email: formData.email,
        username: formData.username,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      };

      await register(userData);
      navigate(PROTECTED_ROUTES.DASHBOARD, { replace: true });
    } catch (error) {
      setRegisterError(
        error.message || error.response?.data?.message ||
        'Error al registrar la cuenta. Inténtalo nuevamente.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (name) => (errors[name] ? 'border-red-500' : '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-950 dark:to-black flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="/LOGOPNG.png"
            alt="PetFinder"
            className="h-16 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Crear Cuenta</h1>
          <p className="text-gray-700 dark:text-slate-300 mt-2">Únete a nuestra comunidad</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle>Registro</CardTitle>
            <CardDescription>Completa tus datos para crear una cuenta</CardDescription>
          </CardHeader>

          <CardContent>
            {registerError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{registerError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-1">
                  Nombre *
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Tu nombre"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={50}
                  className={inputClass('firstName')}
                  disabled={isSubmitting}
                />
                <FieldError message={errors.firstName} />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-1">
                  Apellido *
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Tu apellido"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={50}
                  className={inputClass('lastName')}
                  disabled={isSubmitting}
                />
                <FieldError message={errors.lastName} />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                  Correo Electrónico *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={100}
                  className={inputClass('email')}
                  disabled={isSubmitting}
                />
                <FieldError message={errors.email} />
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-foreground mb-1">
                  Nombre de Usuario *
                </label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="usuario123"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={20}
                  className={inputClass('username')}
                  disabled={isSubmitting}
                />
                <FieldError message={errors.username} />
                {!errors.username && (
                  <p className="mt-1 text-xs text-muted-foreground">3-20 caracteres: letras, números o guiones bajos</p>
                )}
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-foreground mb-1">
                  Teléfono <span className="text-muted-foreground font-normal">(Opcional)</span>
                </label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="310 123 4567"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={20}
                  className={inputClass('phoneNumber')}
                  disabled={isSubmitting}
                />
                <FieldError message={errors.phoneNumber} />
                {!errors.phoneNumber && (
                  <p className="mt-1 text-xs text-muted-foreground">Celular colombiano, ej: 310 123 4567</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                  Contraseña *
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength={72}
                    className={`${inputClass('password')} pr-10`}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={isSubmitting}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <FieldError message={errors.password} />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1">
                  Confirmar Contraseña *
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength={72}
                    className={`${inputClass('confirmPassword')} pr-10`}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={isSubmitting}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <FieldError message={errors.confirmPassword} />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Creando cuenta...
                  </span>
                ) : (
                  'Crear Cuenta'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                ¿Ya tienes una cuenta?{' '}
                <Link
                  to={PUBLIC_ROUTES.LOGIN}
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link
            to={PUBLIC_ROUTES.HOME}
            className="text-sm text-muted-foreground hover:text-foreground hover:underline"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
