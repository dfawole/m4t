import React from 'react';
import { cn } from '@/lib/utils';
import { 
  BookOpen, 
  GraduationCap, 
  Brain, 
  Lightbulb, 
  Sigma, 
  Trophy,
  Atom
} from 'lucide-react';

type LoadingAnimationType = 'book' | 'grad-cap' | 'brain' | 'lightbulb' | 'sigma' | 'trophy' | 'atom' | 'dots';
type LoadingAnimationSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type LoadingAnimationColor = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'destructive' | 'muted';

interface LoadingAnimationProps {
  type?: LoadingAnimationType;
  size?: LoadingAnimationSize;
  color?: LoadingAnimationColor;
  text?: string;
  className?: string;
}

const iconMap = {
  'book': BookOpen,
  'grad-cap': GraduationCap,
  'brain': Brain,
  'lightbulb': Lightbulb,
  'sigma': Sigma,
  'trophy': Trophy,
  'atom': Atom
};

const sizeMap = {
  'xs': 'w-4 h-4',
  'sm': 'w-6 h-6',
  'md': 'w-8 h-8',
  'lg': 'w-12 h-12',
  'xl': 'w-16 h-16'
};

const colorMap = {
  'primary': 'text-primary',
  'secondary': 'text-secondary',
  'accent': 'text-accent',
  'success': 'text-success',
  'warning': 'text-warning',
  'destructive': 'text-destructive',
  'muted': 'text-muted-foreground'
};

export function LoadingAnimation({ 
  type = 'book', 
  size = 'md', 
  color = 'primary',
  text,
  className
}: LoadingAnimationProps) {
  
  // For dots animation
  if (type === 'dots') {
    return (
      <div className={cn('flex flex-col items-center justify-center', className)}>
        <div className="flex space-x-2">
          <div className={cn(
            'rounded-full animate-bounce',
            sizeMap[size === 'xs' || size === 'sm' ? 'xs' : 'sm'],
            colorMap[color]
          )} style={{ animationDelay: '0ms', backgroundColor: 'currentColor' }}></div>
          <div className={cn(
            'rounded-full animate-bounce',
            sizeMap[size === 'xs' || size === 'sm' ? 'xs' : 'sm'],
            colorMap[color]
          )} style={{ animationDelay: '150ms', backgroundColor: 'currentColor' }}></div>
          <div className={cn(
            'rounded-full animate-bounce',
            sizeMap[size === 'xs' || size === 'sm' ? 'xs' : 'sm'],
            colorMap[color]
          )} style={{ animationDelay: '300ms', backgroundColor: 'currentColor' }}></div>
        </div>
        {text && <p className={cn('mt-2 text-sm font-medium', colorMap[color])}>{text}</p>}
      </div>
    );
  }
  
  // For icon animations
  const IconComponent = iconMap[type];
  
  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div className="relative">
        <IconComponent className={cn(
          'animate-pulse transition-all',
          sizeMap[size],
          colorMap[color]
        )} />
        <div className={cn(
          'absolute inset-0 rounded-full border-t-2 border-b-2 border-transparent animate-spin',
          sizeMap[size],
          colorMap[color]
        )} style={{ borderTopColor: 'currentColor', borderBottomColor: 'currentColor' }} />
      </div>
      {text && <p className={cn('mt-2 text-sm font-medium', colorMap[color])}>{text}</p>}
    </div>
  );
}

// Compound components for specific contexts
export function ContentLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <LoadingAnimation type="book" size="xl" text="Loading content..." />
    </div>
  );
}

export function CourseLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <LoadingAnimation type="grad-cap" size="xl" text="Preparing your course..." />
    </div>
  );
}

export function QuizLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <LoadingAnimation type="brain" size="xl" text="Preparing your quiz..." />
    </div>
  );
}

export function AchievementLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <LoadingAnimation type="trophy" size="xl" text="Loading achievements..." />
    </div>
  );
}

export function FullPageLoading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <LoadingAnimation type="atom" size="xl" color="primary" />
      <p className="mt-4 text-lg font-medium animate-pulse">Loading your learning experience...</p>
    </div>
  );
}

export function ButtonLoading() {
  return <LoadingAnimation type="dots" size="sm" className="mx-auto" />;
}