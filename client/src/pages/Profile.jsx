import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { User, Mail, GraduationCap, Calendar, Book, Target, Lock, CheckCircle2, AlertCircle, Save, Edit2 } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      course: user?.course || '',
      year: user?.year || '1st Year',
      subjects: Array.isArray(user?.subjects) ? user.subjects.join(', ') : user?.subjects || '',
      studyGoals: user?.studyGoals || '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setServerError('');
    setSuccessMsg('');

    // If password is blank, remove it so it doesn't attempt password change
    const payload = { ...data };
    if (!payload.password) {
      delete payload.password;
    }

    const result = await updateProfile(payload);
    if (result.success) {
      setSuccessMsg('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    } else {
      setServerError(result.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#2563EB] text-white font-bold text-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 uppercase">
            {user?.name ? user.name.charAt(0) : 'S'}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{user?.name || 'Student Name'}</h1>
            <p className="text-slate-500 text-sm">{user?.email}</p>
          </div>
        </div>

        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? 'outline' : 'primary'}
          icon={isEditing ? null : Edit2}
        >
          {isEditing ? 'Cancel Editing' : 'Edit Profile'}
        </Button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {serverError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Profile Info / Form */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm">
        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100">
              Edit Academic Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <Input
                id="name"
                label="Full Name"
                icon={User}
                required
                error={errors.name}
                register={(name) => register(name, { required: 'Name is required' })}
              />

              {/* Email (Disabled / Readonly display) */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">Email Address (Read-only)</label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-slate-500 cursor-not-allowed text-sm"
                  />
                </div>
              </div>

              {/* Course */}
              <Input
                id="course"
                label="Course / Major"
                icon={GraduationCap}
                required
                error={errors.course}
                register={(name) => register(name, { required: 'Course is required' })}
              />

              {/* Year */}
              <div className="space-y-1.5">
                <label htmlFor="year" className="block text-sm font-semibold text-slate-700">
                  Academic Year
                </label>
                <div className="relative">
                  <Calendar className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
                  <select
                    id="year"
                    {...register('year')}
                    className="w-full bg-white border border-slate-300 rounded-xl py-2.5 pl-11 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB] text-sm"
                  >
                    <option value="1st Year">1st Year (Freshman)</option>
                    <option value="2nd Year">2nd Year (Sophomore)</option>
                    <option value="3rd Year">3rd Year (Junior)</option>
                    <option value="4th Year">4th Year (Senior)</option>
                    <option value="Postgraduate">Postgraduate / Masters</option>
                    <option value="PhD">PhD / Doctorate</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Subjects */}
            <Input
              id="subjects"
              label="Enrolled Subjects (Separated by commas)"
              icon={Book}
              placeholder="e.g. Mathematics, Operating Systems, Chemistry"
              error={errors.subjects}
              register={(name) => register(name)}
            />

            {/* Study Goals */}
            <div className="space-y-1.5">
              <label htmlFor="studyGoals" className="block text-sm font-semibold text-slate-700">
                Study Goals
              </label>
              <textarea
                id="studyGoals"
                rows={3}
                {...register('studyGoals')}
                placeholder="Describe your academic goals..."
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB]"
              />
            </div>

            {/* Optional New Password */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Change Password (Optional)</h3>
              <Input
                id="password"
                type="password"
                label="New Password"
                placeholder="Leave blank to keep current password"
                icon={Lock}
                error={errors.password}
                register={(name) =>
                  register(name, {
                    minLength: {
                      value: 8,
                      message: 'New password must be at least 8 characters long',
                    },
                  })
                }
              />
            </div>

            <div className="flex gap-4 pt-2">
              <Button type="submit" isLoading={isSubmitting} icon={Save}>
                Save Changes
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-8">
            <h2 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100">
              Student Information Overview
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase">Full Name</span>
                <p className="font-bold text-slate-900">{user?.name || 'N/A'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase">Email Address</span>
                <p className="font-bold text-slate-900">{user?.email || 'N/A'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase">Course / Major</span>
                <p className="font-bold text-slate-900">{user?.course || 'N/A'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase">Academic Year</span>
                <p className="font-bold text-slate-900">{user?.year || '1st Year'}</p>
              </div>
            </div>

            {/* Subjects List */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Enrolled Subjects</span>
              {user?.subjects && user.subjects.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.subjects.map((sub, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#2563EB] border border-blue-100 text-xs font-semibold"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-sm italic">No subjects added yet.</p>
              )}
            </div>

            {/* Study Goals */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Study Goals</span>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-slate-700 text-sm leading-relaxed">
                {user?.studyGoals || 'No study goals configured.'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
