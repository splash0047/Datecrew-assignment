import React, { useState } from 'react';
import type { Profile } from '../../types';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

interface ProfileDetailsProps {
  client: Profile;
  onCompleteField: (updatedClient: Profile) => void;
}

export const ProfileDetails: React.FC<ProfileDetailsProps> = ({ client, onCompleteField }) => {
  const [activeSubTab, setActiveSubTab] = useState<'personal' | 'career' | 'lifestyle'>('personal');
  const [isCompleting, setIsCompleting] = useState(false);

  // Visual completeness meter representation: e.g. ████████░░
  const getMeterString = (score: number) => {
    const filled = Math.round(score / 10);
    const empty = 10 - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  };

  // Mock complete missing fields action
  const handleCompleteFields = () => {
    setIsCompleting(true);
    setTimeout(() => {
      const updated: Profile = {
        ...client,
        profileCompleteness: 100,
        missingFields: [],
        income: client.income === 0 ? 15 : client.income // set some mock default if missing
      };
      onCompleteField(updated);
      setIsCompleting(false);
    }, 450);
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Verification Checklist Banner */}
      <div className="bg-white border border-border rounded-card p-4 shadow-sm flex flex-col gap-2">
        <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Verification Checklist</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-1.5">
          {Object.entries(client.verificationStatus).map(([key, val]) => (
            <div key={key} className="flex items-center gap-1.5 bg-background-secondary/40 px-2.5 py-1.5 rounded border border-border text-[10px]">
              <ShieldCheck className={`w-3.5 h-3.5 ${val === 'Verified' ? 'text-success' : 'text-warning'}`} />
              <span className="capitalize font-medium text-text-primary">{key}:</span>
              <span className={`font-semibold ${val === 'Verified' ? 'text-success' : 'text-warning'}`}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Completeness Gauge */}
      <div className="bg-white border border-border rounded-card p-4 shadow-sm flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-text-primary">Profile Completeness</span>
          <span className="font-mono font-bold text-accent">{client.profileCompleteness}%</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-mono text-xs tracking-wider text-accent leading-none">
            {getMeterString(client.profileCompleteness)}
          </span>
        </div>

        {client.missingFields.length > 0 ? (
          <div className="mt-3 bg-warning/5 border border-warning/10 rounded-interactive p-3 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-warning">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Missing Information Detrimental to Match Matching</span>
            </div>
            <ul className="list-disc pl-4 text-[10px] text-text-secondary flex flex-col gap-0.5">
              {client.missingFields.map((field, idx) => (
                <li key={idx} className="capitalize">{field}</li>
              ))}
            </ul>
            <button
              onClick={handleCompleteFields}
              disabled={isCompleting}
              className="mt-1 bg-white hover:bg-zinc-50 border border-border text-text-primary text-[10px] font-semibold py-1.5 px-3 rounded-interactive shadow-sm w-fit self-end cursor-pointer disabled:opacity-50"
            >
              {isCompleting ? 'Completing...' : 'Auto-Complete Fields'}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 bg-success/5 border border-success/15 rounded-interactive p-2.5 text-[10px] text-success font-semibold mt-2.5">
            <ShieldCheck className="w-4 h-4 text-success" />
            <span>Profile details are 100% complete and verified. Ready for premium matching.</span>
          </div>
        )}
      </div>

      {/* Progressive Disclosure Sub-Tabs */}
      <div className="flex border-b border-border text-xs gap-4 mt-2">
        <button
          onClick={() => setActiveSubTab('personal')}
          className={`pb-2 font-heading font-semibold border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'personal' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          Personal & Family
        </button>
        <button
          onClick={() => setActiveSubTab('career')}
          className={`pb-2 font-heading font-semibold border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'career' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          Career & Income
        </button>
        <button
          onClick={() => setActiveSubTab('lifestyle')}
          className={`pb-2 font-heading font-semibold border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'lifestyle' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          Lifestyle & Habits
        </button>
      </div>

      {/* Tab Panel Contents */}
      <div className="bg-white border border-border rounded-card p-5 shadow-sm min-h-[220px]">
        {activeSubTab === 'personal' && (
          <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs">
            <div>
              <span className="text-text-secondary block">Date of Birth</span>
              <span className="font-semibold text-text-primary mt-0.5 block">{client.dob} ({client.age} years)</span>
            </div>
            <div>
              <span className="text-text-secondary block">Height</span>
              <span className="font-semibold text-text-primary mt-0.5 block">{client.height} ({client.heightCm} cm)</span>
            </div>
            <div>
              <span className="text-text-secondary block">Religion / Caste</span>
              <span className="font-semibold text-text-primary mt-0.5 block">{client.religion} / {client.caste}</span>
            </div>
            <div>
              <span className="text-text-secondary block">Preferred Family Type</span>
              <span className="font-semibold text-text-primary mt-0.5 block">{client.preferredFamilyType} Family</span>
            </div>
            <div>
              <span className="text-text-secondary block">Languages Known</span>
              <span className="font-semibold text-text-primary mt-0.5 block">{client.languages.join(', ')}</span>
            </div>
            <div>
              <span className="text-text-secondary block">Siblings</span>
              <span className="font-semibold text-text-primary mt-0.5 block">{client.siblings}</span>
            </div>
            <div className="col-span-2">
              <span className="text-text-secondary block">Hobbies & Hobbies Interests</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {client.hobbies.map((h, i) => (
                  <span key={i} className="bg-background-secondary border border-border px-2 py-0.5 rounded text-[10px] text-text-primary">
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'career' && (
          <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs">
            <div>
              <span className="text-text-secondary block">Designation</span>
              <span className="font-semibold text-text-primary mt-0.5 block">{client.designation}</span>
            </div>
            <div>
              <span className="text-text-secondary block">Company</span>
              <span className="font-semibold text-text-primary mt-0.5 block">{client.company}</span>
            </div>
            <div>
              <span className="text-text-secondary block">Undergraduate College</span>
              <span className="font-semibold text-text-primary mt-0.5 block">{client.college}</span>
            </div>
            <div>
              <span className="text-text-secondary block">Degree</span>
              <span className="font-semibold text-text-primary mt-0.5 block">{client.degree}</span>
            </div>
            <div>
              <span className="text-text-secondary block">Annual Income</span>
              <span className="font-semibold text-primary font-mono text-sm mt-0.5 block">{client.income} LPA</span>
            </div>
            <div>
              <span className="text-text-secondary block">Marital Status</span>
              <span className="font-semibold text-text-primary mt-0.5 block">{client.maritalStatus}</span>
            </div>
          </div>
        )}

        {activeSubTab === 'lifestyle' && (
          <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs">
            <div>
              <span className="text-text-secondary block">Dietary Habit</span>
              <span className="font-semibold text-text-primary mt-0.5 block">{client.diet}</span>
            </div>
            <div>
              <span className="text-text-secondary block">Views on Children</span>
              <span className="font-semibold text-text-primary mt-0.5 block">{client.wantKids}</span>
            </div>
            <div>
              <span className="text-text-secondary block">Open to Relocation</span>
              <span className="font-semibold text-text-primary mt-0.5 block">{client.openToRelocate}</span>
            </div>
            <div>
              <span className="text-text-secondary block">Open to Pets</span>
              <span className="font-semibold text-text-primary mt-0.5 block">{client.openToPets}</span>
            </div>
            <div>
              <span className="text-text-secondary block">Smoking / Drinking</span>
              <span className="font-semibold text-text-primary mt-0.5 block">
                Smoking: {client.smoking} &bull; Drinking: {client.drinking}
              </span>
            </div>
            <div>
              <span className="text-text-secondary block">Work Style</span>
              <span className="font-semibold text-text-primary mt-0.5 block">{client.workStyle}</span>
            </div>
            <div>
              <span className="text-text-secondary block">Weekend Preference</span>
              <span className="font-semibold text-text-primary mt-0.5 block">{client.weekendPreference}</span>
            </div>
            <div>
              <span className="text-text-secondary block">Fitness Level</span>
              <span className="font-semibold text-text-primary mt-0.5 block">{client.fitnessLevel}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
