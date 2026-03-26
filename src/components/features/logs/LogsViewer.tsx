import { useEffect, useRef, useState, useCallback } from 'react';
import { clsx } from 'clsx';
import { Copy, Check, ArrowDown, WrapText, AlignLeft } from 'lucide-react';
import type { LogEntry } from '@/types';

interface LogsViewerProps {
  logs: LogEntry[];
  className?: string;
  error?: string | null;
}

type LevelFilter = LogEntry['level'] | 'all';

const LEVEL_BADGE: Record<
  LogEntry['level'],
  { label: string; cls: string; textCls: string; filterCls: string }
> = {
  info: {
    label: 'INFO',
    cls: 'text-cyan-200 border-cyan-500/20',
    textCls: 'text-slate-300',
    filterCls: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
  },
  success: {
    label: 'OK',
    cls: 'text-emerald-200 border-emerald-500/20',
    textCls: 'text-slate-300',
    filterCls: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
  },
  warn: {
    label: 'WARN',
    cls: 'text-amber-200 border-amber-500/20',
    textCls: 'text-slate-300',
    filterCls: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
  },
  error: {
    label: 'ERR',
    cls: 'text-red-200 border-red-500/20',
    textCls: 'text-slate-300',
    filterCls: 'border-red-500/40 text-red-400 bg-red-500/15',
  },
  http: {
    label: 'HTTP',
    cls: 'text-violet-200 border-violet-500/20',
    textCls: 'text-slate-300',
    filterCls: 'border-violet-500/40 text-violet-400 bg-violet-500/10',
  },
};

const ALL_LEVELS: LogEntry['level'][] = ['info', 'success', 'warn', 'error', 'http'];

