import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  variant?: 'default' | 'primary' | 'accent';
}

export const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
}: StatsCardProps) => {
  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-md card-hover">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p
            className={cn(
              'text-3xl font-bold font-display',
              variant === 'primary' && 'text-primary',
              variant === 'accent' && 'text-accent',
              variant === 'default' && 'text-foreground'
            )}
          >
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div
              className={cn(
                'inline-flex items-center gap-1 text-sm font-medium',
                trend.positive ? 'text-success' : 'text-destructive'
              )}
            >
              {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        <div
          className={cn(
            'p-3 rounded-xl',
            variant === 'primary' && 'bg-primary/10 text-primary',
            variant === 'accent' && 'bg-accent/10 text-accent',
            variant === 'default' && 'bg-muted text-muted-foreground'
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
