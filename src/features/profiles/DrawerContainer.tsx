import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Profile, MatchExplanation } from '../../types';
import { useProfileStore } from '../../stores/profileStore';
import { useMatchStore } from '../../stores/matchStore';
import { matchingService } from '../../services/matching';
import { JourneyTimeline } from './JourneyTimeline';
import { ProfileDetails } from './ProfileDetails';
import { RelationshipTimeline } from './RelationshipTimeline';
import { MeetingNotes } from '../notes/MeetingNotes';
import { SuggestedMatches } from '../matching/SuggestedMatches';
import { MatchBrief } from '../matching/MatchBrief';
import { X, UserRound, Sparkles, Star, ArrowRight } from 'lucide-react';
import type { JourneyStage } from '../../config/journeyConfig';

interface DrawerContainerProps {
  clientId: string | null;
  onClose: () => void;
}

export const DrawerContainer: React.FC<DrawerContainerProps> = ({ clientId, onClose }) => {
  const { profiles, updateProfileStage, updateProfile } = useProfileStore();
  const { addActivityLog } = useMatchStore();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'matches' | 'timeline' | 'notes'>('overview');
  const [selectedCandidate, setSelectedCandidate] = useState<Profile | null>(null);
  const [selectedExplanation, setSelectedExplanation] = useState<MatchExplanation | null>(null);

  // Get active client
  const client = useMemo(() => {
    return profiles.find((p) => p.id === clientId) || null;
  }, [profiles, clientId]);

  // Compute matches to find the best match for the "Match Snapshot"
  const bestMatch = useMemo(() => {
    if (!client) return null;
    const matches = matchingService.findMatches(client, profiles);
    const validMatches = matches.filter(m => m.explanation.score > 0);
    return validMatches.length > 0 ? validMatches[0] : null;
  }, [client, profiles]);

  const handleCompleteField = (updated: Profile) => {
    updateProfile(updated);
  };

  const handleStageChange = (stage: JourneyStage) => {
    if (client) {
      updateProfileStage(client.id, stage);
      addActivityLog(
        client.id,
        client.fullName,
        'stage_changed',
        `Journey status updated: ${client.stage} → ${stage}.`
      );
    }
  };

  const handleSelectMatch = (candidate: Profile, explanation: MatchExplanation) => {
    setSelectedCandidate(candidate);
    setSelectedExplanation(explanation);
  };

  const handleCloseCopilot = () => {
    setSelectedCandidate(null);
    setSelectedExplanation(null);
  };

  return (
    <AnimatePresence>
      {client && (
        <>
          {/* Backdrop Fade Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40 no-print"
          />

          {/* Drawer Slide Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[540px] md:w-[600px] bg-[#F8F7F4] shadow-2xl z-50 border-l border-border flex flex-col justify-between overflow-y-auto no-print"
          >
            {/* Main Content scrollable block */}
            <div className="flex-grow flex flex-col p-6 gap-6">
              {/* Top Header */}
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center border border-primary/10">
                    {client.avatar ? (
                      <img src={client.avatar} alt={client.fullName} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <UserRound className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-base text-text-primary flex items-center gap-1.5 leading-none">
                      {client.fullName}
                      <span className="text-[10px] text-text-secondary font-mono font-normal">({client.id})</span>
                    </h3>
                    <p className="text-[10px] text-text-secondary mt-1">
                      {client.gender} &bull; {client.age} yrs &bull; {client.city} &bull; {client.maritalStatus}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-text-secondary hover:text-text-primary p-2 hover:bg-background-secondary rounded-full transition-colors cursor-pointer border-none bg-transparent"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Match Snapshot Top-Level Banner */}
              {bestMatch && (
                <div className="bg-gradient-to-br from-indigo-50 to-white border border-primary/20 p-4 rounded-card shadow-sm flex flex-col gap-2 relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Best Potential Match Snapshot</span>
                    </span>
                    <span className="font-mono font-bold text-primary text-xs bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                      {bestMatch.explanation.score}% Match
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 mt-1 border-b border-border/50 pb-2">
                    <div>
                      <h4 className="font-heading font-bold text-text-primary text-xs leading-none">
                        {bestMatch.profile.fullName}
                      </h4>
                      <p className="text-[10px] text-text-secondary mt-1">
                        {bestMatch.profile.age} yrs &bull; {bestMatch.profile.designation} &bull; {bestMatch.profile.city}
                      </p>
                    </div>
                    <button
                      onClick={() => handleSelectMatch(bestMatch.profile, bestMatch.explanation)}
                      className="bg-white hover:bg-zinc-50 border border-border text-[9px] font-bold py-1 px-2.5 rounded-interactive shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-0.5 text-primary cursor-pointer"
                    >
                      <span>AI Copilot Brief</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between sm:items-center text-[10px] gap-2 pt-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                      <span className="font-semibold text-text-primary">★★★★★ Excellent Fit</span>
                      <span className="text-text-secondary">| Same City &bull; Career Aligned</span>
                    </div>
                    <span className="text-text-secondary">
                      Recommended Action: <strong className="text-text-primary">Send Match</strong>
                    </span>
                  </div>
                </div>
              )}

              {/* Drawer Tabs */}
              <div className="flex border-b border-border text-xs gap-6 pl-1 select-none">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-2.5 font-heading font-bold border-b-2 transition-all cursor-pointer ${
                    activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('matches')}
                  className={`pb-2.5 font-heading font-bold border-b-2 transition-all cursor-pointer ${
                    activeTab === 'matches' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
                  }`}
                >
                  AI Match Pool
                </button>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`pb-2.5 font-heading font-bold border-b-2 transition-all cursor-pointer ${
                    activeTab === 'timeline' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Timeline
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`pb-2.5 font-heading font-bold border-b-2 transition-all cursor-pointer ${
                    activeTab === 'notes' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Meeting Notes
                </button>
              </div>

              {/* Drawer Panels */}
              <div className="flex-grow flex flex-col gap-6">
                {activeTab === 'overview' && (
                  <>
                    <JourneyTimeline client={client} onChangeStage={handleStageChange} />
                    <ProfileDetails client={client} onCompleteField={handleCompleteField} />
                  </>
                )}

                {activeTab === 'matches' && (
                  <SuggestedMatches
                    client={client}
                    onSelectMatch={handleSelectMatch}
                    selectedCandidateId={selectedCandidate?.id || null}
                  />
                )}

                {activeTab === 'timeline' && (
                  <RelationshipTimeline client={client} />
                )}

                {activeTab === 'notes' && (
                  <MeetingNotes client={client} />
                )}
              </div>
            </div>

            {/* AI Copilot Side Overlay (nested drawer for detailed analysis) */}
            <AnimatePresence>
              {selectedCandidate && selectedExplanation && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    exit={{ opacity: 0 }}
                    onClick={handleCloseCopilot}
                    className="absolute inset-0 bg-black z-20 rounded-l-card"
                  />
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="absolute right-0 top-0 bottom-0 w-[92%] sm:w-[94%] bg-[#F8F7F4] border-l border-border z-30 flex flex-col p-6 overflow-y-auto gap-6 shadow-2xl rounded-l-card"
                  >
                    <div className="flex justify-between items-center pb-4 border-b border-border">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <h4 className="font-heading font-extrabold text-sm text-text-primary">
                          AI Compatibility Brief
                        </h4>
                      </div>
                      <button
                        onClick={handleCloseCopilot}
                        className="text-text-secondary hover:text-text-primary p-1.5 hover:bg-background-secondary rounded-full transition-colors cursor-pointer border-none bg-transparent"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <MatchBrief
                      client={client}
                      candidate={selectedCandidate}
                      baseExplanation={selectedExplanation}
                    />
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
