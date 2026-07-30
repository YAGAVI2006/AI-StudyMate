import React from 'react';

const ProgressBar = ({
  progress = 0,
  color = '#2563EB',
  height = 'h-2.5',
  showLabel = false,
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div className={`w-full space-y-1 ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span>Completion</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${height}`}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
