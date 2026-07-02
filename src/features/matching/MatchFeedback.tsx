import { useState } from 'react';
import { useMatchStore } from '../../stores/matchStore';
import { ThumbsUp, ThumbsDown, Minus, Check } from 'lucide-react';

type FeedbackRating = 'Excellent' | 'Good' | 'Poor';

interface MatchFeedbackProps {
  clientId: string;
  matchId: string;
  matchName: string;
  compact?: boolean;
}

const RATING_CONFIG: Record<FeedbackRating, { icon: typeof ThumbsUp; label: string; color: string; activeColor: string }> = {
  Excellent: {
    icon: ThumbsUp,
    label: 'Excellent',
    color: 'hover:bg-success/5 hover:text-success hover:border-success/20',
    activeColor: 'bg-success/10 text-success border-success/30 font-bold'
  },
  Good: {
    icon: Minus,
    label: 'Good',
    color: 'hover:bg-primary/5 hover:text-primary hover:border-primary/20',
    activeColor: 'bg-primary/10 text-primary border-primary/30 font-bold'
  },
  Poor: {
    icon: ThumbsDown,
    label: 'Poor',
    color: 'hover:bg-error/5 hover:text-error hover:border-error/20',
    activeColor: 'bg-error/10 text-error border-error/30 font-bold'
  }
};

export const MatchFeedback: React.FC<MatchFeedbackProps> = ({
  clientId,
  matchId,
  matchName,
  compact = false
}) => {
  const { feedbackRatings, setFeedbackRating, addActivityLog } = useMatchStore();
  const feedbackKey = `${clientId}_${matchId}`;
  const currentRating = feedbackRatings[feedbackKey] as FeedbackRating | undefined;
  const [justSaved, setJustSaved] = useState(false);

  const handleRate = (rating: FeedbackRating) => {
    setFeedbackRating(clientId, matchId, rating);
    addActivityLog(
      clientId,
      matchName,
      'note_added',
      `Match feedback rated "${rating}" for ${matchName}.`
    );
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1500);
  };

  if (compact) {
    return (
      <div className="flex border border-border rounded overflow-hidden text-[9px] font-medium bg-background">
        {(Object.keys(RATING_CONFIG) as FeedbackRating[]).map((r) => (
          <button
            key={r}
            onClick={(e) => {
              e.stopPropagation();
              handleRate(r);
            }}
            className={`px-2 py-1 transition-colors cursor-pointer border-r border-border last:border-0 ${
              currentRating === r
                ? 'bg-primary text-white font-semibold'
                : 'hover:bg-zinc-100 text-text-secondary'
            }`}
          >
            {r}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
          Rate This Match
        </span>
        {justSaved && (
          <span className="text-[9px] text-success font-semibold flex items-center gap-0.5 animate-pulse">
            <Check className="w-3 h-3" />
            Saved
          </span>
        )}
      </div>

      <div className="flex gap-2">
        {(Object.keys(RATING_CONFIG) as FeedbackRating[]).map((rating) => {
          const config = RATING_CONFIG[rating];
          const Icon = config.icon;
          const isActive = currentRating === rating;

          return (
            <button
              key={rating}
              onClick={(e) => {
                e.stopPropagation();
                handleRate(rating);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-interactive border text-[10px] font-medium transition-all cursor-pointer ${
                isActive ? config.activeColor : `bg-background border-border text-text-secondary ${config.color}`
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{config.label}</span>
            </button>
          );
        })}
      </div>

      {currentRating && (
        <p className="text-[9px] text-text-secondary mt-0.5">
          {currentRating === 'Excellent' && 'Great match! This feedback improves future recommendations.'}
          {currentRating === 'Good' && 'Decent fit. We\'ll look for closer alignment next time.'}
          {currentRating === 'Poor' && 'Noted. The engine will deprioritize similar profiles.'}
        </p>
      )}
    </div>
  );
};
