export const checkPasswordStrength = (password) => {
  if (!password) return { score: 0, label: 'Empty', color: 'bg-slate-200' };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  switch (score) {
    case 1:
      return { score: 25, label: 'Weak', color: 'bg-red-500' };
    case 2:
      return { score: 50, label: 'Fair', color: 'bg-amber-500' };
    case 3:
      return { score: 75, label: 'Good', color: 'bg-blue-500' };
    case 4:
      return { score: 100, label: 'Strong', color: 'bg-emerald-500' };
    default:
      return { score: 0, label: 'Very Weak', color: 'bg-slate-300' };
  }
};
