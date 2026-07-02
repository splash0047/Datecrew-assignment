import React, { useState } from 'react';
import { Eye, EyeOff, Shield, Lock } from 'lucide-react';

interface PIIFieldProps {
  value: string;
  sensitivityLevel?: 'high' | 'medium' | 'low';
  label?: string;
  alwaysReveal?: boolean;
}

export const PIIField: React.FC<PIIFieldProps> = ({
  value,
  sensitivityLevel = 'high',
  label,
  alwaysReveal = false
}) => {
  const [revealed, setRevealed] = useState(alwaysReveal);

  const maskValue = (val: string): string => {
    if (sensitivityLevel === 'high') {
      // Phone: +91 9XXXXX → +91 9XXXX XXXX → masked as +91 ••••• •••••
      if (val.startsWith('+91')) {
        return val.slice(0, 5) + '••••• •••••'.slice(val.length - 5);
      }
      // Email: a***@***.com
      if (val.includes('@')) {
        const [user, domain] = val.split('@');
        return user[0] + '***@***.' + domain.split('.').pop();
      }
      // Income: ₹XX LPA → ₹XX-XX LPA (range)
      if (val.includes('LPA')) {
        const num = parseInt(val);
        if (!isNaN(num)) {
          const low = Math.max(0, num - 5);
          return `₹${low}-${num + 5} LPA`;
        }
      }
      // Default: show first 2 chars + ***
      return val.slice(0, 2) + '••••••••';
    }
    if (sensitivityLevel === 'medium') {
      return val.slice(0, 3) + '•••' + val.slice(-2);
    }
    return val;
  };

  const sensitivityConfig = {
    high: { color: 'text-error', bg: 'bg-error/5', border: 'border-error/15', icon: Lock, label: 'Sensitive PII' },
    medium: { color: 'text-warning', bg: 'bg-warning/5', border: 'border-warning/15', icon: Shield, label: 'Personal Data' },
    low: { color: 'text-success', bg: 'bg-success/5', border: 'border-success/15', icon: Eye, label: 'Public Info' }
  };

  const config = sensitivityConfig[sensitivityLevel];

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <span className="text-text-secondary text-[10px]">{label}</span>
      )}
      <div className="flex items-center gap-2">
        <span className={`font-semibold text-text-primary text-xs font-mono ${!revealed && sensitivityLevel === 'high' ? 'tracking-wider' : ''}`}>
          {revealed || alwaysReveal ? value : maskValue(value)}
        </span>
        {!alwaysReveal && (
          <button
            onClick={() => setRevealed(!revealed)}
            className={`${config.color} hover:opacity-70 transition-opacity cursor-pointer bg-transparent border-none p-0`}
            title={revealed ? 'Hide' : 'Reveal'}
          >
            {revealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          </button>
        )}
      </div>
    </div>
  );
};

interface DataSensitivityBadgeProps {
  className?: string;
}

export const DataSensitivityBadge: React.FC<DataSensitivityBadgeProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-1.5 text-[9px] font-semibold px-2 py-1 rounded border border-error/15 bg-error/5 text-error ${className}`}>
      <Lock className="w-3 h-3" />
      <span>Confidential PII — Handle with care</span>
    </div>
  );
};

interface PrivacyNoticeProps {
  className?: string;
}

export const PrivacyNotice: React.FC<PrivacyNoticeProps> = ({ className = '' }) => {
  return (
    <div className={`bg-background-secondary/60 border border-border rounded-interactive p-3 flex items-start gap-2 text-[10px] text-text-secondary ${className}`}>
      <Shield className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
      <div className="flex flex-col gap-1">
        <span className="font-bold text-text-primary">Data Privacy Notice</span>
        <span>
          Phone numbers, income details, and family information are masked until a match is mutually confirmed. 
          All profile data is stored client-side only (LocalStorage) and is never transmitted to third parties. 
          Consent is implied upon profile submission to The Date Crew.
        </span>
      </div>
    </div>
  );
};
