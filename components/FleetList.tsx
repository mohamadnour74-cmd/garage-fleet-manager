import React, { useState } from 'react';
import { useFleet } from '../context/FleetContext';
import { FleetItem, FleetStatus } from '../types';
import { Search, Filter, Car, Zap, MoreHorizontal } from 'lucide-react';

interface FleetListProps {
  onSelect: (id: string) => void;
}

export const FleetList: React.FC<FleetListProps> = ({ onSelect }) => {
  const { fleet } = useFleet();
  const [activeTab, setActiveTab] = useState<'VEHICLE' | 'EQUIPMENT'>('VEHICLE');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FleetStatus | 'ALL'>('ALL');

  const filteredFleet = fleet.filter(item => {
    const matchesTab = item.type === activeTab;
    const matchesSearch = 
      item.make.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.plateOrSerial.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;
    
    return matchesTab && matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: FleetStatus) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-700 border-green-200';
      case 'WORKSHOP': return 'bg-red-100 text-red-700 border-red-200';
      case 'OUT_OF_SERVICE': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  return (
    <div className="h-full flex flex-col pb-20">
      <h1 className="text-2xl font-bold text-slate-800 mb-4">Fleet</h1>
      
      {/* Search & Filter */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input 
            type="text" 
            placeholder="Search plate, make, model..." 
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
          <Filter className="h-5 w-5 text-slate-600" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-200 rounded-xl mb-6">
        <button 
          onClick={() => setActiveTab('VEHICLE')}
          className={`flex-1 flex items-center justify-center py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'VEHICLE' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}`}
        >
          <Car className="mr-2 h-4 w-4" /> Vehicles
        </button>
        <button 
          onClick={() => setActiveTab('EQUIPMENT')}
          className={`flex-1 flex items-center justify-center py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'EQUIPMENT' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}`}
        >
          <Zap className="mr-2 h-4 w-4" /> Equipment
        </button>
      </div>

      {/* Status Chips Filter (Simple version) */}
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
        {['ALL', 'ACTIVE', 'WORKSHOP', 'OUT_OF_SERVICE'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status as any)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition ${filterStatus === status ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200'}`}
          >
            {status.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {filteredFleet.map(item => (
          <div 
            key={item.id}
            onClick={() => onSelect(item.id)}
            className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 active:scale-[0.98] transition cursor-pointer flex justify-between items-center"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-slate-900 text-lg">{item.make} {item.model}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusColor(item.status)}`}>
                  {item.status.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-slate-500 text-sm font-mono">{item.plateOrSerial}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                <span>{item.year}</span>
                <span>•</span>
                <span>{item.currentMeter.toLocaleString()} {item.type === 'VEHICLE' ? 'km' : 'hrs'}</span>
                <span>•</span>
                <span>{item.location}</span>
              </div>
            </div>
            <MoreHorizontal className="text-slate-300" />
          </div>
        ))}
        {filteredFleet.length === 0 && (
          <div className="text-center py-10 text-slate-400">
            <p>No items found.</p>
          </div>
        )}
      </div>
    </div>
  );
};
