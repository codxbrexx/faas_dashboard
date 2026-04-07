import { clsx } from 'clsx';
import { Spinner } from './Spinner';

interface LoadingStateProps {
  variant?: 'page' | 'inline' | 'overlay' | 'skeleton';
  message?: string;
  spinnerSize?: number;
  className?: string;
  skeletonLines?: number;
}

// Page-level full-screen loading
// Use for: Initial page loads (> 1s expected)

export function PageLoading({ message = 'Loading…', spinnerSize = 28, className }: LoadingStateProps) {
  return (
    <div className={clsx('flex items-center justify-center min-h-screen bg-white', className)}>
      <div className="flex flex-col items-center gap-4">
        <Spinner size={spinnerSize} className="text-gray-400" />
        {message && <p className="text-sm font-medium text-gray-500">{message}</p>}
      </div>
    </div>
  );
}

//  Inline loading indicator
//  Use for: Quick operations or lists (300ms - 1s)
 
export function InlineLoading({ message = 'Loading…', spinnerSize = 14, className }: LoadingStateProps) {
  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <Spinner size={spinnerSize} className="text-gray-400" />
      {message && <span className="text-xs font-medium text-gray-500">{message}</span>}
    </div>
  );
}


//  Loading overlay for blocking content
//  Use for: Syncing data while content is visible (1-3s)
export function LoadingOverlay({ message = 'Syncing…', spinnerSize = 16, className }: LoadingStateProps) {
  return (
    <div className={clsx(
      'absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50',
      className
    )}>
      <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center gap-3 shadow-lg">
        <Spinner size={spinnerSize} className="text-gray-400" />
        {message && <span className="text-sm font-medium text-gray-600">{message}</span>}
      </div>
    </div>
  );
}

//  Skeleton loader placeholder
//  Use for: Content-specific loading (300ms - 1s)
export function SkeletonLoader({ skeletonLines = 3, className }: LoadingStateProps) {
  return (
    <div className={clsx('space-y-3', className)}>
      {Array.from({ length: skeletonLines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 rounded animate-pulse"
          style={{
            width: i === skeletonLines - 1 ? '80%' : '100%',
            animation: `pulse ${1.5 + i * 0.1}s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
          }}
        />
      ))}
    </div>
  );
}


//  Minimal inline spinner (no text)
//  Use for: Button states or very compact spaces
export function CompactLoading({ spinnerSize = 12, className }: LoadingStateProps) {
  return <Spinner size={spinnerSize} className={clsx('text-gray-400', className)} />;
}
