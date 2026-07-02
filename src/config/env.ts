export const ENV = {
  GEMINI_API_KEY: (import.meta.env.VITE_GEMINI_API_KEY as string) || '',
  IS_DEV: import.meta.env.DEV,
  MODEL: 'gemini-2.5-flash',
  CACHE_EXPIRY_MS: 24 * 60 * 60 * 1000, // 24 hours
} as const;

export const hasGeminiKey = (): boolean => {
  return typeof ENV.GEMINI_API_KEY === 'string' && ENV.GEMINI_API_KEY.trim().length > 0;
};
