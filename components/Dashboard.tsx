import React, { useMemo } from 'react';
import { useFleet } from '../context/FleetContext';
import { 
  Truck, 
  Wrench, 
  AlertTriangle, 
  PlusCircle, 
  Activity,
  ClipboardList
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { fleet, records } = useFleet();

  const stats = useMemo(() => {
    const totalVehicles = fleet.filter(i => i.type === 'VEHICLE').length;
    const totalEquipment = fleet.filter(i => i.type === 'EQUIPMENT').length;
    const inWorkshop = fleet.filter(i => i.status === 'WORKSHOP').length;
    
    // Simple logic for "upcoming" - tasks due within 30 days or 1000km (Mock logic)
    const upcomingServices = fleet.filter(f => {
      const lastRecord = records
        .filter(r => r.fleetItemId === f.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      
      if (!lastRecord || !lastRecord.nextDueDate) return false;
      const daysUntil = (new Date(lastRecord.nextDueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24);
      return daysUntil <= 30 && daysUntil >= 0;
    }).length;

    return { totalVehicles, totalEquipment, inWorkshop, upcomingServices };
  }, [fleet, records]);

  return (
    <div className="space-y-6 pb-20">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm">Welcome back, Manager</p>
        </div>
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
          Internal Use
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center hover:shadow-md transition">
          <Truck className="h-8 w-8 text-blue-500 mb-2" />
          <span className="text-2xl font-bold text-slate-800">{stats.totalVehicles}</span>
          <span className="text-xs text-slate-500">Vehicles</span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center hover:shadow-md transition">
          <Activity className="h-8 w-8 text-orange-500 mb-2" />
          <span className="text-2xl font-bold text-slate-800">{stats.totalEquipment}</span>
          <span className="text-xs text-slate-500">Equipment</span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center hover:shadow-md transition">
          <Wrench className="h-8 w-8 text-red-500 mb-2" />
          <span className="text-2xl font-bold text-slate-800">{stats.inWorkshop}</span>
          <span className="text-xs text-slate-500">In Workshop</span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center hover:shadow-md transition">
          <AlertTriangle className="h-8 w-8 text-yellow-500 mb-2" />
          <span className="text-2xl font-bold text-slate-800">{stats.upcomingServices}</span>
          <span className="text-xs text-slate-500">Due Soon</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={() => onNavigate('new-vehicle')}
          className="flex items-center justify-center p-4 bg-blue-600 text-white rounded-xl shadow-md active:bg-blue-700 transition"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Add New Vehicle / Equipment
        </button>
        <button 
          onClick={() => onNavigate('reminders')}
          className="flex items-center justify-center p-4 bg-white text-slate-700 border border-slate-200 rounded-xl shadow-sm active:bg-slate-50 transition"
        >
          <ClipboardList className="mr-2 h-5 w-5 text-slate-500" />
          View Upcoming Services
        </button>
      </div>

      {/* Recent Activity Mini List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Maintenance</h3>
        <div className="space-y-4">
          {records.slice(0, 3).map(rec => {
             const vehicle = fleet.find(f => f.id === rec.fleetItemId);
             return (
               <div key={rec.id} className="flex items-start pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                 <div className={`p-2 rounded-full mr-3 ${rec.type === 'REPAIR' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                   <Wrench className="h-4 w-4" />
                 </div>
                 <div>
                   <p className="font-medium text-slate-900">{vehicle?.make} {vehicle?.model}</p>
                   <p className="text-sm text-slate-500">{rec.description} • {rec.date}</p>
                 </div>
                 <div className="ml-auto font-bold text-slate-700">
                   ${rec.totalCost}
                 </div>
               </div>
             );
          })}
          {records.length === 0 && <p className="text-slate-400 text-sm">No records found.</p>}
        </div>
      </div>
    </div>
  );
};
