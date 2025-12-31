import React, { useState } from 'react';
import Button from '../ui/Button';
import { Package, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

const Tab5Guarantees: React.FC = () => {
  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  // 0: Idle in Queue
  // 1: Moving to consumer
  // 2: Processing (User must decide)
  // 3: ACK sent (Success)
  // 4: Failed (Return to Queue)

  const processMessage = () => {
    setStep(1);
    setTimeout(() => {
      setStep(2);
    }, 1000);
  };

  const sendAck = () => {
    setStep(3);
    setTimeout(() => {
      setStep(0);
    }, 2000);
  };

  const crashConsumer = () => {
    setStep(4);
    setTimeout(() => {
        // Simulating timeout and re-queue
        setStep(0);
    }, 2000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-amber-500">Delivery Guarantees & ACKs</h2>
        <p className="text-lg text-slate-400">
            To ensure data isn't lost if a consumer crashes while processing, queues use <strong>Acknowledgments (ACKs)</strong>. The message is only deleted from the queue once the consumer confirms it's done.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 h-[300px] relative flex items-center justify-between overflow-hidden">
        
        {/* Queue Box */}
        <div className="w-32 h-40 border-4 border-slate-600 border-r-0 rounded-l-lg bg-slate-800/50 flex flex-col items-center justify-center relative">
            <span className="absolute -top-8 text-slate-500 font-bold">Queue</span>
            {/* The Message in Queue */}
            {(step === 0 || step === 1 || step === 4) && (
                <div 
                    className={`
                        w-12 h-12 bg-amber-500 rounded flex items-center justify-center text-slate-900 shadow-lg absolute transition-all duration-1000 ease-in-out
                        ${step === 1 ? 'left-[200px]' : 'left-8'}
                        ${step === 4 ? 'left-8 animate-pulse bg-rose-500' : ''}
                    `}
                >
                    <Package />
                </div>
            )}
            
            {/* Ghost message during processing */}
            {step === 2 && (
                <div className="w-12 h-12 border-2 border-dashed border-slate-600 rounded flex items-center justify-center opacity-50 absolute left-8">
                    <Package size={16} />
                </div>
            )}
        </div>

        {/* Consumer Box */}
        <div className="w-64 h-48 border border-slate-600 bg-slate-800 rounded-lg flex flex-col items-center p-4 relative">
             <span className="absolute -top-8 text-blue-400 font-bold">Consumer</span>
             
             {step === 0 && <p className="text-slate-500 text-sm mt-8">Waiting for work...</p>}
             
             {step === 1 && <p className="text-amber-400 text-sm mt-8 animate-pulse">Receiving message...</p>}

             {step === 2 && (
                 <div className="flex flex-col items-center w-full gap-2 mt-2">
                     <div className="text-white font-bold mb-2">Processing...</div>
                     <div className="flex gap-2 w-full">
                         <button onClick={sendAck} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs py-2 rounded">
                             Finish & ACK
                         </button>
                         <button onClick={crashConsumer} className="flex-1 bg-rose-600 hover:bg-rose-500 text-white text-xs py-2 rounded">
                             Crash / Timeout
                         </button>
                     </div>
                 </div>
             )}

             {step === 3 && (
                 <div className="flex flex-col items-center text-emerald-500 mt-4 animate-bounce">
                     <CheckCircle size={32} />
                     <span className="text-sm font-bold mt-2">ACK SENT</span>
                 </div>
             )}

             {step === 4 && (
                 <div className="flex flex-col items-center text-rose-500 mt-4">
                     <AlertTriangle size={32} />
                     <span className="text-sm font-bold mt-2">NO ACK (Timeout)</span>
                 </div>
             )}
        </div>

        {/* Feedback Text */}
        <div className="absolute bottom-4 left-0 w-full text-center text-sm font-mono text-slate-400">
            {step === 0 && "Status: Message stored safely in Queue."}
            {step === 2 && "Status: Message locked by Consumer. Queue waits for ACK."}
            {step === 3 && "Status: Queue received ACK. Message deleted."}
            {step === 4 && "Status: Timeout detected! Message unlocked for redelivery."}
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button onClick={processMessage} disabled={step !== 0}>
            Start Processing Message
        </Button>
      </div>
    </div>
  );
};

export default Tab5Guarantees;