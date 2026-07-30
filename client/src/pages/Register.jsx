import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, GraduationCap, Calendar, Book, Target, AlertCircle } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';

const Register = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      course: '',
      year: '1st Year',
      subjects: '',
      studyGoals: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    setServerError('');
    const { confirmPassword, ...registerData } = data;
    
    const result = await registerAuth(registerData);
    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setServerError(result.message);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-blue-50 text-[#2563EB] mb-2">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create Student Profile
          </h2>
          <p className="text-slate-500 text-sm">
            Join AI StudyMate to organize your learning journey
          </p>
        </div>

        {serverError && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <Input
              id="name"
              label="Full Name"
              placeholder="Alex Johnson"
              icon={User}
              required
              error={errors.name}
              register={(name) =>
                register(name, {
                  required: 'Full name is required',
                })
              }
            />

            {/* Email */}
            <Input
              id="email"
              type="email"
              label="Email Address"
              placeholder="alex@university.edu"
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

            {/* Password */}
            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="At least 8 characters"
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

            {/* Confirm Password */}
            <Input
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="Re-enter password"
              icon={Lock}
              required
              error={errors.confirmPassword}
              register={(name) =>
                register(name, {
                  required: 'Please confirm your password',
                  validate: (val) => val === password || 'Passwords do not match',
                })
              }
            />

            {/* Course */}
            <Input
              id="course"
              label="Course / Major"
              placeholder="e.g. Computer Science, Medicine, Business"
              icon={GraduationCap}
              required
              error={errors.course}
              register={(name) =>
                register(name, {
                  required: 'Course is required',
                })
              }
            />

            {/* Year */}
            <div className="space-y-1.5">
              <label htmlFor="year" className="block text-sm font-semibold text-slate-700">
                Academic Year <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <select
                  id="year"
                  {...register('year', { required: 'Academic year is required' })}
                  className="w-full text-slate-900 bg-white border border-slate-300 hover:border-slate-400 rounded-xl py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB]"
                >
                  <option value="1st Year">1st Year (Freshman)</option>
                  <option value="2nd Year">2nd Year (Sophomore)</option>
                  <option value="3rd Year">3rd Year (Junior)</option>
                  <option value="4th Year">4th Year (Senior)</option>
                  <option value="Postgraduate">Postgraduate / Masters</option>
                  <option value="PhD">PhD / Doctorate</option>
                </select>
              </div>
              {errors.year && (
                <p className="text-xs font-medium text-red-500">{errors.year.message}</p>
              )}
            </div>
          </div>

          {/* Subjects */}
          <Input
            id="subjects"
            label="Enrolled Subjects / Modules"
            placeholder="e.g. Data Structures, Calculus, Physics, AI Intro (separated by commas)"
            icon={Book}
            error={errors.subjects}
            register={(name) => register(name)}
          />

          {/* Study Goals */}
          <div className="space-y-1.5">
            <label htmlFor="studyGoals" className="block text-sm font-semibold text-slate-700">
              Personal Study Goals
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute top-3 left-3.5 text-slate-400 pointer-events-none">
                <Target className="w-5 h-5" />
              </div>
              <textarea
                id="studyGoals"
                rows={3}
                placeholder="e.g. Maintain 3.8 GPA, Master Data Structures & Algorithms, Complete final project..."
                {...register('studyGoals')}
                className="w-full text-slate-900 placeholder-slate-400 bg-white border border-slate-300 hover:border-slate-400 rounded-xl py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB]"
              />
            </div>
          </div>

          <Button
            type="submit"
            isLoading={isSubmitting}
            className="w-full text-base py-3 shadow-lg shadow-blue-500/20"
          >
            Create Account & Enter Dashboard
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-[#2563EB] hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
