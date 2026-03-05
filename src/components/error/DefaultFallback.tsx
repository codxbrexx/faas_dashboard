import { RefreshCw, AlertTriangle } from 'lucide-react';

interface DefaultFallbackProps {
  error: Error;
  reset: () => void;
}

export function DefaultFallback({ error, reset }: DefaultFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-6 p-8 text-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50">
        <AlertTriangle size={32} className="text-red-500" />
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-slate-800">Something went wrong</h2>
        <p className="text-sm text-slate-500 max-w-sm">
          An unexpected error occurred. The error has been logged. You can try reloading this
          section or refreshing the page.
        </p>
      </div>

      {/* Error detail (only in dev) */}
      {import.meta.env.DEV && (
        <pre className="text-left text-xs bg-slate-100 text-red-600 rounded p-4 max-w-lg overflow-auto whitespace-pre-wrap border border-red-200">
          {error.message}
          {error.stack ? `\n\n${error.stack}` : ''}
        </pre>
      )}

      <button
        onClick={reset}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        <RefreshCw size={14} />
        Try again
      </button>
    </div>
  );
}
