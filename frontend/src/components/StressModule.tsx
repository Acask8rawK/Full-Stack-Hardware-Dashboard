// frontend/src/components/StressModule.tsx
import React, { useState, useEffect } from 'react';
import { Flame, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function StressModule() {
  const [active, setActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [report, setReport] = useState<any>(null);

  const DURATION = 15; // Set stress test duration (seconds)

  const startStress = async () => {
    setActive(true);
    setReport(null);
    setTimeLeft(DURATION);

    try {
      // 1. Trigger Backend (Don't await immediately so we can show countdown)
      const fetchPromise = fetch('http://127.0.0.1:8000/stress-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration: DURATION }),
      });

      // 2. Start Countdown UI
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // 3. Wait for Backend
      const res = await fetchPromise;
      const data = await res.json();
      setReport(data);
    } catch (e) {
      console.error(e);
    } finally {
      setActive(false);
      setTimeLeft(0);
    }
  };

  return (
    <div className="w-full max-w-lg bg-slate-950 border border-red-900/50 rounded-lg overflow-hidden text-slate-200 font-mono shadow-2xl relative">
      
      {/* Red Warning Overlay when Active */}
      {active && (
        <div className="absolute inset-0 bg-red-500/10 z-0 animate-pulse pointer-events-none"></div>
      )}

      {/* Header */}
      <div className="bg-red-950/30 p-3 border-b border-red-900/50 flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-2 text-red-500">
          <Flame size={18} fill="currentColor" />
          <span className="text-sm font-bold">STRESS.TEST_MODE</span>
        </div>
        <ShieldAlert size={16} className="text-red-500" />
      </div>

      {/* Body */}
      <div className="p-6 space-y-6 z-10 relative">
        
        {/* Status Display */}
        <div className="text-center space-y-2 min-h-[80px] flex flex-col justify-center">
          {!active && !report && (
            <p className="text-xs text-slate-500">
              WARNING: High Load Sequence.<br/>System may become unresponsive.
            </p>
          )}

          {active && (
            <div className="space-y-2">
              <div className="text-4xl font-bold text-red-500 animate-pulse">
                00:{timeLeft.toString().padStart(2, '0')}
              </div>
              <p className="text-xs text-red-400">MAXIMIZING GPU LOAD...</p>
            </div>
          )}

          {report && !active && (
             <div className="text-xs text-emerald-400 border border-emerald-900/50 bg-emerald-950/30 p-2 rounded">
                [TEST COMPLETE]<br/>
                Ops Performed: {report.matrix_operations}<br/>
                Device: {report.device}
             </div>
          )}
        </div>

        {/* Button */}
        <button
          onClick={startStress}
          disabled={active}
          className={`w-full py-3 rounded font-bold text-sm flex items-center justify-center gap-2 transition-all border
            ${active 
              ? 'bg-red-950 border-red-900 text-red-700 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-500 text-white border-transparent shadow-[0_0_15px_rgba(220,38,38,0.5)]'
            }`}
        >
          {active ? <AlertTriangle size={16} /> : <Flame size={16} />}
          {active ? 'STRESSING SYSTEM...' : 'INITIATE STRESS TEST'}
        </button>

      </div>
    </div>
  );
}