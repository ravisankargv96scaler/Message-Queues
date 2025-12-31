import React, { useState, useEffect, useRef } from 'react';
import { Settings, Server, Users } from 'lucide-react';
import Button from '../ui/Button';

const Tab3LoadLeveling: React.FC = () => {
  const [queueCount, setQueueCount] = useState(0);
  const [consumerSpeed, setConsumerSpeed] = useState(500); // ms per item
  const [processing, setProcessing] = useState(false);
  const [spikeActive, setSpikeActive] = useState(false);
  
  const consumerRef = useRef<HTMLDivElement>(null);

  // Trigger Spike
  const triggerSpike = () => {
    setSpikeActive(true);
    let added = 0;
    const interval = setInterval(() => {
      setQueueCount(prev => prev + 5);
      added += 5;
      if (added >= 100) {
        clearInterval(interval);
        setSpikeActive(false);
      }
    }, 20); // Fast addition
  };

  // Consumer Loop
  useEffect(() => {
    let interval: any;
    if (queueCount > 0) {
      setProcessing(true);
      interval = setInterval(() => {
        setQueueCount(prev => Math.max(0, prev - 1));
        
        // Simple visual feedback on consumer
        if (consumerRef.current) {
            consumerRef.current.style.transform = "scale(1.05)";
            setTimeout(() => {
                if (consumerRef.current) consumerRef.current.style.transform = "scale(1)";
            }, 100);
        }
      }, consumerSpeed);
    } else {
      setProcessing(false);
    }
    return () => clearInterval(interval);
  }, [queueCount, consumerSpeed]);

  // Queue visual calculation
  const queuePercentage = Math.min((queueCount / 100) * 100, 100);
  const isOverloaded = queueCount > 80;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-amber-500">The Benefit: Load Leveling</h2>
        <p className="text-lg text-slate-400">
          During traffic spikes (e.g., Flash Sales), a queue acts as a shock absorber. It captures incoming requests rapidly and lets the consumer process them at a safe, steady pace.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Settings className="text-slate-400" />
          <div className="flex flex-col flex-1">
            <label className="text-sm font-semibold text-slate-300 mb-1">Consumer Processing Speed: {consumerSpeed}ms</label>
            <input 
              type="range" 
              min="100" 
              max="2000" 
              step="100"
              value={consumerSpeed}
              onChange={(e) => setConsumerSpeed(Number(e.target.value))}
              className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>Fast</span>
              <span>Slow</span>
            </div>
          </div>
        </div>

        <Button 
            variant="danger" 
            onClick={triggerSpike} 
            disabled={spikeActive}
            className="w-full md:w-auto"
        >
            {spikeActive ? 'INCOMING TRAFFIC...' : 'TRIGGER TRAFFIC SPIKE (100 REQ)'}
        </Button>
      </div>

      {/* Visualization */}
      <div className="bg-slate-900 p-8 rounded-xl border border-slate-700 shadow-2xl relative overflow-hidden min-h-[300px] flex items-center justify-between">
        
        {/* Source */}
        <div className="flex flex-col items-center gap-2 z-10">
            <div className={`p-4 rounded-full bg-slate-800 border-2 ${spikeActive ? 'border-rose-500 animate-pulse' : 'border-slate-600'}`}>
                <Users size={32} className="text-slate-300" />
            </div>
            <span className="font-mono text-sm text-slate-400">Traffic Source</span>
        </div>

        {/* The Queue Visualization */}
        <div className="flex-1 mx-8 flex flex-col gap-2 relative">
             <div className="flex justify-between text-xs text-slate-500 font-mono">
                <span>BUFFER</span>
                <span>{queueCount} Pending</span>
             </div>
             
             {/* Container */}
             <div className={`h-16 w-full bg-slate-800 rounded-lg border-2 border-slate-600 relative overflow-hidden ${isOverloaded ? 'animate-flash' : ''}`}>
                 {/* Visual Dots */}
                 <div className="absolute inset-0 p-2 flex flex-wrap content-start gap-1">
                    {Array.from({ length: Math.min(queueCount, 60) }).map((_, i) => (
                        <div key={i} className="w-2 h-2 rounded-full bg-amber-500 shadow-sm animate-in fade-in zoom-in duration-300"></div>
                    ))}
                    {queueCount > 60 && <span className="text-xs text-amber-500 font-bold ml-2">... +{queueCount - 60} more</span>}
                 </div>
                 
                 {/* Progress Overlay */}
                 <div 
                    className="absolute bottom-0 left-0 h-1 bg-amber-500 transition-all duration-300" 
                    style={{ width: `${queuePercentage}%` }}
                 ></div>
             </div>
             
             {/* Flow arrows */}
             <div className="conveyor-belt h-4 w-full opacity-30 mt-2 rounded"></div>
        </div>

        {/* Consumer */}
        <div className="flex flex-col items-center gap-2 z-10">
            <div 
                ref={consumerRef}
                className="p-4 rounded-lg bg-slate-800 border-2 border-emerald-500 transition-transform duration-100 flex flex-col items-center"
            >
                <Server size={32} className={processing ? "text-emerald-400" : "text-slate-500"} />
            </div>
            <span className="font-mono text-sm text-slate-400">Consumer</span>
            {processing && <span className="text-xs text-emerald-500 animate-pulse">Processing...</span>}
        </div>
      </div>
      
      <div className="bg-slate-800/50 p-4 rounded border border-slate-700 text-center">
         <p className="text-sm text-slate-400">
            Observation: Even though 100 requests arrived in 2 seconds, the consumer is processing them 1-by-1 every {consumerSpeed}ms. The system remains stable.
         </p>
      </div>
    </div>
  );
};

export default Tab3LoadLeveling;