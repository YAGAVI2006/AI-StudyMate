export const filterGoalsByPriority = (goals = [], priority = 'All') => {
  if (!goals) return [];
  if (priority === 'All') return goals;
  return goals.filter((g) => g.priority === priority);
};

export const getPriorityBadgeStyle = (priority = 'Medium') => {
  switch (priority) {
    case 'High':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'Medium':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'Low':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};
