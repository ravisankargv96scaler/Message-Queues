import React, { useState } from 'react';
import TabNavigation from './components/TabNavigation';
import { TabId } from './types';
import Tab1Concept from './components/tabs/Tab1Concept';
import Tab2Decoupling from './components/tabs/Tab2Decoupling';
import Tab3LoadLeveling from './components/tabs/Tab3LoadLeveling';
import Tab4Patterns from './components/tabs/Tab4Patterns';
import Tab5Guarantees from './components/tabs/Tab5Guarantees';
import Tab6Quiz from './components/tabs/Tab6Quiz';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>(TabId.CONCEPT);

  const renderContent = () => {
    switch (activeTab) {
      case TabId.CONCEPT:
        return <Tab1Concept />;
      case TabId.DECOUPLING:
        return <Tab2Decoupling />;
      case TabId.LOAD_LEVELING:
        return <Tab3LoadLeveling />;
      case TabId.PATTERNS:
        return <Tab4Patterns />;
      case TabId.GUARANTEES:
        return <Tab5Guarantees />;
      case TabId.QUIZ:
        return <Tab6Quiz />;
      default:
        return <Tab1Concept />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans">
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderContent()}
        </div>
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-slate-500 text-sm">
        <p>Interactive System Design Module • Message Queues</p>
      </footer>
    </div>
  );
};

export default App;