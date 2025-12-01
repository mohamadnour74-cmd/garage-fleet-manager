import React, { useState } from 'react';
import { FleetProvider, useFleet } from './context/FleetContext';
import { Dashboard } from './components/Dashboard';
import { FleetList } from './components/FleetList';
import { FleetDetail } from './components/FleetDetail';
import { MaintenanceForm } from './components/MaintenanceForm';
import { Reminders } from './components/Reminders';
import { SettingsPage } from './components/Settings';
import { EditFleetItem } from './components/EditFleetItem';
import { LayoutGrid, List, Settings as SettingsIcon } from 'lucide-react';
import { MaintenanceType } from './types';

const MainLayout = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [viewStack, setViewStack] = useState<string[]>(['dashboard']);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [formInitialType, setFormInitialType] = useState<MaintenanceType>('SERVICE');

  // Simple routing logic without React Router
  const navigate = (view: string) => {
    setViewStack(prev => [...prev, view]);
  };

  const goBack = () => {
    setViewStack(prev => prev.length > 1 ? prev.slice(0, -1) : prev);
  };

  const currentView = viewStack[viewStack.length - 1];

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={navigate} />;
      case 'fleet':
        return <FleetList onSelect={(id) => { setSelectedItemId(id); navigate('detail'); }} />;
      case 'detail':
        return selectedItemId ? (
          <FleetDetail 
            itemId={selectedItemId} 
            onBack={goBack} 
            onEdit={() => navigate('edit-fleet')}
            onAddMaintenance={(id, type) => { 
              setSelectedItemId(id); 
              setFormInitialType(type);
              navigate('maintenance-form'); 
            }}
          />
        ) : null;
      case 'edit-fleet':
        return selectedItemId ? (
          <EditFleetItem 
            itemId={selectedItemId}
            onBack={goBack}
            onSuccess={goBack}
          />
        ) : null;
      case 'maintenance-form':
        return selectedItemId ? (
          <MaintenanceForm 
            itemId={selectedItemId} 
            initialType={formInitialType}
            onBack={goBack} 
            onSuccess={goBack}
          />
        ) : null;
      case 'reminders':
        return <Reminders onBack={goBack} />;
      case 'settings':
        return <SettingsPage />;
      case 'new-vehicle':
        return (
            <div className="p-4">
                <button onClick={goBack} className="mb-4 text-blue-600">Back</button>
                <h2 className="text-xl font-bold">Add Vehicle (Placeholder)</h2>
                <p className="text-slate-500">Form to add a new fleet item would go here.</p>
            </div>
        );
      default:
        return <Dashboard onNavigate={navigate} />;
    }
  };

  // Bottom Navigation Logic
  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'dashboard') setViewStack(['dashboard']);
    if (tab === 'fleet') setViewStack(['fleet']);
    if (tab === 'settings') setViewStack(['settings']);
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col md:flex-row max-w-7xl mx-auto shadow-2xl overflow-hidden">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white p-6">
        <h1 className="text-xl font-bold mb-10 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg"></div> Fleet Mgr
        </h1>
        <nav className="space-y-4 flex-1">
          <button onClick={() => handleNavClick('dashboard')} className={`flex items-center gap-3 w-full p-3 rounded-xl ${activeTab === 'dashboard' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
            <LayoutGrid size={20} /> Dashboard
          </button>
          <button onClick={() => handleNavClick('fleet')} className={`flex items-center gap-3 w-full p-3 rounded-xl ${activeTab === 'fleet' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
            <List size={20} /> Vehicles
          </button>
          <button onClick={() => handleNavClick('settings')} className={`flex items-center gap-3 w-full p-3 rounded-xl ${activeTab === 'settings' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
            <SettingsIcon size={20} /> Settings
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar">
          {renderContent()}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 flex justify-around p-4 z-50">
        <button onClick={() => handleNavClick('dashboard')} className={`flex flex-col items-center ${activeTab === 'dashboard' ? 'text-blue-600' : 'text-slate-400'}`}>
          <LayoutGrid size={24} />
          <span className="text-[10px] font-bold mt-1">Home</span>
        </button>
        <button onClick={() => handleNavClick('fleet')} className={`flex flex-col items-center ${activeTab === 'fleet' ? 'text-blue-600' : 'text-slate-400'}`}>
          <List size={24} />
          <span className="text-[10px] font-bold mt-1">Fleet</span>
        </button>
        <button onClick={() => handleNavClick('settings')} className={`flex flex-col items-center ${activeTab === 'settings' ? 'text-blue-600' : 'text-slate-400'}`}>
          <SettingsIcon size={24} />
          <span className="text-[10px] font-bold mt-1">Settings</span>
        </button>
      </div>
    </div>
  );
};

const App = () => (
  <FleetProvider>
    <MainLayout />
  </FleetProvider>
);

export default App;
