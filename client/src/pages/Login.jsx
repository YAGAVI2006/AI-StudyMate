import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setServerError('');
    const result = await login(data.email, data.password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setServerError(result.message);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotMessage('If an account exists with this email, password reset instructions have been sent.');
    setTimeout(() => {
      setForgotMessage('');
      setForgotModalOpen(false);
    }, 3000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl relative">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-blue-50 text-[#2563EB] mb-2">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back!
          </h2>
          <p className="text-slate-500 text-sm">
            Sign in to access your AI StudyMate dashboard
          </p>
        </div>

        {serverError && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            id="email"
            type="email"
            label="Email Address"
            placeholder="student@university.edu"
            icon={Mail}
            required
            error={errors.email}
            register={(name) =>
              register(name, {
                required: 'Email is required',
                pattern: {
                  value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                  message: 'Please enter a valid email address',
                },
              })
            }
          />

          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            icon={Lock}
            required
            error={errors.password}
            register={(name) =>
              register(name, {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters long',
                },
              })
            }
          />

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-900">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-[#2563EB] rounded border-slate-300 focus:ring-[#2563EB]"
              />
              <span>Remember Me</span>
            </label>

            <button
              type="button"
              onClick={() => setForgotModalOpen(true)}
              className="font-semibold text-[#2563EB] hover:text-blue-700 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <Button
            type="submit"
            isLoading={isSubmitting}
            className="w-full text-base py-3 shadow-lg shadow-blue-500/20"
          >
            Sign In to Account
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          Don't have a student account yet?{' '}
          <Link to="/register" className="font-semibold text-[#2563EB] hover:underline">
            Register Here
          </Link>
        </div>

        {/* Forgot Password Modal */}
        {forgotModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#2563EB]" /> Reset Password
                </h3>
                <button
                  onClick={() => setForgotModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              </div>

              {forgotMessage ? (
                <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{forgotMessage}</span>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <p className="text-slate-600 text-xs">
                    Enter your registered email address to receive password reset instructions.
                  </p>
                  <input
                    type="email"
                    required
                    placeholder="student@university.edu"
                    className="w-full text-sm p-2.5 border rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB] outline-none"
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setForgotModalOpen(false)}
                      className="w-1/2"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" size="sm" className="w-1/2">
                      Send Link
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
