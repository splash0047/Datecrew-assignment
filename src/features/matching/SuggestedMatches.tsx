import React, { useState, useMemo } from 'react';
import type { Profile, MatchExplanation } from '../../types';
import { useProfileStore } from '../../stores/profileStore';
import { useMatchStore } from '../../stores/matchStore';
import { matchingService } from '../../services/matching';
import { HeartHandshake, AlertCircle, Star, Ban, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { MatchFeedback } from './MatchFeedback';

interface SuggestedMatchesProps {
  client: Profile;
  onSelectMatch: (candidate: Profile, explanation: MatchExplanation) => void;
  selectedCandidateId: string | null;
}

export const SuggestedMatches: React.FC<SuggestedMatchesProps> = ({
  client,
  onSelectMatch,
  selectedCandidateId
}) => {
  const { profiles } = useProfileStore();
  const { addDecision, addActivityLog } = useMatchStore();

  const [expandedExclusions, setExpandedExclusions] = useState(false);
  const [sendingMatchId, setSendingMatchId] = useState<string | null>(null);
  const [sentMatches, setSentMatches] = useState<Record<string, boolean>>({});

  // 1. Calculate matches using the matching service
  const matchResults = useMemo(() => {
    return matchingService.findMatches(client, profiles);
  }, [client, profiles]);

  // Separate active suggestions (score > 0) and excluded candidates (score === 0)
  const suggestions = useMemo(() => {
    return matchResults.filter((m) => m.explanation.score > 0);
  }, [matchResults]);

  const exclusions = useMemo(() => {
    return matchResults.filter((m) => m.explanation.score === 0);
  }, [matchResults]);

  // 2. Generate 3 highlight chips for the match card
  const getHighlightChips = (candidate: Profile) => {
    const chips: string[] = [];

    if (client.city === candidate.city) {
      chips.push('🏙 Same City');
    } else if (client.openToRelocate === 'Yes' || candidate.openToRelocate === 'Yes') {
      chips.push('✈ Relocation Aligned');
    }

    if (client.preferredFamilyType === candidate.preferredFamilyType) {
      chips.push('👨‍👩‍👧 Family Values');
    }

    const isClientElite = /IIT|BITS|IIM|SRCC|NIT|COEP|VJTI/.test(client.college);
    const isCandidateElite = /IIT|BITS|IIM|SRCC|NIT|COEP|VJTI/.test(candidate.college);
    if (isClientElite && isCandidateElite) {
      chips.push('💼 Academic Peers');
    } else if (Math.abs(client.income - candidate.income) < 15) {
      chips.push('💰 Balanced Careers');
    } else {
      chips.push('🤝 Career Focused');
    }

    return chips.slice(0, 3);
  };

  const getStarRating = (score: number) => {
    if (score >= 88) return { stars: 5, label: 'Excellent Fit' };
    if (score >= 75) return { stars: 4, label: 'Very Good Fit' };
    if (score >= 65) return { stars: 3, label: 'Good Fit' };
    return { stars: 2, label: 'Fair Fit' };
  };

  const handleSendMatch = (candidate: Profile, score: number) => {
    setSendingMatchId(candidate.id);
    
    // Simulate API delivery
    setTimeout(() => {
      addDecision({
        clientId: client.id,
        clientName: client.fullName,
        matchId: candidate.id,
        matchName: candidate.fullName,
        status: 'Sent',
        timeTaken: 'Instant',
        aiScore: score,
        outcome: 'Pending',
        notes: `Profile recommendation sent electronically to client.`
      });

      addActivityLog(
        client.id,
        client.fullName,
        'match_sent',
        `Match sent: Profile of ${candidate.fullName} shared with client.`
      );

      setSentMatches((prev) => ({ ...prev, [candidate.id]: true }));
      setSendingMatchId(null);
    }, 450);
  };

  // Feedback rated internally by MatchFeedback component

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header section */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Potential Matches</span>
          <h2 className="font-heading font-extrabold text-lg text-text-primary mt-0.5">
            AI Recommended Matches
          </h2>
        </div>
        <span className="text-xs text-text-secondary font-mono bg-white px-2 py-0.5 rounded border border-border">
          {suggestions.length} Candidates Available
        </span>
      </div>

      {/* Suggested matches cards */}
      <div className="grid grid-cols-1 gap-4">
        {suggestions.length === 0 ? (
          <div className="col-span-1 bg-white border border-border rounded-card p-10 text-center flex flex-col items-center gap-3">
            <Ban className="w-8 h-8 text-text-secondary/50" />
            <h4 className="font-heading font-bold text-text-primary text-xs">No Suitable Matches Found</h4>
            <p className="text-[10px] text-text-secondary max-w-sm leading-normal">
              The matching algorithm could not identify candidates passing all hard filters. Try adjusting client location, age, or children views.
            </p>
          </div>
        ) : (
          suggestions.map(({ profile, explanation }) => {
            const { stars, label } = getStarRating(explanation.score);
            const highlights = getHighlightChips(profile);
            const isMatchSent = sentMatches[profile.id];

            return (
              <div
                key={profile.id}
                onClick={() => onSelectMatch(profile, explanation)}
                className={`premium-card p-5 rounded-card border flex flex-col justify-between gap-4 cursor-pointer relative ${
                  selectedCandidateId === profile.id 
                    ? 'border-primary ring-1 ring-primary/10 shadow-card-hover' 
                    : 'border-border'
                }`}
              >
                {/* Score badge at top right */}
                <div className="absolute top-4 right-4 flex items-center justify-center w-11 h-11 rounded-full bg-primary/5 border border-primary/10">
                  <span className="font-mono font-bold text-primary text-sm">{explanation.score}%</span>
                </div>

                <div className="flex gap-4 items-start">
                  <img
                    src={profile.avatar}
                    alt={profile.fullName}
                    className="w-13 h-13 rounded-full object-cover border border-border"
                  />
                  <div className="pr-12">
                    <h4 className="font-heading font-bold text-text-primary text-sm flex items-center gap-1.5">
                      {profile.fullName}
                      <span className="text-[10px] text-text-secondary font-normal font-mono">({profile.id})</span>
                    </h4>
                    <p className="text-[10px] text-text-secondary mt-0.5 font-medium leading-relaxed">
                      {profile.age} yrs &bull; {profile.height} &bull; {profile.religion} ({profile.caste})
                    </p>
                    <p className="text-[10px] text-text-secondary mt-0.5 leading-relaxed font-semibold">
                      {profile.designation} at {profile.company} &bull; <span className="text-primary font-mono">{profile.income} LPA</span>
                    </p>
                  </div>
                </div>

                {/* Compatibility and Highlights */}
                <div className="flex flex-col gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <div className="flex text-accent">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < stars ? 'fill-accent' : 'text-zinc-200'}`} />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-text-primary ml-1">{label}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {highlights.map((h, i) => (
                      <span key={i} className="text-[9px] bg-background-secondary border border-border px-2 py-0.5 rounded text-text-primary font-medium">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action footer */}
                <div className="border-t border-border/60 pt-3 flex justify-between items-center mt-1">
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] text-text-secondary">Next Action:</span>
                    <span className="text-[9px] font-semibold text-text-primary">Open AI Copilot Brief</span>
                  </div>
                  
                  {isMatchSent ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-success font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Sent</span>
                      </span>
                      <MatchFeedback clientId={client.id} matchId={profile.id} matchName={profile.fullName} compact={true} />
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSendMatch(profile, explanation.score);
                      }}
                      disabled={sendingMatchId === profile.id}
                      className="bg-primary hover:bg-primary/95 text-white text-[10px] font-semibold py-1.5 px-3 rounded-interactive shadow-sm hover:shadow transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <HeartHandshake className="w-3.5 h-3.5" />
                      <span>{sendingMatchId === profile.id ? 'Sending...' : 'Send Match'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Collagen Why Not Exclusions list */}
      {exclusions.length > 0 && (
        <div className="border border-border rounded-card bg-white mt-2 overflow-hidden shadow-sm">
          <button
            onClick={() => setExpandedExclusions(!expandedExclusions)}
            className="w-full flex justify-between items-center p-4 text-xs font-semibold text-text-primary hover:bg-background-secondary/35 transition-colors cursor-pointer border-none bg-transparent"
          >
            <div className="flex items-center gap-2">
              <Ban className="w-4 h-4 text-text-secondary" />
              <span>Excluded Profiles ({exclusions.length}) &bull; Why Not?</span>
            </div>
            {expandedExclusions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {expandedExclusions && (
            <div className="border-t border-border p-4 bg-background-secondary/15 flex flex-col gap-3.5">
              {exclusions.map(({ profile, explanation }) => (
                <div key={profile.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border/50 last:border-0 pb-3 last:pb-0 gap-2.5">
                  <div className="flex gap-3 items-center">
                    <img
                      src={profile.avatar}
                      alt={profile.fullName}
                      className="w-8 h-8 rounded-full object-cover filter grayscale opacity-75 border border-border"
                    />
                    <div>
                      <h5 className="font-heading font-bold text-text-primary text-xs leading-none">
                        {profile.fullName} <span className="font-mono text-[9px] text-text-secondary">({profile.id})</span>
                      </h5>
                      <span className="text-[10px] text-text-secondary block mt-0.5">
                        {profile.age} yrs &bull; {profile.height} &bull; {profile.religion}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] bg-error/5 border border-error/15 text-error px-2.5 py-1 rounded-interactive font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{explanation.recommendation}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
