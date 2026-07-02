import React, { useMemo } from 'react';
import { useMatchStore } from '../../stores/matchStore';
import { MATCHING_RULES } from '../../config/matchingRules';
import { Brain, TrendingUp, TrendingDown, Minus, Lightbulb } from 'lucide-react';

export const FeedbackInsights: React.FC = () => {
  const { feedbackRatings } = useMatchStore();

  const insights = useMemo(() => {
    const totalRatings = Object.keys(feedbackRatings).length;
    const excellentCount = Object.values(feedbackRatings).filter(r => r === 'Excellent').length;
    const goodCount = Object.values(feedbackRatings).filter(r => r === 'Good').length;
    const poorCount = Object.values(feedbackRatings).filter(r => r === 'Poor').length;

    const positiveRate = totalRatings > 0 ? Math.round(((excellentCount + goodCount) / totalRatings) * 100) : 0;
    const poorRate = totalRatings > 0 ? Math.round((poorCount / totalRatings) * 100) : 0;

    // Naive weight retraining simulation
    // If positive rate is high, current weights work. If low, suggest adjustments.
    const currentWeights = { ...MATCHING_RULES };
    const suggestedWeights: Record<string, number> = { ...MATCHING_RULES };

    if (totalRatings >= 3) {
      // Simple heuristic: if poor rate > 30%, nudge lifestyle and language up (common mismatch reasons)
      if (poorRate > 30) {
        suggestedWeights.lifestyle = Math.min(25, currentWeights.lifestyle + 5);
        suggestedWeights.language = Math.min(20, currentWeights.language + 3);
        suggestedWeights.children = Math.max(20, currentWeights.children - 3);
        suggestedWeights.career = Math.max(15, currentWeights.career - 5);
      }
      // If excellent rate > 70%, slightly boost top-performing categories
      if (positiveRate > 70) {
        suggestedWeights.children = Math.min(35, currentWeights.children + 2);
        suggestedWeights.city = Math.min(15, currentWeights.city + 1);
      }
    }

    // Calculate deltas
    const deltas: Record<string, number> = {};
    for (const key of Object.keys(currentWeights) as Array<keyof typeof currentWeights>) {
      deltas[key] = (suggestedWeights[key] ?? currentWeights[key]) - currentWeights[key];
    }

    return {
      totalRatings,
      excellentCount,
      goodCount,
      poorCount,
      positiveRate,
      poorRate,
      currentWeights,
      suggestedWeights,
      deltas,
      hasEnoughData: totalRatings >= 3
    };
  }, [feedbackRatings]);

  const getWeightBarWidth = (value: number, max: number) => {
    return Math.round((value / max) * 100);
  };

  const maxWeight = Math.max(...Object.values(MATCHING_RULES));

  return (
    <div className="bg-white border border-border rounded-card p-5 shadow-sm w-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary" />
          <h3 className="font-heading font-bold text-sm text-text-primary">
            Algorithm Learning Loop
          </h3>
        </div>
        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded border ${
          insights.hasEnoughData 
            ? 'bg-success/5 text-success border-success/15' 
            : 'bg-warning/5 text-warning border-warning/15'
        }`}>
          {insights.hasEnoughData ? 'Learning Active' : `Need ${3 - insights.totalRatings} more ratings`}
        </span>
      </div>

      {/* Feedback Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-success/5 border border-success/15 rounded-interactive p-3 text-center">
          <div className="font-mono font-bold text-lg text-success leading-none">{insights.excellentCount}</div>
          <div className="text-[9px] text-text-secondary mt-1">Excellent</div>
          <div className="flex items-center justify-center gap-0.5 mt-1">
            <TrendingUp className="w-3 h-3 text-success" />
            <span className="text-[8px] text-success font-semibold">+weight</span>
          </div>
        </div>
        <div className="bg-primary/5 border border-primary/15 rounded-interactive p-3 text-center">
          <div className="font-mono font-bold text-lg text-primary leading-none">{insights.goodCount}</div>
          <div className="text-[9px] text-text-secondary mt-1">Good</div>
          <div className="flex items-center justify-center gap-0.5 mt-1">
            <Minus className="w-3 h-3 text-primary" />
            <span className="text-[8px] text-primary font-semibold">neutral</span>
          </div>
        </div>
        <div className="bg-error/5 border border-error/15 rounded-interactive p-3 text-center">
          <div className="font-mono font-bold text-lg text-error leading-none">{insights.poorCount}</div>
          <div className="text-[9px] text-text-secondary mt-1">Poor</div>
          <div className="flex items-center justify-center gap-0.5 mt-1">
            <TrendingDown className="w-3 h-3 text-error" />
            <span className="text-[8px] text-error font-semibold">-weight</span>
          </div>
        </div>
      </div>

      {/* Weight Comparison: Current vs Suggested */}
      <div className="flex flex-col gap-2.5">
        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
          Weight Tuning (Current → Suggested)
        </span>
        
        {(Object.keys(MATCHING_RULES) as Array<keyof typeof MATCHING_RULES>).map((key) => {
          const current = insights.currentWeights[key];
          const suggested = insights.suggestedWeights[key] ?? current;
          const delta = insights.deltas[key] ?? 0;
          
          return (
            <div key={key} className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[10px]">
                <span className="capitalize font-medium text-text-primary">{key}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-text-secondary">{current}</span>
                  <Arrow className="w-3 h-3 text-text-secondary" />
                  <span className={`font-mono font-bold ${delta > 0 ? 'text-success' : delta < 0 ? 'text-error' : 'text-text-primary'}`}>
                    {suggested}
                  </span>
                  {delta !== 0 && (
                    <span className={`text-[8px] font-bold px-1 py-0.5 rounded ${
                      delta > 0 ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                    }`}>
                      {delta > 0 ? `+${delta}` : delta}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-1 items-center">
                {/* Current bar */}
                <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden relative">
                  <div
                    className="absolute h-full bg-primary/40 rounded-full"
                    style={{ width: `${getWeightBarWidth(current, maxWeight)}%` }}
                  />
                  {delta !== 0 && (
                    <div
                      className={`absolute h-full rounded-full ${delta > 0 ? 'bg-success/60' : 'bg-error/60'}`}
                      style={{
                        left: delta > 0 ? `${getWeightBarWidth(current, maxWeight)}%` : `${getWeightBarWidth(suggested, maxWeight)}%`,
                        width: `${Math.abs(getWeightBarWidth(delta, maxWeight))}%`
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanation */}
      <div className="bg-background-secondary/40 border border-border rounded-interactive p-3 flex items-start gap-2 text-[10px] text-text-secondary">
        <Lightbulb className="w-3.5 h-3.5 text-accent flex-shrink-0 mt-0.5" />
        <span>
          {insights.hasEnoughData ? (
            <>
              <strong className="text-text-primary">How it works:</strong> When matchmakers rate matches as "Poor," the system nudges weights toward lifestyle and language compatibility (common mismatch reasons). High "Excellent" rates reinforce children and city alignment weights. This is a naive Bayesian-inspired approach — production would use gradient-based optimization on feedback signals.
            </>
          ) : (
            <>
              <strong className="text-text-primary">How it works:</strong> Rate at least 3 matches (Excellent/Good/Poor) to activate the learning loop. The system analyzes feedback patterns and suggests weight adjustments to improve future matching quality. This demonstrates how a production system would continuously improve.
            </>
          )}
        </span>
      </div>
    </div>
  );
};

// Small inline Arrow component
const Arrow: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
  </svg>
);
