import React, { useState, useEffect } from 'react';
import { User, ChefHat, ScrollText, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

interface Ticket {
  id: number;
  status: 'waiting' | 'cooking' | 'done';
}

const Tab1Concept: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [chefState, setChefState] = useState<'idle' | 'cooking'>('idle');
  const [waiterState, setWaiterState] = useState<'idle' | 'busy'>('idle');

  const addTicket = () => {
    setWaiterState('busy');
    setTimeout(() => {
      const newTicket: Ticket = { id: Date.now(), status: 'waiting' };
      setTickets((prev) => [...prev, newTicket]);
      setWaiterState('idle');
    }, 500);
  };

  // Chef Loop
  useEffect(() => {
    if (chefState === 'idle' && tickets.some(t => t.status === 'waiting')) {
      const ticketIndex = tickets.findIndex(t => t.status === 'waiting');
      if (ticketIndex === -1) return;

      setChefState('cooking');
      
      // Update ticket to cooking
      setTickets(prev => {
        const newTickets = [...prev];
        newTickets[ticketIndex].status = 'cooking';
        return newTickets;
      });

      // Simulate cooking time
      setTimeout(() => {
        setTickets(prev => prev.filter((_, idx) => idx !== ticketIndex)); // Remove finished ticket
        setChefState('idle');
      }, 2000);
    }
  }, [tickets, chefState]);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-amber-500">The Restaurant Analogy</h2>
        <p className="text-lg text-slate-400">
          A Message Queue is like a kitchen ticket rail. The Waiter (Producer) doesn't wait for the Chef (Consumer) to cook the food. 
          They place the order and get back to work.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 shadow-2xl relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500/20 to-blue-500/20"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Producer Section */}
          <div className="flex flex-col items-center space-y-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <h3 className="text-xl font-semibold text-amber-400">Waiter (Producer)</h3>
            <div className={`p-4 rounded-full transition-colors duration-300 ${waiterState === 'busy' ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-700 text-slate-400'}`}>
              <User size={48} />
            </div>
            <Button onClick={addTicket} disabled={waiterState === 'busy'}>
              {waiterState === 'busy' ? 'Taking Order...' : 'Place Order'}
            </Button>
            <p className="text-sm text-center text-slate-500">Creates messages</p>
          </div>

          {/* Queue Section */}
          <div className="flex flex-col items-center space-y-4 relative">
             <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 z-0 hidden md:block">
                <ArrowRight className="text-slate-600" size={32} />
             </div>
             
             <div className="w-full bg-slate-800 border-x-4 border-slate-600 h-32 relative flex items-center px-4 overflow-x-auto gap-2 rounded-sm shadow-inner">
                {/* The Rail */}
                <div className="absolute top-0 left-0 w-full h-2 bg-slate-500 shadow-md"></div>
                
                {tickets.length === 0 && (
                  <span className="w-full text-center text-slate-600 text-sm italic">Ticket Rail Empty</span>
                )}

                {tickets.map((t) => (
                  <div key={t.id} className={`
                    flex-shrink-0 w-16 h-20 bg-yellow-100 text-slate-900 p-2 text-xs font-mono shadow-md transform transition-all duration-300 border-t-4 border-slate-300
                    ${t.status === 'cooking' ? 'scale-110 border-orange-500 bg-orange-100' : ''}
                  `}>
                    <div className="flex justify-center mb-1">
                      <ScrollText size={12} />
                    </div>
                    Order #{t.id.toString().slice(-4)}
                  </div>
                ))}
             </div>
             <h3 className="text-xl font-semibold text-slate-300">The Queue (Buffer)</h3>
             
             <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 z-0 hidden md:block">
                <ArrowRight className="text-slate-600" size={32} />
             </div>
          </div>

          {/* Consumer Section */}
          <div className="flex flex-col items-center space-y-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <h3 className="text-xl font-semibold text-blue-400">Chef (Consumer)</h3>
            <div className={`p-4 rounded-full transition-colors duration-300 ${chefState === 'cooking' ? 'bg-orange-500 animate-pulse text-white' : 'bg-slate-700 text-slate-400'}`}>
              <ChefHat size={48} />
            </div>
            <div className="h-10 flex items-center justify-center">
              <span className={`px-3 py-1 rounded text-sm font-bold ${chefState === 'cooking' ? 'bg-orange-900 text-orange-200' : 'bg-emerald-900 text-emerald-200'}`}>
                {chefState === 'cooking' ? 'COOKING...' : 'READY'}
              </span>
            </div>
            <p className="text-sm text-center text-slate-500">Processes messages</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tab1Concept;