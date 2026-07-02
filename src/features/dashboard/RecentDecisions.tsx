import React from 'react';
import { useMatchStore } from '../../stores/matchStore';

export const RecentDecisions: React.FC = () => {
  const { decisionHistory } = useMatchStore();
  const recents = decisionHistory.slice(0, 5); // Show latest 5

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'Accepted':
        return 'bg-success/5 text-success border border-success/15';
      case 'Rejected':
        return 'bg-error/5 text-error border border-error/15';
      default:
        return 'bg-warning/5 text-warning border border-warning/15';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Sent'
      ? 'bg-primary/5 text-primary border border-primary/15'
      : 'bg-zinc-100 text-zinc-600 border border-zinc-200';
  };

  return (
    <div className="bg-white border border-border rounded-card p-5 shadow-sm w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-heading font-bold text-text-primary text-sm">
          Recent Matchmaker Decisions
        </h3>
        <span className="text-[10px] text-text-secondary">CRM Log Audit</span>
      </div>

      {recents.length === 0 ? (
        <div className="text-center py-6 text-xs text-text-secondary">
          No matchmaking decisions recorded yet today.
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border text-text-secondary font-medium">
                <th className="py-2.5 font-medium">Client</th>
                <th className="py-2.5 font-medium">Suggested Match</th>
                <th className="py-2.5 font-medium">Action</th>
                <th className="py-2.5 font-medium text-center">Compatibility</th>
                <th className="py-2.5 font-medium">Outcome</th>
                <th className="py-2.5 font-medium">Decided In</th>
                <th className="py-2.5 font-medium hidden sm:table-cell">Notes</th>
              </tr>
            </thead>
            <tbody>
              {recents.map((decision) => (
                <tr
                  key={decision.id}
                  className="border-b border-border/50 hover:bg-background-secondary/40 transition-colors"
                >
                  <td className="py-3 font-semibold text-text-primary">{decision.clientName}</td>
                  <td className="py-3 text-text-primary">{decision.matchName}</td>
                  <td className="py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${getStatusColor(decision.status)}`}>
                      {decision.status}
                    </span>
                  </td>
                  <td className="py-3 text-center font-mono font-semibold text-text-primary">
                    {decision.aiScore}%
                  </td>
                  <td className="py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${getOutcomeColor(decision.outcome)}`}>
                      {decision.outcome}
                    </span>
                  </td>
                  <td className="py-3 text-text-secondary font-mono">{decision.timeTaken}</td>
                  <td className="py-3 text-text-secondary truncate max-w-[140px] hidden sm:table-cell" title={decision.notes}>
                    {decision.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
