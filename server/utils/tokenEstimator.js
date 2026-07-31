export const estimateTokenCount = (text = '') => {
  if (!text) return 0;
  // Standard approximation: ~4 characters per token in English
  return Math.ceil(text.length / 4);
};

export const sanitizePrompt = (prompt = '') => {
  return prompt.trim().replace(/\s+/g, ' ');
};
