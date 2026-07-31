export const calculateStreak = (sessions = []) => {
  if (!sessions || sessions.length === 0) return 1;

  const dates = sessions
    .map((s) => new Date(s.date).toISOString().split('T')[0])
    .sort()
    .reverse();

  const uniqueDates = [...new Set(dates)];
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (uniqueDates.includes(today) || uniqueDates.includes(yesterday)) {
    streak = 1;
    let curr = new Date(uniqueDates[0]);
    for (let i = 1; i < uniqueDates.length; i++) {
      const prev = new Date(uniqueDates[i]);
      const diffTime = Math.abs(curr - prev);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak++;
        curr = prev;
      } else {
        break;
      }
    }
  }

  return Math.max(1, streak);
};
