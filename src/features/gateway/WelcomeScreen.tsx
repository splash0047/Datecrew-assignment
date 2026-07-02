import React from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

interface WelcomeScreenProps {
  onEnter: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter }) => {
  return (
    <div className="warm-paper-bg min-h-screen flex flex-col justify-between p-8 relative overflow-hidden">
      <div className="radial-glow" />
      
      {/* Top row */}
      <div className="flex justify-between items-center max-w-6xl w-full mx-auto z-10">
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-6 h-6 text-primary" />
          <span className="font-heading font-bold text-lg text-text-primary tracking-tight">The Date Crew</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-text-secondary bg-white px-3 py-1.5 rounded-full border border-border shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-success" />
          <span>Internal Matchmaker Tool</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-xl w-full mx-auto text-center flex flex-col items-center gap-8 z-10 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-border shadow-sm mb-2">
            <Sparkles className="w-7 h-7 text-accent" />
          </div>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-text-primary tracking-tight leading-tight">
            The Date Crew<br />
            <span className="text-primary">Matchmaker Dashboard</span>
          </h1>
          <p className="text-text-secondary text-base leading-relaxed max-w-md">
            An elegant, copilot-assisted internal CRM designed to streamline customer onboarding, compatibility assessment, and match delivery.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
        >
          <button
            onClick={onEnter}
            className="bg-primary hover:bg-primary/95 text-white px-8 py-3.5 rounded-interactive font-heading font-semibold shadow-sm hover:shadow transition-all hover:scale-[1.02] active:scale-[0.98] duration-150 text-sm whitespace-nowrap"
          >
            Launch Demo Login
          </button>
          
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white hover:bg-background-secondary text-text-primary border border-border px-8 py-3.5 rounded-interactive font-heading font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] duration-150 text-sm flex items-center justify-center gap-2"
          >
            <span>GitHub Repository</span>
          </a>
        </motion.div>

        {/* Documentation Quick Insights */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-2 gap-4 w-full border-t border-border pt-8 mt-4"
        >
          <div className="text-left p-4 bg-white rounded-card border border-border">
            <h4 className="font-heading font-bold text-text-primary text-xs flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              AI Copilot Panel
            </h4>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              Dynamically analyzes strengths, risks, and next-step actions using cached Gemini templates.
            </p>
          </div>
          <div className="text-left p-4 bg-white rounded-card border border-border">
            <h4 className="font-heading font-bold text-text-primary text-xs flex items-center gap-1.5 mb-1">
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              CRM Logs & Timeline
            </h4>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              Consolidated Relationship Timeline tracks past decisions, outcome ratings, and notes.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="text-center z-10 pt-8">
        <p className="text-[11px] text-text-secondary tracking-wide">
          DESIGNED BY <span className="font-semibold text-text-primary">PINAK CHIMURKAR</span> &bull; DATECREW INTERNAL SYSTEM &bull; v1.0.0
        </p>
      </div>
    </div>
  );
};
