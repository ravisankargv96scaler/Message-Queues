import React from 'react';
import { TabId } from '../types';
import { BookOpen, ShieldCheck, BarChart3, Share2, CheckCircle2, HelpCircle } from 'lucide-react';

interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: TabId.CONCEPT, label: 'The Concept', icon: BookOpen },
    { id: TabId.DECOUPLING, label: 'Decoupling', icon: ShieldCheck },
    { id: TabId.LOAD_LEVELING, label: 'Load Leveling', icon: BarChart3 },
    { id: TabId.PATTERNS, label: 'Patterns', icon: Share2 },
    { id: TabId.GUARANTEES, label: 'Guarantees', icon: CheckCircle2 },
    { id: TabId.QUIZ, label: 'Quiz', icon: HelpCircle },
  ];

  return (
    <nav className="flex flex-col md:flex-row bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
      <div className="flex items-center px-6 py-4 border-r border-slate-800">
        <div className="h-8 w-8 bg-amber-500 rounded flex items-center justify-center mr-3 font-bold text-slate-900">
          QM
        </div>
        <span className="font-bold text-lg tracking-tight text-white hidden md:block">QueueMaster</span>
      </div>
      <div className="flex-1 flex overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center px-5 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2
                ${isActive 
                  ? 'border-amber-500 text-amber-500 bg-slate-800/50' 
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'}
              `}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default TabNavigation;