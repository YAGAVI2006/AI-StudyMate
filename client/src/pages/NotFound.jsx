import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Home as HomeIcon } from 'lucide-react';
import Button from '../components/Button';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center text-center p-4">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#2563EB] mx-auto flex items-center justify-center font-bold">
          <HelpCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-slate-900">404</h1>
          <h2 className="text-xl font-bold text-slate-800">Page Not Found</h2>
          <p className="text-slate-500 text-sm">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        <Link to="/" className="inline-block w-full">
          <Button icon={HomeIcon} className="w-full">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
