import React from 'react';
import { useMatchStore } from '../../stores/matchStore';
import { HeartHandshake, MessageCircle, CalendarDays, CheckCircle2, XCircle, RefreshCw, Clock3 } from 'lucide-react';
import type { ActivityLog } from '../../types';

export const ActivityFeed: React.FC = () => {
  const { activityLogs } = useMatchStore();
  const logs = activityLogs.slice(0, 8); // Latest 8 items

  // Grouping logs by timeframe
  const groupLogs = (logsList: ActivityLog[]) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const grouped: { today: ActivityLog[]; yesterday: ActivityLog[]; earlier: ActivityLog[] } = {
      today: [],
      yesterday: [],
      earlier: []
    };

    logsList.forEach((log) => {
      const logDateStr = log.timestamp.split('T')[0];
      if (logDateStr === todayStr) {
        grouped.today.push(log);
      } else if (logDateStr === yesterdayStr) {
        grouped.yesterday.push(log);
      } else {
        grouped.earlier.push(log);
      }
    });

    return grouped;
  };

  const grouped = groupLogs(logs);

  const getIcon = (type: string) => {
    const className = "w-4 h-4";
    switch (type) {
      case 'match_sent':
        return <HeartHandshake className={`${className} text-primary`} />;
      case 'note_added':
        return <MessageCircle className={`${className} text-accent`} />;
      case 'meeting':
        return <CalendarDays className={`${className} text-purple-600`} />;
      case 'accepted':
        return <CheckCircle2 className={`${className} text-success`} />;
      case 'rejected':
        return <XCircle className={`${className} text-error`} />;
      default:
        return <RefreshCw className={`${className} text-zinc-500`} />;
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const renderSection = (title: string, items: ActivityLog[]) => {
    if (items.length === 0) return null;

    return (
      <div className="flex flex-col gap-3">
        <div className="text-[10px] font-bold text-text-secondary uppercase tracking-wider pl-9">{title}</div>
        <div className="flex flex-col gap-4 relative">
          {/* Vertical timeline connector line */}
          <div className="absolute left-[17px] top-2 bottom-2 w-px bg-border z-0" />
          
          {items.map((log) => (
            <div key={log.id} className="flex gap-4 items-start relative z-10">
              <div className="w-9 h-9 rounded-full bg-white border border-border flex items-center justify-center flex-shrink-0 shadow-sm">
                {getIcon(log.type)}
              </div>
              <div className="flex flex-col gap-0.5 mt-0.5">
                <p className="text-xs text-text-primary leading-tight font-medium">
                  {log.description}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-text-secondary">
                  <Clock3 className="w-3 h-3 text-text-secondary/65" />
                  <span>{formatTime(log.timestamp)}</span>
                  <span>&bull;</span>
                  <span className="font-semibold text-text-primary/75">{log.clientName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border border-border rounded-card p-5 shadow-sm w-full flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h3 className="font-heading font-bold text-text-primary text-sm">
          Operational Activity Feed
        </h3>
        <span className="text-[10px] text-text-secondary">Live Audit Stream</span>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-6 text-xs text-text-secondary">
          No operations recorded yet.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {renderSection('Today', grouped.today)}
          {renderSection('Yesterday', grouped.yesterday)}
          {renderSection('Earlier', grouped.earlier)}
        </div>
      )}
    </div>
  );
};
