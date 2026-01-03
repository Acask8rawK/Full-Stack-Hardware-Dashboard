import React, { useState } from 'react';
import { Play, Cpu, Zap, Terminal } from 'lucide-react';

export default function BenchmarkModule() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const runTest = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/run-benchmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ size: 8000 }),
      });
      const result = await res.json();
      setData(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Calculate width for bars
  const maxTime = data ? Math.max(data.cpu, data.cuda || 0) : 1;
  const getWidth = (val: number) => (val / maxTime) * 100;

  return (
    <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-lg overflow-hidden text-slate-200 font-mono shadow-2xl">
      {/* Header */}
      <div className="bg-slate-900 p-3 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2 text-emerald-500">
          <Terminal size={18} />
          <span className="text-sm font-bold">SYS.BENCHMARK_V1</span>
        </div>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">
        {!data && !loading && (
          <div className="text-center py-8 text-slate-500 text-sm">
            [READY] Waiting for user input...
          </div>
        )}

        {loading && (
          <div className="text-emerald-500 animate-pulse text-sm">
            &gt; RUNNING MATRIX_MULTIPLICATION (8000x8000)...
          </div>
        )}

        {data && (
          <div className="space-y-4">
            {/* CPU Result */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span className="flex items-center gap-1">
                    <Cpu size={12}/> 
                    {/* 👇 CHANGED: Now displays real CPU Name */}
                    {data.cpu_name || "CPU_HOST"}
                </span>
                <span>{data.cpu.toFixed(2)}s</span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${getWidth(data.cpu)}%` }}></div>
              </div>
            </div>

            {/* GPU Result */}
            <div>
              <div className="flex justify-between text-xs text-emerald-400 mb-1 font-bold">
                <span className="flex items-center gap-1">
                  <Zap size={12}/> 
                  {/* 👇 Displays real GPU Name */}
                  {data.gpu_name || "GPU_DEVICE"}
                </span>
                <span>{data.cuda?.toFixed(2) || 'N/A'}s</span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)]" style={{ width: `${getWidth(data.cuda || 0)}%` }}></div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-center text-emerald-400 text-xs">
              &gt; {data.summary}
            </div>
          </div>
        )}

        <button
          onClick={runTest}
          disabled={loading}
          className="w-full bg-slate-100 text-slate-950 py-2 rounded font-bold text-sm hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
           <Play size={14} /> EXECUTE
        </button>
      </div>
    </div>
  );
}