export function LogsViewer({ logs, className, error }: LogsViewerProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all');
  const [copied, setCopied] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [wrap, setWrap] = useState(false);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(distFromBottom > 180);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distFromBottom < 180) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const visible = logs.filter(entry => {
    if (levelFilter !== 'all' && entry.level !== levelFilter) return false;
    return true;
  });

  const counts = logs.reduce<Record<string, number>>((acc, entry) => {
    acc[entry.level] = (acc[entry.level] ?? 0) + 1;
    return acc;
  }, {});

  const handleCopy = () => {
    const text = visible
      .map(entry => `${entry.timestamp || '--:--:--'} [${entry.level.toUpperCase()}] ${entry.message}`)
      .join('\n');
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (logs.length === 0) {
    return (
      <div
        className={clsx(
          'flex h-full w-full flex-col items-center justify-center gap-3 bg-slate-950 text-gray-300',
          className,
        )}
      >
        {error ? (
          <>
            <div className="flex items-center gap-2 rounded border border-red-800/40 bg-red-950/40 px-4 py-2.5 font-mono text-sm text-red-400">
              <span className="rounded border border-red-700 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                ERR
              </span>
              <span>{error}</span>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">
              Retrying automatically...
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 font-mono text-sm">
              <span className="inline-block h-5 w-2 animate-pulse bg-slate-600" />
              <span className="text-slate-500">Waiting for log output...</span>
            </div>
            <div className="mt-1 text-[10px] font-bold uppercase tracking-widest opacity-30">
              Logs will appear here once available
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={clsx('flex h-full w-full flex-col rounded bg-slate-800', className)}>
      <div className="shrink-0 flex items-center gap-2 border-b border-slate-700 bg-slate-900 px-3 py-1.5">
        <div className="mx-1 h-3.5 w-px shrink-0 bg-slate-800" />

        <div className="flex flex-1 items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setLevelFilter('all')}
            className={clsx(
              'shrink-0 rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors',
              levelFilter === 'all'
                ? 'border-slate-500 bg-slate-700/60 text-slate-200'
                : 'border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-400',
            )}
          >
            All <span className="ml-0.5 opacity-60">{logs.length}</span>
          </button>
          {ALL_LEVELS.filter(level => counts[level]).map(level => (
            <button
              key={level}
              onClick={() => setLevelFilter(prev => (prev === level ? 'all' : level))}
              className={clsx(
                'shrink-0 rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors',
                levelFilter === level
                  ? LEVEL_BADGE[level].filterCls
                  : 'border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-400',
              )}
            >
              {LEVEL_BADGE[level].label}
              <span className="ml-0.5 opacity-60">{counts[level]}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setWrap(value => !value)}
          title={wrap ? 'Disable line wrap' : 'Enable line wrap'}
          className={clsx(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded border transition-colors',
            wrap
              ? 'border-slate-500 bg-slate-700/60 text-slate-200'
              : 'border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-400',
          )}
        >
          {wrap ? <WrapText size={12} /> : <AlignLeft size={12} />}
        </button>

        <button
          onClick={handleCopy}
          title="Copy visible logs"
          className="flex shrink-0 items-center gap-1.5 rounded border border-slate-700 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 transition-colors hover:border-slate-500 hover:text-slate-300"
        >
          {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="relative flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent"
      >
        {visible.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 font-mono text-[12px] text-slate-600">
            <span>No logs match the selected filter.</span>
            <button
              onClick={() => setLevelFilter('all')}
              className="text-[10px] text-slate-500 underline underline-offset-2 transition-colors hover:text-slate-300"
            >
              Show all logs
            </button>
          </div>
        ) : (
          <div className="font-mono text-[16px] leading-6">
            {visible.map((entry, index) => {
              const badge = LEVEL_BADGE[entry.level];
              return (
                <div
                  key={index}
                  className="group flex items-start gap-0 bg-transparent transition-colors hover:bg-slate-700/60"
                >
                  <span className="shrink-0 w-12 select-none border-r border-slate-800 pr-3 text-right text-[11px] leading-6 text-slate-500 transition-colors group-hover:text-slate-500">
                    {index + 1}
                  </span>
                  <span className="shrink-0 w-20 truncate px-2 text-[11px] leading-6 text-slate-500 select-none">
                    {entry.timestamp || '—'}
                  </span>
                  <span
                    className={clsx(
                      'mt-[3px] mr-2 w-12 shrink-0 rounded border px-1 text-center text-[10px] font-bold uppercase tracking-wider leading-[1.4]',
                      badge.cls,
                    )}
                  >
                    {badge.label}
                  </span>
                  <span
                    className={clsx('flex-1 pr-3 leading-6', badge.textCls, {
                      'break-all whitespace-pre-wrap': wrap,
                      truncate: !wrap,
                    })}
                  >
                    {entry.message}
                  </span>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}

        {showScrollBtn && (
          <button
            onClick={scrollToBottom}
            className="absolute right-4 bottom-4 flex items-center gap-1.5 rounded border border-slate-600 bg-slate-100 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-300 shadow-lg transition-all hover:bg-slate-700 hover:text-white"
          >
            <ArrowDown size={12} />
            Latest
          </button>
        )}
      </div>

      <div className="shrink-0 flex items-center gap-3 border-t border-slate-600 bg-slate-900 px-4 py-1 font-mono text-[10px]">
        <span className="text-slate-500">
          Visible <span className="font-bold text-slate-300">{visible.length}</span>
          <span className="opacity-50">/{logs.length}</span>
          <span className="ml-1 opacity-50">lines</span>
        </span>
        <div className="h-3 w-px bg-slate-800" />
        {(counts['error'] ?? 0) > 0 && (
          <span className="font-bold text-red-400">
            {counts['error']} error{counts['error'] !== 1 ? 's' : ''}
          </span>
        )}
        {(counts['warn'] ?? 0) > 0 && (
          <span className="font-bold text-amber-400">
            {counts['warn']} warning{counts['warn'] !== 1 ? 's' : ''}
          </span>
        )}
        {(counts['error'] ?? 0) === 0 && (counts['warn'] ?? 0) === 0 && (
          <span className="text-emerald-500/70">Clean</span>
        )}
        <div className="ml-auto flex items-center gap-3">
          {ALL_LEVELS.filter(level => counts[level]).map(level => (
            <span
              key={level}
              className={clsx('opacity-50', LEVEL_BADGE[level].cls.split(' ')[0])}
            >
              {LEVEL_BADGE[level].label} {counts[level]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
