import React, { useMemo, useState } from 'react';
import { useFleet } from '../context/FleetContext';
import { FleetStatus, MaintenanceType } from '../types';
import { ArrowLeft, Calendar, User, MapPin, Gauge, Plus, Wrench, AlertTriangle, CheckCircle2, ClipboardList, Trash2, Edit } from 'lucide-react';

interface FleetDetailProps {
  itemId: string;
  onBack: () => void;
  onEdit: () => void;
  onAddMaintenance: (id: string, type: MaintenanceType) => void;
}

export const FleetDetail: React.FC<FleetDetailProps> = ({ itemId, onBack, onEdit, onAddMaintenance }) => {
  const { fleet, getFleetHistory, deleteFleetItem } = useFleet();
  const [activeTab, setActiveTab] = useState<'REPAIRS' | 'ROUTINE'>('REPAIRS');
  
  const item = fleet.find(f => f.id === itemId);
  const fullHistory = useMemo(() => getFleetHistory(itemId), [itemId, getFleetHistory]);

  const repairHistory = fullHistory.filter(r => r.type === 'REPAIR');
  const routineHistory = fullHistory.filter(r => r.type !== 'REPAIR');

  if (!item) return <div>Item not found</div>;

  const getStatusColor = (status: FleetStatus) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-600 bg-green-50 border-green-200';
      case 'WORKSHOP': return 'text-red-600 bg-red-50 border-red-200';
      case 'OUT_OF_SERVICE': return 'text-slate-600 bg-slate-50 border-slate-200';
      default: return 'text-slate-500';
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${item.make} ${item.model} (${item.plateOrSerial})? This action cannot be undone.`)) {
      deleteFleetItem(item.id);
      onBack();
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white p-4 sticky top-0 z-10 border-b border-slate-100 flex items-center justify-between">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <span className="font-semibold text-slate-800">Vehicle Details</span>
        <div className="flex gap-2">
          <button 
            onClick={handleDelete} 
            className="p-2 text-red-500 hover:bg-red-50 rounded-full"
            title="Delete Vehicle"
          >
            <Trash2 className="h-5 w-5" />
          </button>
          <button 
            onClick={onEdit} 
            className="p-2 -mr-2 text-blue-600 hover:bg-blue-50 rounded-full"
            title="Edit Details"
          >
            <Edit className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Main Info Card */}
        <div className="bg-white p-6 mb-4 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{item.make} {item.model}</h1>
              <p className="text-slate-500 font-mono text-lg">{item.plateOrSerial}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(item.status)}`}>
              {item.status}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex items-center text-slate-600 text-sm">
              <Calendar className="h-4 w-4 mr-2 text-slate-400" />
              {item.year}
            </div>
            <div className="flex items-center text-slate-600 text-sm">
              <MapPin className="h-4 w-4 mr-2 text-slate-400" />
              {item.location}
            </div>
            <div className="flex items-center text-slate-600 text-sm">
              <Gauge className="h-4 w-4 mr-2 text-slate-400" />
              {item.currentMeter.toLocaleString()} {item.type === 'VEHICLE' ? 'km' : 'hrs'}
            </div>
            <div className="flex items-center text-slate-600 text-sm">
              <User className="h-4 w-4 mr-2 text-slate-400" />
              {item.assignedTo || 'Unassigned'}
            </div>
          </div>
          
           <div className="mt-6 pt-4 border-t border-slate-100">
             <h3 className="text-xs font-bold uppercase text-slate-400 mb-2">Technical Specs</h3>
             <div className="grid grid-cols-2 gap-y-2 text-sm text-slate-700">
                <p><span className="text-slate-400">Category:</span> {item.category}</p>
                <p><span className="text-slate-400">VIN:</span> {item.technicalDetails?.vin || 'N/A'}</p>
                <p><span className="text-slate-400">Engine:</span> {item.technicalDetails?.engineType || 'N/A'}</p>
                <p><span className="text-slate-400">Fuel:</span> {item.technicalDetails?.fuelType || 'N/A'}</p>
             </div>
          </div>
        </div>

        {/* Tabs for History */}
        <div className="px-4 mb-4">
          <div className="flex p-1 bg-slate-200 rounded-xl">
            <button
              onClick={() => setActiveTab('REPAIRS')}
              className={`flex-1 flex items-center justify-center py-2.5 rounded-lg text-sm font-bold transition ${activeTab === 'REPAIRS' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <AlertTriangle className="mr-2 h-4 w-4" /> Breakdowns & Repairs
            </button>
            <button
              onClick={() => setActiveTab('ROUTINE')}
              className={`flex-1 flex items-center justify-center py-2.5 rounded-lg text-sm font-bold transition ${activeTab === 'ROUTINE' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <ClipboardList className="mr-2 h-4 w-4" /> Routine Maint.
            </button>
          </div>
        </div>

        {/* Dynamic Content Based on Tab */}
        <div className="px-4 pb-10">
          
          {/* REPAIRS SECTION */}
          {activeTab === 'REPAIRS' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-bold text-slate-800">Repair History</h3>
                 <button 
                   onClick={() => onAddMaintenance(item.id, 'REPAIR')}
                   className="flex items-center bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm active:bg-red-700"
                 >
                   <Plus className="h-4 w-4 mr-1" /> Add Repair
                 </button>
               </div>
               
               <div className="space-y-4">
                 {repairHistory.map((rec) => (
                   <div key={rec.id} className="bg-white p-4 rounded-xl border border-red-100 shadow-sm relative overflow-hidden">
                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                     <div className="flex justify-between items-start mb-2 pl-2">
                       <span className="text-xs font-bold text-slate-500">{rec.date}</span>
                       <span className="text-sm font-bold text-slate-900">${rec.totalCost.toLocaleString()}</span>
                     </div>
                     <div className="pl-2">
                        <h4 className="font-bold text-slate-800 text-base">{rec.description}</h4>
                        <p className="text-xs text-slate-500 mt-1">Reading: {rec.meterReading.toLocaleString()}</p>
                        {rec.parts && <p className="text-sm text-slate-700 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100"><strong>Parts:</strong> {rec.parts}</p>}
                        {rec.technician && <div className="mt-2 flex items-center text-xs text-slate-500"><User className="h-3 w-3 mr-1"/> Tech: {rec.technician}</div>}
                     </div>
                   </div>
                 ))}
                 {repairHistory.length === 0 && (
                   <div className="text-center py-10 bg-slate-100 rounded-xl border border-dashed border-slate-300">
                     <Wrench className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                     <p className="text-slate-500">No breakdown records found.</p>
                   </div>
                 )}
               </div>
            </div>
          )}

          {/* ROUTINE SECTION */}
          {activeTab === 'ROUTINE' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-bold text-slate-800">Service Log</h3>
                 <button 
                   onClick={() => onAddMaintenance(item.id, 'SERVICE')}
                   className="flex items-center bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm active:bg-blue-700"
                 >
                   <Plus className="h-4 w-4 mr-1" /> Log Service
                 </button>
               </div>

               <div className="space-y-4">
                 {routineHistory.map((rec) => (
                   <div key={rec.id} className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm relative overflow-hidden">
                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                     <div className="flex justify-between items-start mb-2 pl-2">
                       <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500">{rec.date}</span>
                          <span className="text-[10px] uppercase font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{rec.type}</span>
                       </div>
                       <span className="text-sm font-bold text-slate-900">${rec.totalCost.toLocaleString()}</span>
                     </div>
                     <div className="pl-2">
                        <h4 className="font-bold text-slate-800">{rec.description}</h4>
                        <div className="flex gap-4 mt-2">
                          <p className="text-xs text-slate-500">At: {rec.meterReading.toLocaleString()}</p>
                          {rec.nextDueMeter && <p className="text-xs text-blue-600 font-semibold">Next Due: {rec.nextDueMeter.toLocaleString()}</p>}
                        </div>
                        {rec.parts && <p className="text-xs text-slate-500 mt-2">Parts: {rec.parts}</p>}
                     </div>
                   </div>
                 ))}
                 {routineHistory.length === 0 && (
                   <div className="text-center py-10 bg-slate-100 rounded-xl border border-dashed border-slate-300">
                     <CheckCircle2 className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                     <p className="text-slate-500">No routine maintenance records found.</p>
                   </div>
                 )}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
