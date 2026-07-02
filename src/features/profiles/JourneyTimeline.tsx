import React from 'react';
import { JOURNEY_STAGES } from '../../config/journeyConfig';
import type { JourneyStage } from '../../config/journeyConfig';
import { Check } from 'lucide-react';
import type { Profile } from '../../types';

interface JourneyTimelineProps {
  client: Profile;
  onChangeStage: (stage: JourneyStage) => void;
}

export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({ client, onChangeStage }) => {
  const currentStageIndex = JOURNEY_STAGES.indexOf(client.stage);

  return (
    <div className="flex flex-col gap-3 w-full bg-background-secondary/50 border border-border p-4 rounded-interactive">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-text-primary">Pipeline Progress</span>
        <span className="text-[10px] text-text-secondary bg-white px-2 py-0.5 rounded border border-border font-mono uppercase">
          Stage: {client.stage}
        </span>
      </div>

      {/* Progress timeline bar */}
      <div className="flex items-center justify-between w-full relative mt-2 px-1">
        {/* Horizontal connector line */}
        <div className="absolute left-6 right-6 top-3 h-0.5 bg-border z-0" />
        <div
          className="absolute left-6 top-3 h-0.5 bg-primary z-0 transition-all duration-300 ease-out"
          style={{ width: `${(currentStageIndex / (JOURNEY_STAGES.length - 1)) * 92}%` }}
        />

        {JOURNEY_STAGES.map((stage, index) => {
          const isCompleted = index < currentStageIndex;
          const isActive = stage === client.stage;
          
          return (
            <div key={stage} className="flex flex-col items-center gap-1.5 relative z-10">
              <button
                onClick={() => onChangeStage(stage)}
                className={`w-6.5 h-6.5 rounded-full flex items-center justify-center border text-[10px] font-bold transition-all cursor-pointer ${
                  isCompleted 
                    ? 'bg-primary border-primary text-white' 
                    : isActive 
                      ? 'bg-white border-primary text-primary ring-2 ring-primary/10 scale-110' 
                      : 'bg-white border-border text-text-secondary hover:border-text-secondary'
                }`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : index + 1}
              </button>
              <span className={`text-[10px] font-medium transition-colors ${
                isActive ? 'text-primary font-semibold' : 'text-text-secondary'
              }`}>
                {stage}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
