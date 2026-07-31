import React from 'react';

export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-slate-200 rounded-xl" />
            <div className="w-12 h-6 bg-slate-200 rounded-full" />
          </div>
          <div className="h-6 bg-slate-200 rounded-lg w-3/4" />
          <div className="h-4 bg-slate-200 rounded-lg w-1/2" />
          <div className="h-3 bg-slate-200 rounded-full w-full" />
        </div>
      ))}
    </div>
  );
};
