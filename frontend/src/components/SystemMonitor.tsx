 // frontend/src/components/SystemMonitor.tsx
import React, { useState, useEffect } from 'react';
import { HardDrive, MemoryStick, Activity } from 'lucide-react';

interface SystemStats {
  ram: { total_gb: number; used_gb: number; percent: number };
  disk: { total_gb: number; used_gb: number; percent: number };
}

export default function SystemMonitor() {
  const [stats, setStats] = useState<SystemStats | null>(null);

  // Fetch data every 2 seconds
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/system-stats');
        const data = await res.json();
        setStats(data);
      } catch (e) {
        console.error("Monitor offline");
      }
    };

    // Initial fetch
    fetchStats();

    // Set interval loop
    const interval = setInterval(fetchStats, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-lg overflow-hidden text-slate-200 font-mono shadow-2xl h-fit">
      {/* Header */}
      <div className="bg-slate-900 p-3 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2 text-amber-500">
          <Activity size={18} />
          <span className="text-sm font-bold">LIVE.MONITOR</span>
        </div>
        <div className="text-xs text-slate-600 animate-pulse">● LIVE</div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">
        
        {/* RAM Section */}
        <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
                <span className="flex items-center gap-2">
                    <MemoryStick size={14} /> RAM USAGE
                </span>
                {stats && <span>{stats.ram.used_gb} / {stats.ram.total_gb} GB</span>}
            </div>
            
            <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div 
                    className="h-full bg-amber-500 transition-all duration-500 ease-out"
                    style={{ width: `${stats?.ram.percent || 0}%` }}
                ></div>
            </div>
            <div className="text-right text-xs text-amber-500 font-bold">
                {stats?.ram.percent}%
            </div>
        </div>

        {/* Disk Section */}
        <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
                <span className="flex items-center gap-2">
                    <HardDrive size={14} /> DISK (ROOT)
                </span>
                {stats && <span>{stats.disk.used_gb} / {stats.disk.total_gb} GB</span>}
            </div>
            
            <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div 
                    className="h-full bg-indigo-500 transition-all duration-500 ease-out"
                    style={{ width: `${stats?.disk.percent || 0}%` }}
                ></div>
            </div>
             <div className="text-right text-xs text-indigo-500 font-bold">
                {stats?.disk.percent}%
            </div>
        </div>

      </div>
    </div>
  );
}