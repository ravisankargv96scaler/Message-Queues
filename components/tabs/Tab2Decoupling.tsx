import React, { useState, useEffect } from 'react';
import { Server, ArrowRight, XCircle, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';

const Tab2Decoupling: React.FC = () => {
  const [serviceBAlive, setServiceBAlive] = useState(true);
  const [queue, setQueue] = useState<number[]>([]);
  
  // Scenario A State (REST)
  const [restStatus, setRestStatus] = useState<'idle' | 'sending' | 'success' | 'failed'>('idle');

  // Scenario B State (Queue)
  const [queueMsgStatus, setQueueMsgStatus] = useState<'idle' | 'sent'>('idle');
  const [processingQueue, setProcessingQueue] = useState(false);

  // REST Simulation
  const sendRestRequest = () => {
    setRestStatus('sending');
    setTimeout(() => {
      if (serviceBAlive) {
        setRestStatus('success');
      } else {
        setRestStatus('failed');
      }
      setTimeout(() => setRestStatus('idle'), 2000);
    }, 1000);
  };

  // Queue Simulation - Sending
  const sendQueueMessage = () => {
    setQueue(prev => [...prev, Date.now()]);
    setQueueMsgStatus('sent');
    setTimeout(() => setQueueMsgStatus('idle'), 500);
  };

  // Queue Simulation - Consumer Processing Loop
  useEffect(() => {
    let interval: any;
    if (serviceBAlive && queue.length > 0) {
      setProcessingQueue(true);
      interval = setInterval(() => {
        setQueue(prev => {
          if (prev.length === 0) return prev;
          const newQ = [...prev];
          newQ.shift(); // Process one
          return newQ;
        });
      }, 1000);
    } else {
      setProcessingQueue(false);
    }

    return () => clearInterval(interval);
  }, [serviceBAlive, queue.length]);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-amber-500">The Benefit: Decoupling</h2>
        <p className="text-lg text-slate-400">
          In tightly coupled systems, if a dependency fails, the caller fails. Message queues introduce a buffer, allowing the sender to succeed even if the receiver is down.
        </p>
      </div>

      <div className="flex justify-center bg-slate-800 p-4 rounded-lg border border-slate-700 mb-8">
        <div className="flex items-center gap-4">
          <span className="text-slate-300 font-semibold">Service B Status:</span>
          <button 
            onClick={() => setServiceBAlive(!serviceBAlive)}
            className={`px-4 py-2 rounded-full font-bold transition-all ${serviceBAlive ? 'bg-emerald-500 text-slate-900' : 'bg-rose-600 text-white animate-pulse'}`}
          >
            {serviceBAlive ? 'ONLINE' : 'OFFLINE (CRASHED)'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Scenario A: Tightly Coupled (REST) */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-xl flex flex-col h-full">
          <h3 className="text-xl font-bold text-rose-400 mb-4 border-b border-slate-800 pb-2">Scenario A: No Queue (REST)</h3>
          
          <div className="flex-1 flex flex-col items-center justify-center space-y-8 py-8 relative">
             <div className="flex items-center justify-between w-full px-8">
                {/* Service A */}
                <div className="flex flex-col items-center gap-2">
                    <Server size={40} className="text-slate-300" />
                    <span className="font-mono text-sm">Service A</span>
                    {restStatus === 'failed' && <span className="text-xs bg-rose-900 text-rose-200 px-2 py-1 rounded">500 Error</span>}
                </div>

                {/* Connection Line */}
                <div className="flex-1 h-1 bg-slate-600 mx-4 relative">
                    {restStatus === 'sending' && (
                        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full animate-[ping_1s_linear_infinite]"></div>
                    )}
                </div>

                {/* Service B */}
                <div className="flex flex-col items-center gap-2">
                    <Server size={40} className={serviceBAlive ? "text-emerald-500" : "text-rose-600"} />
                    <span className="font-mono text-sm">Service B</span>
                </div>
             </div>

             <div className="h-12 flex items-center justify-center">
                {restStatus === 'failed' && <div className="text-rose-500 flex items-center gap-2 font-bold"><XCircle /> System Failure</div>}
                {restStatus === 'success' && <div className="text-emerald-500 flex items-center gap-2 font-bold"><CheckCircle /> Success</div>}
                {restStatus === 'sending' && <div className="text-blue-400 animate-pulse">Waiting for response...</div>}
             </div>
          </div>

          <div className="mt-auto">
             <Button 
                variant="outline" 
                className="w-full border-rose-500/50 hover:bg-rose-950 text-rose-200"
                onClick={sendRestRequest}
                disabled={restStatus === 'sending'}
            >
                Send Sync Request
             </Button>
             <p className="text-xs text-slate-500 mt-2 text-center">Fails immediately if B is offline.</p>
          </div>
        </div>

        {/* Scenario B: Loosely Coupled (Queue) */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-xl flex flex-col h-full">
          <h3 className="text-xl font-bold text-emerald-400 mb-4 border-b border-slate-800 pb-2">Scenario B: With Queue</h3>
          
          <div className="flex-1 flex flex-col items-center justify-center space-y-8 py-8">
             <div className="flex items-center justify-between w-full px-4">
                {/* Service A */}
                <div className="flex flex-col items-center gap-2">
                    <Server size={40} className="text-slate-300" />
                    <span className="font-mono text-sm">Service A</span>
                </div>

                <ArrowRight className="text-slate-600" size={20} />

                {/* The Queue */}
                <div className="w-24 h-16 bg-slate-800 border-2 border-slate-600 rounded flex items-center justify-center relative shadow-inner">
                    <span className="text-xs text-slate-500 absolute -top-5 left-1/2 -translate-x-1/2">Queue</span>
                    <div className="flex gap-1 overflow-hidden px-1">
                        {queue.map((_, i) => (
                            <div key={i} className="w-3 h-8 bg-amber-500 rounded-sm shadow-sm flex-shrink-0"></div>
                        ))}
                    </div>
                </div>

                <ArrowRight className="text-slate-600" size={20} />

                {/* Service B */}
                <div className="flex flex-col items-center gap-2 relative">
                    <Server size={40} className={serviceBAlive ? "text-emerald-500" : "text-rose-600"} />
                    <span className="font-mono text-sm">Service B</span>
                    {processingQueue && <div className="absolute -top-2 -right-2 w-3 h-3 bg-orange-500 rounded-full animate-ping"></div>}
                </div>
             </div>

             <div className="h-12 flex items-center justify-center">
                 {queueMsgStatus === 'sent' && <div className="text-emerald-400 flex items-center gap-2">Message Queued! Service A is free.</div>}
                 {!serviceBAlive && queue.length > 0 && <div className="text-amber-400 text-sm">B is down. Messages are safe in queue.</div>}
                 {serviceBAlive && processingQueue && <div className="text-blue-400 text-sm animate-pulse">Service B Processing backlog...</div>}
             </div>
          </div>

          <div className="mt-auto">
             <Button 
                variant="primary" 
                className="w-full"
                onClick={sendQueueMessage}
            >
                Send Async Message
             </Button>
             <p className="text-xs text-slate-500 mt-2 text-center">Service A succeeds immediately. B processes when alive.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tab2Decoupling;