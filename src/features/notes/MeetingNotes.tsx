import React, { useState } from 'react';
import type { Profile } from '../../types';
import { useNoteStore } from '../../stores/noteStore';
import { useMatchStore } from '../../stores/matchStore';
import { MessageSquare, Calendar, ShieldCheck, Tag, Plus, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface MeetingNotesProps {
  client: Profile;
}

// Zod Schema validation
const noteFormSchema = z.object({
  summary: z.string().min(10, { message: 'Summary details must be at least 10 characters long.' }),
  outcome: z.enum(['Positive', 'Neutral', 'Concern']),
  nextAction: z.string().min(3, { message: 'Action plan must be at least 3 characters long.' }),
  mood: z.enum(['😊', '😐', '😟']),
  priority: z.enum(['High', 'Medium', 'Low']),
  reminderDate: z.string().optional().or(z.literal('')),
});

type NoteFormValues = z.infer<typeof noteFormSchema>;

export const MeetingNotes: React.FC<MeetingNotesProps> = ({ client }) => {
  const { addNote } = useNoteStore();
  const { addActivityLog } = useMatchStore();

  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const availableTags = ['Family', 'Career', 'Parents', 'Relocation', 'Preferences', 'Horoscope', 'Diet'];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      summary: '',
      outcome: 'Positive',
      nextAction: '',
      mood: '😊',
      priority: 'Medium',
      reminderDate: ''
    }
  });

  // Watch current selections for mood and priority styles
  const currentMood = watch('mood');
  const currentPriority = watch('priority');

  const toggleTag = (tag: string) => {
    if (activeTags.includes(tag)) {
      setActiveTags(activeTags.filter(t => t !== tag));
    } else {
      setActiveTags([...activeTags, tag]);
    }
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    const tag = newTagInput.trim();
    if (tag && !activeTags.includes(tag)) {
      setActiveTags([...activeTags, tag]);
      setNewTagInput('');
    }
  };

  const onSubmit = (data: NoteFormValues) => {
    setSaving(true);
    setTimeout(() => {
      addNote({
        clientId: client.id,
        outcome: data.outcome,
        nextAction: data.nextAction,
        mood: data.mood,
        priority: data.priority,
        reminderDate: data.reminderDate || undefined,
        summary: data.summary.trim(),
        tags: activeTags
      });

      // Add to main operational log
      addActivityLog(
        client.id,
        client.fullName,
        'note_added',
        `Meeting note logged: ${data.outcome} outcome, mood ${data.mood}.`
      );

      // Reset form states
      reset();
      setActiveTags([]);
      setSuccess(true);
      setSaving(false);

      setTimeout(() => setSuccess(false), 2500);
    }, 300);
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-text-primary">Add New Meeting Note</span>
        <span className="text-[10px] text-text-secondary">Consultation Audit</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-border rounded-card p-5 shadow-sm flex flex-col gap-4">
        {success && (
          <div className="bg-success/5 border border-success/15 text-success rounded-interactive p-3 flex gap-2 items-center text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Note added successfully! Posted to Relationship Timeline.</span>
          </div>
        )}

        {/* Note Text area */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-text-secondary">Summary & Call Details</label>
          <textarea
            {...register('summary')}
            placeholder="Document preferences expressed, parent conversation points, and other match considerations..."
            rows={4}
            className={`w-full bg-background border rounded-interactive p-3 text-xs shadow-sm focus:outline-none focus:ring-1 text-text-primary resize-none placeholder:text-text-secondary/70 ${
              errors.summary ? 'border-error focus:ring-error focus:border-error' : 'border-border focus:ring-primary focus:border-primary'
            }`}
          />
          {errors.summary && (
            <span className="text-[10px] text-error flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.summary.message}
            </span>
          )}
        </div>

        {/* Grid selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary">Meeting Outcome</label>
            <select
              {...register('outcome')}
              className="bg-background border border-border px-3 py-2 rounded-interactive text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="Positive">😊 Positive / Highly Interested</option>
              <option value="Neutral">😐 Neutral / Awaiting Feedback</option>
              <option value="Concern">😟 Concern / Preferences Shift</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary">Client Mood</label>
            <div className="flex gap-2">
              {(['😊', '😐', '😟'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setValue('mood', m)}
                  className={`w-9 h-9 rounded-interactive border flex items-center justify-center text-sm transition-all cursor-pointer ${
                    currentMood === m 
                      ? 'bg-white border-primary shadow-sm scale-105' 
                      : 'bg-background border-border hover:border-text-secondary'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary">Next Action Plan</label>
            <input
              type="text"
              {...register('nextAction')}
              placeholder="e.g. Schedule Call with Father, Verify Assets..."
              className={`w-full bg-background border rounded-interactive px-3 py-2 text-xs shadow-sm focus:outline-none focus:ring-1 text-text-primary ${
                errors.nextAction ? 'border-error focus:ring-error focus:border-error' : 'border-border focus:ring-primary focus:border-primary'
              }`}
            />
            {errors.nextAction && (
              <span className="text-[10px] text-error flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.nextAction.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary">Follow-up Reminder Date</label>
            <div className="relative">
              <Calendar className="w-3.5 h-3.5 text-text-secondary absolute left-3 top-2.5" />
              <input
                type="date"
                {...register('reminderDate')}
                className="w-full bg-background border border-border rounded-interactive pl-9 pr-3 py-2 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-text-primary"
              />
            </div>
          </div>
        </div>

        {/* Priority Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-text-secondary">Priority Level</label>
          <div className="flex gap-2 text-xs">
            {(['Low', 'Medium', 'High'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setValue('priority', p)}
                className={`px-3 py-1.5 rounded-interactive border transition-all cursor-pointer font-medium ${
                  currentPriority === p 
                    ? p === 'High' 
                      ? 'bg-error/5 border-error text-error shadow-sm font-semibold' 
                      : p === 'Medium' 
                        ? 'bg-warning/5 border-warning text-warning shadow-sm font-semibold'
                        : 'bg-zinc-100 border-zinc-400 text-zinc-800 shadow-sm font-semibold'
                    : 'bg-background border-border text-text-secondary hover:border-text-secondary'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Tags Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" />
            <span>Tags & Topics</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {availableTags.map((tag) => {
              const selected = activeTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-colors cursor-pointer ${
                    selected 
                      ? 'bg-primary/5 border-primary text-primary' 
                      : 'bg-background border-border text-text-secondary hover:border-text-secondary'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
          <div className="flex gap-2 items-center mt-1">
            <input
              type="text"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              placeholder="Add custom tag..."
              className="bg-background border border-border rounded-interactive px-2.5 py-1 text-[10px] focus:outline-none focus:border-primary text-text-primary"
            />
            <button
              type="button"
              onClick={handleAddCustomTag}
              className="bg-zinc-100 hover:bg-zinc-200 border border-border p-1 rounded-interactive cursor-pointer flex items-center justify-center"
            >
              <Plus className="w-3 h-3 text-text-primary" />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-primary hover:bg-primary/95 text-white py-2.5 rounded-interactive font-heading font-semibold shadow-sm hover:shadow transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 text-xs mt-3 flex items-center justify-center gap-2 cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          {saving ? 'Saving Note...' : 'Log Meeting Note'}
        </button>
      </form>
    </div>
  );
};
