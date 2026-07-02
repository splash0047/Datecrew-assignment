import { useState, useEffect, useCallback } from 'react';
import type { Profile } from '../types';
import { geminiService } from '../services/ai/gemini';
import type { AIAnalysisResult, AIEmailResult } from '../services/ai/gemini';
import { aiCache } from '../services/ai/cache';
import { COMPATIBILITY_PROMPT_V1 } from '../prompts/compatibility.v1';
import { EMAIL_PROMPT_V1 } from '../prompts/email.v1';

export const useAI = (client: Profile | null, candidate: Profile | null) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [emails, setEmails] = useState<AIEmailResult | null>(null);
  const [isFallback, setIsFallback] = useState<boolean>(false);

  const fetchAIContent = useCallback(async () => {
    if (!client || !candidate) {
      setAnalysis(null);
      setEmails(null);
      return;
    }

    setLoading(true);
    setError(null);

    const cacheKeyAnalysis = aiCache.generateKey(client.id, candidate.id, 'analysis');
    const cacheKeyEmail = aiCache.generateKey(client.id, candidate.id, 'email');

    // Check cache
    const cachedAnalysis = aiCache.get<AIAnalysisResult>(cacheKeyAnalysis, COMPATIBILITY_PROMPT_V1.version);
    const cachedEmail = aiCache.get<AIEmailResult>(cacheKeyEmail, EMAIL_PROMPT_V1.version);

    if (cachedAnalysis && cachedEmail) {
      setAnalysis(cachedAnalysis);
      setEmails(cachedEmail);
      setIsFallback(false); // cached item assumed successful or fallback cached
      setLoading(false);
      return;
    }

    try {
      // Fetch analysis and emails concurrently
      const [analysisResult, emailResult] = await Promise.all([
        geminiService.generateAnalysis(client, candidate),
        geminiService.generateEmailDrafts(client, candidate)
      ]);

      setAnalysis(analysisResult.data);
      setEmails(emailResult.data);
      setIsFallback(analysisResult.isFallback || emailResult.isFallback);

      // Cache results
      aiCache.set(cacheKeyAnalysis, analysisResult.data, COMPATIBILITY_PROMPT_V1.version);
      aiCache.set(cacheKeyEmail, emailResult.data, EMAIL_PROMPT_V1.version);
    } catch (err: any) {
      console.error('Error generating AI content:', err);
      setError(err?.message || 'Failed to generate match insights.');
      
      // Secondary fallback directly in hook on hard failure
      const localAnalysis = geminiService.generateLocalAnalysisFallback(client, candidate);
      const localEmails = geminiService.generateLocalEmailFallback(client, candidate);
      setAnalysis(localAnalysis);
      setEmails(localEmails);
      setIsFallback(true);
    } finally {
      setLoading(false);
    }
  }, [client, candidate]);

  useEffect(() => {
    fetchAIContent();
  }, [fetchAIContent]);

  return {
    loading,
    error,
    analysis,
    emails,
    isFallback,
    refetch: fetchAIContent
  };
};
