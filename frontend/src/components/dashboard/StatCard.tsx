import { cn } from '@/utils/cn';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  className?: string;
}

export default function StatCard({ label, value, icon, trend, className }: StatCardProps) {
  return (
    <div className={cn("premium-card flex flex-col gap-4", className)}>
      <div className="flex justify-between items-start">
        <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-primary">
          {icon}
        </div>
        {trend && (
          <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        <h3 className="text-2xl font-bold font-outfit mt-1">{value}</h3>
      </div>
    </div>
  );
}
