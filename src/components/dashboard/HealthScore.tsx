import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HealthScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export function HealthScore({ score, size = 'md' }: HealthScoreProps) {
  const sizeConfig = {
    sm: { outer: 80, inner: 60, stroke: 6, text: 'text-lg' },
    md: { outer: 120, inner: 100, stroke: 8, text: 'text-2xl' },
    lg: { outer: 160, inner: 140, stroke: 10, text: 'text-3xl' },
  };

  const config = sizeConfig[size];
  const circumference = 2 * Math.PI * (config.inner / 2);
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return 'stroke-success';
    if (score >= 50) return 'stroke-warning';
    return 'stroke-destructive';
  };

  const getLabel = () => {
    if (score >= 80) return { text: 'Excellent', color: 'text-success' };
    if (score >= 50) return { text: 'Fair', color: 'text-warning' };
    return { text: 'At Risk', color: 'text-destructive' };
  };

  const label = getLabel();

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg
          width={config.outer}
          height={config.outer}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={config.outer / 2}
            cy={config.outer / 2}
            r={config.inner / 2}
            fill="none"
            className="stroke-secondary"
            strokeWidth={config.stroke}
          />
          {/* Progress circle */}
          <motion.circle
            cx={config.outer / 2}
            cy={config.outer / 2}
            r={config.inner / 2}
            fill="none"
            className={getColor()}
            strokeWidth={config.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            className={cn("font-bold", config.text)}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
        </div>
      </div>
      <div className="text-center">
        <p className={cn("font-medium", label.color)}>{label.text}</p>
        <p className="text-xs text-muted-foreground">Permission Health</p>
      </div>
    </div>
  );
}
