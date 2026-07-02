import React from 'react';
import { useProfileStore } from '../../stores/profileStore';
import { useMatchStore } from '../../stores/matchStore';
import { useNoteStore } from '../../stores/noteStore';
import { Sparkles, CalendarDays, Clock3, Eye, ArrowRight } from 'lucide-react';
import type { Profile } from '../../types';

interface CopilotPrioritiesProps {
  onSelectClient: (client: Profile) => void;
}

export const CopilotPriorities: React.FC<CopilotPrioritiesProps> = ({ onSelectClient }) => {
  const { profiles } = useProfileStore();
  const { decisionHistory } = useMatchStore();
  const { notes } = useNoteStore();

  // 1. Calculate dynamic priorities
  const pendingReviewCount = profiles.filter(p => p.stage === 'Verified').length;
  const meetingsTodayCount = profiles.filter(p => p.stage === 'Meeting').length;
  const pendingDecisionsCount = decisionHistory.filter(d => d.outcome === 'Pending').length;
  
  // Follow-ups due (reminders set for today or past)
  const todayStr = new Date().toISOString().split('T')[0];
  const followUpsCount = notes.filter(n => n.reminderDate && n.reminderDate <= todayStr).length;

  // 2. Determine Recommended Next Action client
  // Priority: Clients in 'Verified' or 'Matching' stages with incomplete steps or high potential
  const recommendedClient = profiles.find(p => p.stage === 'Verified') || 
                            profiles.find(p => p.stage === 'Matching') || 
                            profiles[0];

  const handleActionClick = () => {
    if (recommendedClient) {
      onSelectClient(recommendedClient);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Greetings Header */}
      <div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-text-primary tracking-tight">
          Good morning, Sarah
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Here is your matchmaking priority pipeline overview for today.
        </p>
      </div>

      {/* Priorities HUD Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <div className="bg-white border border-border p-4 rounded-card shadow-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-error/5 flex items-center justify-center border border-error/10 text-error">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <div className="font-mono text-lg font-bold text-text-primary leading-none">{pendingReviewCount}</div>
            <div className="text-[11px] text-text-secondary mt-1">Pending Review</div>
          </div>
        </div>

        <div className="bg-white border border-border p-4 rounded-card shadow-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-warning/5 flex items-center justify-center border border-warning/10 text-warning">
            <Clock3 className="w-4 h-4" />
          </div>
          <div>
            <div className="font-mono text-lg font-bold text-text-primary leading-none">{followUpsCount}</div>
            <div className="text-[11px] text-text-secondary mt-1">Active Follow-ups</div>
          </div>
        </div>

        <div className="bg-white border border-border p-4 rounded-card shadow-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10 text-primary">
            <CalendarDays className="w-4 h-4" />
          </div>
          <div>
            <div className="font-mono text-lg font-bold text-text-primary leading-none">{meetingsTodayCount}</div>
            <div className="text-[11px] text-text-secondary mt-1">Meetings Today</div>
          </div>
        </div>

        <div className="bg-white border border-border p-4 rounded-card shadow-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-success/5 flex items-center justify-center border border-success/10 text-success">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="font-mono text-lg font-bold text-text-primary leading-none">{pendingDecisionsCount}</div>
            <div className="text-[11px] text-text-secondary mt-1">Matches Awaiting Approval</div>
          </div>
        </div>
      </div>

      {/* Recommended Next Action Card */}
      {recommendedClient && (
        <div className="bg-white border border-border rounded-card p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
          {/* Subtle gradient glow */}
          <div className="absolute right-0 top-0 w-24 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
          
          <div className="flex gap-4 items-start sm:items-center">
            <div className="w-10 h-10 bg-primary/5 border border-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-xs font-semibold text-primary uppercase tracking-wider">Recommended Next Action</div>
              <h3 className="font-heading font-bold text-text-primary text-sm mt-0.5">
                Review {recommendedClient.fullName}'s matching pool
              </h3>
              <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
                {recommendedClient.stage === 'Verified' 
                  ? 'Client is newly verified. Begin generating potential matches.' 
                  : 'Review recent compatible matching proposals waiting for matchmaker approval.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleActionClick}
            className="flex items-center gap-1.5 text-xs font-heading font-bold text-primary hover:text-primary/95 hover:translate-x-0.5 transition-all w-fit cursor-pointer"
          >
            <span>Open Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
