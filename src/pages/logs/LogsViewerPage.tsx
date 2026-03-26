import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight, RefreshCw, Terminal } from 'lucide-react';
import { api } from '@/api/client';
import { useLogs } from '@/hooks/useLogs';
import type { Deployment } from '@/types';
import { LogsViewer } from '@/components/features/logs/LogsViewer';
import { Spinner } from '@/components/ui/Spinner';

export default function LogsViewerPage() {
  const { id: suffix } = useParams();
  const navigate = useNavigate();

  const [deployment, setDeployment] = useState<Deployment | null>(null);
  const [loadingDep, setLoadingDep] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!suffix) return;
    let cancelled = false;

    const fetchDeployment = async () => {
      setLoadingDep(true);
      setError(null);
      try {
        const data = await api.inspectByName(suffix);
        if (!cancelled) setDeployment(data);
      } catch (err: unknown) {
        if (!cancelled) setError((err as Error).message || 'Failed to load deployment.');
      } finally {
        if (!cancelled) setLoadingDep(false);
      }
    };

    void fetchDeployment();

    return () => {
      cancelled = true;
    };
  }, [suffix]);

  const {
    logs,
    loading: loadingLogs,
    error: logsError,
    refetch,
  } = useLogs(suffix ?? '', deployment?.prefix ?? '');

  if (loadingDep) {
    return (
      <div className="grow flex items-center justify-center min-h-[calc(100vh-80px)] bg-slate-50/50">
        <div className="flex items-center gap-3 text-slate-500">
          <Spinner size={24} />
          <span className="text-sm font-medium">Loading deployment...</span>
        </div>
      </div>
    );
  }

  if (error || !deployment) {
    return (
      <div className="grow flex items-center justify-center bg-slate-50/50 p-6">
        <div className="flex w-full max-w-md flex-col items-center gap-4 border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-black uppercase tracking-tight text-slate-800">
            Deployment Not Found
          </h2>
          <p className="text-sm font-medium text-gray-500">{error}</p>
          <button
            onClick={() => navigate('/deployments')}
            className="mt-4 flex items-center gap-2 bg-slate-800 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-slate-700"
          >
            <ArrowLeft size={16} /> Back to Hub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-start justify-center bg-slate-50/50 p-4 pt-6 animate-in fade-in duration-300 sm:p-8 sm:pt-10">
      <div className="flex h-[calc(100vh-140px)] min-h-125 w-full max-w-6xl flex-col overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm">
        <div className="shrink-0 flex items-center justify-between border-b border-gray-100 bg-gray-50/60 px-4 py-2.5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/deployments/${deployment.suffix}`)}
              className="rounded-sm border border-gray-200 bg-white p-1.5 text-slate-600 transition-all hover:bg-gray-100 hover:text-slate-900"
              title="Back to Details"
            >
              <ArrowLeft size={14} strokeWidth={2.5} />
            </button>

            <div className="h-5 w-px bg-gray-200" />

            <div className="flex items-center gap-2">
              <Terminal size={14} className="shrink-0 text-slate-500" strokeWidth={2.5} />
              <h1 className="text-sm font-bold leading-none tracking-tight text-slate-800">
                Build Logs
              </h1>
            </div>

            <div className="ml-1 hidden items-center gap-1 font-mono text-[11px] text-slate-400 sm:flex">
              <ChevronRight size={11} className="text-gray-300" />
              <span className="text-slate-400">{deployment.prefix}</span>
              <ChevronRight size={11} className="text-gray-300" />
              <span className="font-bold text-slate-600">{deployment.suffix}</span>
            </div>
          </div>

          <button
            onClick={refetch}
            disabled={loadingLogs}
            className="flex items-center gap-1.5 rounded-sm border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 transition-all hover:bg-gray-50 hover:text-slate-900 disabled:opacity-50"
            title="Refresh logs"
          >
            <RefreshCw size={12} className={loadingLogs ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        <div className="relative flex-1 overflow-hidden">
          {loadingLogs && logs.length === 0 ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/90 backdrop-blur-[2px]">
              <div className="flex items-center gap-3 rounded border border-slate-700 bg-slate-900 px-6 py-3 font-mono text-sm text-slate-300">
                <Spinner size={16} />
                <span>Fetching logs...</span>
              </div>
            </div>
          ) : null}

          <LogsViewer logs={logs} error={logsError} className="h-full max-h-full border-none" />
        </div>
      </div>
    </div>
  );
}
