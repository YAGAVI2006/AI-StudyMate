export const filterGoals = (goals = [], filterStatus = 'All') => {
  if (!goals) return [];
  if (filterStatus === 'Completed') return goals.filter((g) => g.completed);
  if (filterStatus === 'InProgress') return goals.filter((g) => !g.completed);
  return goals;
};
