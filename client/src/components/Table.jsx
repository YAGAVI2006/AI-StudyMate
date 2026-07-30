import React from 'react';

const Table = ({ headers = [], children, emptyMessage = 'No data available.' }) => {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200/80 shadow-xs">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
            {headers.map((h, i) => (
              <th key={i} className="py-3 px-4">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm text-slate-800 font-medium bg-white">
          {React.Children.count(children) > 0 ? (
            children
          ) : (
            <tr>
              <td colSpan={headers.length} className="text-center py-8 text-slate-400 text-sm italic">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
