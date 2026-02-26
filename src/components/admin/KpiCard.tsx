'use client';

import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  icon: LucideIcon;
}

export function KpiCard({ title, value, change, trend, icon: Icon }: KpiCardProps) {
  return (
    <div className="kpi-card animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold text-foreground mt-1">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      {change && (
        <div className="mt-3 flex items-center gap-1.5">
          {trend === 'up' ? (
            <TrendingUp className="h-4 w-4 text-[hsl(152,60%,40%)]" />
          ) : (
            <TrendingDown className="h-4 w-4 text-[hsl(0,72%,51%)]" />
          )}
          <span className={`text-xs font-medium ${trend === 'up' ? 'text-[hsl(152,60%,40%)]' : 'text-[hsl(0,72%,51%)]'}`}>
            {change}
          </span>
          <span className="text-xs text-muted-foreground">vs last period</span>
        </div>
      )}
    </div>
  );
}

export default KpiCard;
