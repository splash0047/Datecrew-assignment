export const JOURNEY_STAGES = [
  'Verified',
  'Consultation',
  'Matching',
  'Meeting',
  'Closed'
] as const;

export type JourneyStage = typeof JOURNEY_STAGES[number];

export interface StageConfig {
  name: JourneyStage;
  color: string;
  description: string;
}

export const STAGES_METADATA: Record<JourneyStage, StageConfig> = {
  Verified: {
    name: 'Verified',
    color: 'bg-zinc-100 text-zinc-800 border-zinc-200',
    description: 'Profile verified by matching team'
  },
  Consultation: {
    name: 'Consultation',
    color: 'bg-blue-50 text-blue-800 border-blue-200',
    description: 'Initial meeting and preferences call scheduled'
  },
  Matching: {
    name: 'Matching',
    color: 'bg-amber-50 text-amber-800 border-amber-200',
    description: 'Active recommendations being generated'
  },
  Meeting: {
    name: 'Meeting',
    color: 'bg-purple-50 text-purple-800 border-purple-200',
    description: 'Introduction set up and candidate meeting scheduled'
  },
  Closed: {
    name: 'Closed',
    color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    description: 'Successfully matched or archive case'
  }
};
