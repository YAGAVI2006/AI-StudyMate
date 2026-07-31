export const updateTopicCount = (subject, increment = true) => {
  if (!subject) return subject;

  const current = subject.completedTopics || 0;
  const max = subject.totalTopics || 10;
  let updated = current;

  if (increment && current < max) {
    updated = current + 1;
  } else if (!increment && current > 0) {
    updated = current - 1;
  }

  return {
    ...subject,
    completedTopics: updated,
  };
};
