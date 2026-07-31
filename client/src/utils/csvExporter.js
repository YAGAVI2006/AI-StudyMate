export const exportSessionsToCSV = (sessions = []) => {
  if (!sessions || sessions.length === 0) return;

  const headers = ['Subject', 'Topic', 'Duration (mins)', 'Date', 'Notes'];
  const rows = sessions.map((s) => [
    `"${s.subject || ''}"`,
    `"${s.topic || ''}"`,
    s.duration || 0,
    `"${new Date(s.date).toLocaleDateString()}"`,
    `"${(s.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `AI_StudyMate_Sessions_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
