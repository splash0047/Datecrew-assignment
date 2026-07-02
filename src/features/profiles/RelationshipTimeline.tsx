import React, { useMemo } from 'react';
import type { Profile } from '../../types';
import { useNoteStore } from '../../stores/noteStore';
import { useMatchStore } from '../../stores/matchStore';
import { MessageCircle, HeartHandshake, CheckCircle2, XCircle, Clock3, Tag, Calendar } from 'lucide-react';

interface RelationshipTimelineProps {
  client: Profile;
}

interface TimelineItem {
  id: string;
  date: string;
  type: 'note' | 'decision_sent' | 'decision_outcome' | 'stage_changed';
  title: string;
  description: string;
  icon: React.ReactNode;
  tags?: string[];
  mood?: string;
  outcome?: string;
  timeTaken?: string;
  score?: number;
}

export const RelationshipTimeline: React.FC<RelationshipTimelineProps> = ({ client }) => {
  const { notes } = useNoteStore();
  const { decisionHistory } = useMatchStore();

  const timelineItems = useMemo(() => {
    const items: TimelineItem[] = [];

    // 1. Fetch notes
    const clientNotes = notes.filter((n) => n.clientId === client.id);
    clientNotes.forEach((note) => {
      items.push({
        id: note.id,
        date: note.date,
        type: 'note',
        title: 'Meeting Note Added',
        description: note.summary,
        icon: <MessageCircle className="w-3.5 h-3.5 text-accent" />,
        tags: note.tags,
        mood: note.mood,
        outcome: note.outcome
      });
    });

    // 2. Fetch decisions
    const clientDecisions = decisionHistory.filter((d) => d.clientId === client.id);
    clientDecisions.forEach((dec) => {
      // Sent action
      items.push({
        id: `${dec.id}_sent`,
        date: dec.date,
        type: 'decision_sent',
        title: `Match Proposal Sent: ${dec.matchName}`,
        description: dec.notes || `Shared profile recommendation of ${dec.matchName}.`,
        icon: <HeartHandshake className="w-3.5 h-3.5 text-primary" />,
        score: dec.aiScore,
        timeTaken: dec.timeTaken
      });

      // Outcome action (if resolved)
      if (dec.outcome !== 'Pending') {
        const isAccepted = dec.outcome === 'Accepted';
        items.push({
          id: `${dec.id}_outcome`,
          date: dec.date, // mock date same or nearby
          type: 'decision_outcome',
          title: `Match Proposal ${dec.outcome}: ${dec.matchName}`,
          description: isAccepted 
            ? `Client accepted introduction recommendation with ${dec.matchName} after ${dec.timeTaken}.`
            : `Client rejected introduction recommendation with ${dec.matchName} after ${dec.timeTaken}.`,
          icon: isAccepted 
            ? <CheckCircle2 className="w-3.5 h-3.5 text-success" /> 
            : <XCircle className="w-3.5 h-3.5 text-error" />,
          outcome: dec.outcome
        });
      }
    });

    // Sort items by date descending
    return items.sort((a, b) => b.date.localeCompare(a.date));
  }, [notes, decisionHistory, client.id]);

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'Positive':
      case 'Accepted':
        return 'bg-success/5 text-success border border-success/15';
      case 'Concern':
      case 'Rejected':
        return 'bg-error/5 text-error border border-error/15';
      default:
        return 'bg-zinc-100 text-zinc-600 border border-zinc-200';
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-text-primary">Relationship History Timeline</span>
        <span className="text-[10px] text-text-secondary">{timelineItems.length} records found</span>
      </div>

      {timelineItems.length === 0 ? (
        <div className="bg-white border border-border rounded-card p-8 text-center flex flex-col items-center gap-2">
          <Calendar className="w-8 h-8 text-text-secondary/50 mb-1" />
          <h4 className="font-heading font-bold text-text-primary text-xs">No Timeline Entries Recorded</h4>
          <p className="text-[10px] text-text-secondary max-w-[220px] leading-normal">
            Start by adding a meeting note or sending a match to establish this client's audit pipeline.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6 relative pl-3.5 mt-2">
          {/* Vertical timeline timeline line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border z-0" />

          {timelineItems.map((item) => (
            <div key={item.id} className="flex gap-4 items-start relative z-10">
              {/* Timeline marker icon indicator */}
              <div className="w-7 h-7 rounded-full bg-white border border-border flex items-center justify-center flex-shrink-0 shadow-sm">
                {item.icon}
              </div>

              <div className="bg-white border border-border rounded-card p-4 shadow-sm flex-grow flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-heading font-bold text-text-primary text-xs leading-tight">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[10px] text-text-secondary mt-0.5 font-mono">
                      <span>{item.date}</span>
                      {item.score && (
                        <>
                          <span>&bull;</span>
                          <span className="text-primary font-semibold">AI Match Score: {item.score}%</span>
                        </>
                      )}
                    </div>
                  </div>

                  {item.outcome && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold border ${getOutcomeColor(item.outcome)}`}>
                      {item.outcome}
                    </span>
                  )}
                  {item.mood && (
                    <span className="text-xs" title={`Meeting Mood: ${item.mood}`}>
                      {item.mood}
                    </span>
                  )}
                </div>

                <p className="text-xs text-text-secondary leading-relaxed">
                  {item.description}
                </p>

                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 items-center mt-1 border-t border-border/50 pt-2">
                    <Tag className="w-3 h-3 text-text-secondary/70" />
                    {item.tags.map((t, i) => (
                      <span key={i} className="text-[9px] bg-background px-1.5 py-0.5 rounded border border-border text-text-secondary">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {item.timeTaken && (
                  <div className="flex items-center gap-1 text-[9px] text-text-secondary font-mono mt-1 border-t border-border/50 pt-2">
                    <Clock3 className="w-3 h-3" />
                    <span>Decision Time Taken: {item.timeTaken}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
