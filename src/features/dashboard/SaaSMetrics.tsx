import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Award, Zap, Hourglass } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number;
  suffix?: string;
  trend: string;
  isPositive: boolean;
  context: string;
  icon: React.ReactNode;
}

const AnimatedCounter: React.FC<{ target: number; suffix?: string }> = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = target;
    if (start === end) return;

    const totalDuration = 800; // ms
    const incrementTime = Math.max(Math.floor(totalDuration / end), 15);
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [target]);

  return <span className="font-mono">{count}{suffix}</span>;
};

const MetricCard: React.FC<MetricCardProps> = ({ title, value, suffix = '', trend, isPositive, context, icon }) => {
  return (
    <div className="bg-white border border-border rounded-card p-5 shadow-sm hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between min-h-[160px]">
      <div className="flex justify-between items-start">
        <span className="text-xs font-semibold text-text-secondary">{title}</span>
        <div className="w-7 h-7 bg-background-secondary rounded-lg flex items-center justify-center text-text-secondary border border-border">
          {icon}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-heading font-extrabold text-3xl text-text-primary tracking-tight">
          <AnimatedCounter target={value} suffix={suffix} />
        </h3>
        
        <div className="flex items-center gap-1.5 mt-2">
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${
            isPositive ? 'bg-success/5 text-success border border-success/10' : 'bg-warning/5 text-warning border border-warning/10'
          }`}>
            <ArrowUpRight className="w-2.5 h-2.5" />
            <span>{trend}</span>
          </span>
          <span className="text-[10px] text-text-secondary">Last 30 Days</span>
        </div>
      </div>

      <div className="border-t border-border mt-4 pt-3 flex items-center gap-1 text-[10px] text-text-secondary">
        <span className="font-semibold text-text-primary">{context}</span>
      </div>
    </div>
  );
};

export const SaaSMetrics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
      <MetricCard
        title="Match Acceptance Rate"
        value={76}
        suffix="%"
        trend="↑ 9%"
        isPositive={true}
        context="Best performing segment: 28–32 years"
        icon={<Award className="w-4 h-4 text-primary" />}
      />
      <MetricCard
        title="Weekly Introductions"
        value={24}
        trend="↑ 12%"
        isPositive={true}
        context="Avg decision response time: 2.1 days"
        icon={<Hourglass className="w-4 h-4 text-accent" />}
      />
      <MetricCard
        title="Average Compatibility"
        value={86}
        suffix="%"
        trend="↑ 2%"
        isPositive={true}
        context="Top matching factor: Shared Career Stage"
        icon={<Zap className="w-4 h-4 text-success" />}
      />
    </div>
  );
};
