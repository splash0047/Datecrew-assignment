import React, { useState } from 'react';
import type { Profile, MatchExplanation } from '../../types';
import { useAI } from '../../hooks/useAI';
import { Sparkles, AlertCircle, Copy, Check, Printer, Mail } from 'lucide-react';

interface MatchBriefProps {
  client: Profile;
  candidate: Profile;
  baseExplanation: MatchExplanation;
}

export const MatchBrief: React.FC<MatchBriefProps> = ({
  client,
  candidate,
  baseExplanation
}) => {
  const { loading, error, analysis, emails, isFallback, refetch } = useAI(client, candidate);
  const [emailTone, setEmailTone] = useState<'professional' | 'friendly' | 'warm'>('professional');
  const [copied, setCopied] = useState(false);
  const [sentMockEmail, setSentMockEmail] = useState(false);

  // Render Skeleton Loader
  if (loading) {
    return (
      <div className="bg-white border border-border rounded-card p-6 shadow-sm flex flex-col gap-6 w-full animate-pulse">
        <div className="flex justify-between items-center pb-4 border-b border-border/50">
          <div className="h-4 bg-zinc-200 rounded w-1/3" />
          <div className="h-4 bg-zinc-200 rounded w-10" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="h-3 bg-zinc-200 rounded w-full" />
          <div className="h-3 bg-zinc-200 rounded w-5/6" />
          <div className="h-3 bg-zinc-200 rounded w-4/6" />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="h-24 bg-zinc-100 rounded-interactive" />
          <div className="h-24 bg-zinc-100 rounded-interactive" />
        </div>
        <div className="h-10 bg-zinc-200 rounded-interactive w-full mt-4" />
      </div>
    );
  }

  // Fallback to local rule engine explanation if fetching returns null
  const displayAnalysis = analysis || {
    score: baseExplanation.score,
    reasons: baseExplanation.reasons,
    concerns: ['Please review location and family background match.'],
    recommendation: baseExplanation.recommendation,
    nextStep: baseExplanation.nextStep
  };

  const displayEmails = emails || {
    professional: `Dear Family, I suggest reviewing the profile of ${candidate.fullName}. They are working as ${candidate.designation} at ${candidate.company}.`,
    friendly: `Hey, I found a cool match for you! Meet ${candidate.firstName}, a ${candidate.designation}.`,
    warm: `Namaste, we have a wonderful proposal. ${candidate.fullName} shares excellent values with your family.`
  };

  const activeEmailContent = displayEmails[emailTone];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(activeEmailContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMockSendEmail = () => {
    setSentMockEmail(true);
    setTimeout(() => setSentMockEmail(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6 w-full relative">
      {/* Printable Report Only Layout Wrapper */}
      <div className="print-only hidden">
        <div className="print-page flex flex-col gap-8 p-12">
          <div className="print-header flex justify-between items-center border-b-2 border-[#5B4AE6] pb-4 mb-4">
            <div>
              <h1 className="font-heading font-extrabold text-2xl text-text-primary">THE DATE CREW</h1>
              <span className="text-[10px] text-text-secondary font-mono tracking-wider">PREMIUM MATCHMAKING EXCLUSIVES</span>
            </div>
            <div className="text-right">
              <h4 className="font-heading font-bold text-xs text-text-primary">Match Compatibility Brief</h4>
              <span className="text-[9px] text-text-secondary font-mono">Date: {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div className="print-grid grid grid-cols-2 gap-6">
            <div className="border border-border p-4 rounded-card">
              <h3 className="font-heading font-bold text-xs text-text-primary uppercase border-b border-border pb-1.5 mb-2">Client Details</h3>
              <div className="text-xs flex flex-col gap-1">
                <div><span className="text-text-secondary">Name:</span> <strong>{client.fullName}</strong> ({client.id})</div>
                <div><span className="text-text-secondary">Age/Height:</span> {client.age} yrs / {client.height}</div>
                <div><span className="text-text-secondary">City:</span> {client.city}</div>
                <div><span className="text-text-secondary">Career:</span> {client.designation} &bull; {client.company} ({client.income} LPA)</div>
                <div><span className="text-text-secondary">Education:</span> {client.degree} &bull; {client.college}</div>
              </div>
            </div>

            <div className="border border-border p-4 rounded-card">
              <h3 className="font-heading font-bold text-xs text-text-primary uppercase border-b border-border pb-1.5 mb-2">Candidate Details</h3>
              <div className="text-xs flex flex-col gap-1">
                <div><span className="text-text-secondary">Name:</span> <strong>{candidate.fullName}</strong> ({candidate.id})</div>
                <div><span className="text-text-secondary">Age/Height:</span> {candidate.age} yrs / {candidate.height}</div>
                <div><span className="text-text-secondary">City:</span> {candidate.city}</div>
                <div><span className="text-text-secondary">Career:</span> {candidate.designation} &bull; {candidate.company} ({candidate.income} LPA)</div>
                <div><span className="text-text-secondary">Education:</span> {candidate.degree} &bull; {candidate.college}</div>
              </div>
            </div>
          </div>

          <div className="border border-border p-5 rounded-card flex flex-col gap-3 mt-4">
            <h3 className="font-heading font-bold text-xs text-text-primary uppercase border-b border-border pb-1.5">Compatibility Breakdown</h3>
            <div className="flex items-center gap-4">
              <span className="font-mono font-extrabold text-3xl text-primary">{displayAnalysis.score}%</span>
              <div>
                <div className="font-heading font-bold text-xs text-text-primary">Overall Strength Score</div>
                <div className="text-[10px] text-text-secondary">Based on dynamic hard filters and weighted soft matching configs.</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <h5 className="font-heading font-bold text-[10px] text-text-primary mb-1 uppercase tracking-wider">Strengths</h5>
                <ul className="list-disc pl-4 text-xs text-text-secondary flex flex-col gap-0.5">
                  {displayAnalysis.reasons.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
              <div>
                <h5 className="font-heading font-bold text-[10px] text-text-primary mb-1 uppercase tracking-wider">Potential Risks</h5>
                <ul className="list-disc pl-4 text-xs text-text-secondary flex flex-col gap-0.5">
                  {displayAnalysis.concerns.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            </div>
          </div>

          <div className="border border-border p-5 rounded-card flex flex-col gap-2 mt-4">
            <h3 className="font-heading font-bold text-xs text-text-primary uppercase border-b border-border pb-1.5">AI Matchmaker Copilot Verdict</h3>
            <p className="text-xs text-text-secondary leading-relaxed font-medium">{displayAnalysis.recommendation}</p>
            <div className="text-xs text-text-primary mt-2"><strong>Recommended Next Action:</strong> {displayAnalysis.nextStep}</div>
          </div>
        </div>
      </div>

      {/* Main Interactive AI Card Panel */}
      <div className="bg-gradient-to-br from-indigo-50/50 to-white border border-primary/20 rounded-card p-5 shadow-sm flex flex-col gap-4">
        {/* Title */}
        <div className="flex justify-between items-center pb-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="font-heading font-bold text-sm text-text-primary">
              AI Matchmaker Copilot
            </h3>
          </div>
          <button
            onClick={handlePrint}
            className="text-text-secondary hover:text-text-primary p-1.5 hover:bg-background-secondary rounded-interactive transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-semibold border border-border"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>

        {/* Error Alert fallback check */}
        {error && (
          <div className="bg-warning/5 border border-warning/10 text-warning rounded-interactive p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
            <div className="flex gap-2 items-center">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Gemini unavailable. Using local compatibility engine.</span>
            </div>
            <button
              onClick={refetch}
              className="bg-white border border-border px-2.5 py-1 rounded text-[10px] font-semibold hover:bg-zinc-50 cursor-pointer shadow-sm"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Score & Rating Highlights */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch justify-between mt-1">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="font-mono font-extrabold text-lg text-primary">{displayAnalysis.score}%</span>
            </div>
            <div>
              <div className="font-heading font-bold text-xs text-text-primary">Overall Compatibility</div>
              <div className="text-[10px] text-text-secondary mt-0.5">
                Recommendation Strength: <span className="font-semibold text-text-primary">High</span> &bull; 92% completeness
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center bg-white border border-border rounded-interactive px-4 py-2.5 shadow-sm text-xs sm:self-center">
            <span className="text-[10px] text-text-secondary block">AI Recommendation Verdict</span>
            <span className="font-heading font-extrabold text-primary block mt-0.5">★★★★★ Excellent Fit</span>
          </div>
        </div>

        {/* Dynamic Strengths & Risks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div className="bg-white border border-border p-4 rounded-interactive shadow-sm flex flex-col gap-2">
            <h5 className="font-heading font-bold text-[10px] text-text-primary uppercase tracking-wider border-b border-border pb-1">Top Strengths</h5>
            <ul className="text-xs text-text-secondary flex flex-col gap-1.5 mt-1 list-none pl-0">
              {displayAnalysis.reasons.map((r, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-success font-bold">&bull;</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-border p-4 rounded-interactive shadow-sm flex flex-col gap-2">
            <h5 className="font-heading font-bold text-[10px] text-text-primary uppercase tracking-wider border-b border-border pb-1">Potential Concerns</h5>
            <ul className="text-xs text-text-secondary flex flex-col gap-1.5 mt-1 list-none pl-0">
              {displayAnalysis.concerns.map((c, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-error font-bold">&bull;</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* AI Actionable recommendation */}
        <div className="bg-white border border-border rounded-interactive p-4 shadow-sm flex flex-col gap-1.5 mt-1">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">AI Copilot Recommendation Action</span>
          <p className="text-xs text-text-primary leading-relaxed font-semibold">
            {displayAnalysis.nextStep}
          </p>
          <p className="text-[10px] text-text-secondary leading-normal">
            {displayAnalysis.recommendation}
          </p>
        </div>

        {/* Email generator drafts */}
        <div className="bg-white border border-border rounded-interactive p-4 shadow-sm flex flex-col gap-3 mt-1">
          <div className="flex justify-between items-center pb-2 border-b border-border/50">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-primary uppercase tracking-wider">
              <Mail className="w-3.5 h-3.5 text-primary" />
              <span>Personalized Pitch Drafts</span>
            </div>
            
            {/* Tone selector */}
            <div className="flex border border-border rounded overflow-hidden text-[9px] font-medium bg-background">
              {(['professional', 'friendly', 'warm'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setEmailTone(t)}
                  className={`px-2 py-0.5 transition-colors cursor-pointer border-r border-border last:border-0 ${
                    emailTone === t 
                      ? 'bg-primary text-white font-semibold' 
                      : 'hover:bg-zinc-100 text-text-secondary'
                  }`}
                >
                  <span className="capitalize">{t}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <textarea
              readOnly
              value={activeEmailContent}
              rows={5}
              className="w-full bg-background border border-border rounded-interactive p-3 text-[11px] font-mono shadow-inner focus:outline-none text-text-secondary resize-none leading-relaxed"
            />
            
            {/* Action buttons */}
            <div className="absolute right-2.5 bottom-3.5 flex gap-2">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="bg-white hover:bg-zinc-50 border border-border p-1.5 rounded shadow-sm text-text-secondary hover:text-text-primary transition-colors cursor-pointer flex items-center justify-center"
                title="Copy Draft"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={handleMockSendEmail}
                className="bg-primary hover:bg-primary/95 text-white py-1 px-3 rounded text-[10px] font-semibold shadow-sm hover:shadow transition-all flex items-center gap-1 cursor-pointer"
              >
                {sentMockEmail ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Email Sent!</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-3 h-3" />
                    <span>Mock Send</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Engine Attribution Footer */}
        <div className="flex justify-between items-center text-[9px] text-text-secondary border-t border-border/50 pt-3 mt-1 font-mono">
          <span className="bg-background border border-border px-1.5 py-0.5 rounded text-[8px] uppercase font-bold text-text-secondary/80">
            {isFallback ? 'Fallback Engine' : 'Live Client API'}
          </span>
          <span>
            {isFallback ? 'Powered by Local Heuristics Engine v1.0.0' : 'Generated by Gemini 2.5 Flash'}
          </span>
        </div>
      </div>
    </div>
  );
};
