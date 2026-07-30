import React from 'react';
import { Loader2, BookOpen } from 'lucide-react';

const Loader = ({ fullScreen = false, message = 'Loading AI StudyMate...' }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl border border-slate-100 flex flex-col items-center max-w-xs text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#2563EB] flex items-center justify-center text-white shadow-lg shadow-blue-500/30 animate-pulse-slow">
            <BookOpen className="w-6 h-6 animate-bounce" />
          </div>
          <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
            <Loader2 className="w-4 h-4 text-[#2563EB] animate-spin" />
            <span>{message}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />
      <span className="text-sm font-medium text-slate-500">{message}</span>
    </div>
  );
};

export default Loader;
