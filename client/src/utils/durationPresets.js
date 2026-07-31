export const DURATION_PRESETS = [
  { label: '15 Mins', value: 15 },
  { label: '30 Mins', value: 30 },
  { label: '45 Mins', value: 45 },
  { label: '60 Mins', value: 60 },
  { label: '90 Mins', value: 90 },
];

export const formatMinutesToHours = (minutes = 0) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};
