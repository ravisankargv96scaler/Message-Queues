import React, { useState } from 'react';
import { WorkerMode } from '../../types';
import Button from '../ui/Button';
import { Mail, ArrowRight, User } from 'lucide-react';

const Tab4Patterns: React.FC = () => {
  const [mode, setMode] = useState<WorkerMode>(WorkerMode.WORKER);
  const [messages, setMessages] = useState<{ id: number, target: number[] }[]>([]);
  
  // Worker mode round-robin index
  const [rrIndex, setRrIndex] = useState(0);

  const sendMessage = () => {
    const msgId = Date.now();
    let targets: number[] = [];

    if (mode === WorkerMode.WORKER) {
      targets = [rrIndex];
      setRrIndex((prev) => (prev + 1) % 3);
    } else {
      targets = [0, 1, 2]; // All consumers
    }

    setMessages([...messages, { id: msgId, target: targets }]);

    // Auto clear after animation
    setTimeout(() => {
      setMessages(prev => prev.filter(m => m.id !== msgId));
    }, 2000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-amber-500">Distribution Patterns</h2>
        <p className="text-lg text-slate-400">
            How messages are delivered to consumers depends on the pattern used.
        </p>
      </div>

      {/* Mode Switch */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-800 p-1 rounded-lg inline-flex">
          <button
            onClick={() => setMode(WorkerMode.WORKER)}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${mode === WorkerMode.WORKER ? 'bg-amber-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}
          >
            Worker Queue (Load Balance)
          </button>
          <button
            onClick={() => setMode(WorkerMode.PUBSUB)}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${mode === WorkerMode.PUBSUB ? 'bg-amber-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}
          >
            Pub/Sub (Fan-out)
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-12 min-h-[400px] relative">
          
          {/* Layout Grid */}
          <div className="grid grid-cols-3 gap-8 h-full">
              
              {/* Producer */}
              <div className="col-span-1 flex flex-col justify-center items-center border-r border-slate-800 pr-8">
                 <div className="mb-8 p-4 bg-slate-800 rounded-full">
                    <User size={32} />
                 </div>
                 <Button onClick={sendMessage}>Send Message</Button>
                 <p className="mt-4 text-xs text-slate-500 text-center">
                    {mode === WorkerMode.WORKER ? "Sends 1 task to be done once." : "Broadcasts event to everyone."}
                 </p>
              </div>

              {/* The Exchange/Router */}
              <div className="col-span-1 flex flex-col justify-center items-center relative">
                 <div className="w-16 h-16 bg-slate-700 border-2 border-slate-500 rounded-lg flex items-center justify-center rotate-45 mb-4 z-10">
                    <div className="-rotate-45 font-bold text-slate-300 text-xs text-center">
                        {mode === WorkerMode.WORKER ? "Queue" : "Topic"}
                    </div>
                 </div>

                 {/* Message Animation */}
                 {messages.map(msg => (
                     msg.target.map(targetIdx => {
                         // Calculate Y offset based on target index (-1, 0, 1)
                         const yOffset = (targetIdx - 1) * 80;
                         return (
                            <div 
                                key={`${msg.id}-${targetIdx}`}
                                className="absolute left-1/2 top-1/2 w-8 h-6 bg-amber-400 rounded flex items-center justify-center text-slate-900 shadow-lg z-20"
                                style={{
                                    animation: `flyMessage${targetIdx} 1.5s forwards ease-in-out`
                                }}
                            >
                                <Mail size={12} />
                            </div>
                         );
                     })
                 ))}
                 
                 {/* CSS for flying messages */}
                 <style>{`
                    @keyframes flyMessage0 {
                        0% { transform: translate(-150%, -50%) scale(0.5); opacity: 0; }
                        20% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                        100% { transform: translate(150%, calc(-50% - 100px)); opacity: 0; }
                    }
                    @keyframes flyMessage1 {
                        0% { transform: translate(-150%, -50%) scale(0.5); opacity: 0; }
                        20% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                        100% { transform: translate(150%, -50%); opacity: 0; }
                    }
                    @keyframes flyMessage2 {
                        0% { transform: translate(-150%, -50%) scale(0.5); opacity: 0; }
                        20% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                        100% { transform: translate(150%, calc(-50% + 100px)); opacity: 0; }
                    }
                 `}</style>

              </div>

              {/* Consumers */}
              <div className="col-span-1 flex flex-col justify-between items-start py-8 pl-8 border-l border-slate-800">
                 {[0, 1, 2].map((idx) => (
                     <div key={idx} className="flex items-center gap-4 group">
                         <div className="p-3 bg-slate-800 rounded border border-slate-700 group-hover:border-amber-500 transition-colors">
                            <span className="font-mono font-bold text-slate-400">Consumer {String.fromCharCode(65 + idx)}</span>
                         </div>
                         <ArrowRight className="text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                     </div>
                 ))}
              </div>
          </div>
      </div>
    </div>
  );
};

export default Tab4Patterns;