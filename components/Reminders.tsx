import React from 'react';
import { useFleet } from '../context/FleetContext';
import { AlertCircle, Calendar, CheckCircle } from 'lucide-react';

interface RemindersProps {
  onBack: () => void;
}

export const Reminders: React.FC<RemindersProps> = ({ onBack }) => {
  const { fleet, records } = useFleet();

  const reminderList = fleet.map(vehicle => {
    const lastRecord = records
      .filter(r => r.fleetItemId === vehicle.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    
    if (!lastRecord) return { vehicle, status: 'UNKNOWN', due: 'No records' };

    let isOverdue = false;
    let dueText = '';

    // Check by Date
    if (lastRecord.nextDueDate) {
      const today = new Date();
      const due = new Date(lastRecord.nextDueDate);
      if (today > due) isOverdue = true;
      dueText = due.toLocaleDateString();
    }
    // Check by Meter
    if (lastRecord.nextDueMeter && vehicle.currentMeter >= lastRecord.nextDueMeter) {
      isOverdue = true;
      dueText = `${lastRecord.nextDueMeter.toLocaleString()} km/hrs`;
    }

    return {
      vehicle,
      status: isOverdue ? 'OVERDUE' : 'OK',
      due: dueText,
      lastService: lastRecord.date
    };
  }).sort((a, b) => (a.status === 'OVERDUE' ? -1 : 1));

  return (
    <div className="h-full flex flex-col pb-20">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-4 text-blue-600 font-semibold">Back</button>
        <h1 className="text-2xl font-bold text-slate-800">Service Reminders</h1>
      </div>

      <div className="space-y-4 overflow-y-auto">
        {reminderList.map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
             <div className="flex items-center">
               {item.status === 'OVERDUE' ? (
                 <AlertCircle className="text-red-500 h-8 w-8 mr-4" />
               ) : (
                 <CheckCircle className="text-green-500 h-8 w-8 mr-4" />
               )}
               <div>
                 <h3 className="font-bold text-slate-800">{item.vehicle.make} {item.vehicle.model}</h3>
                 <p className="text-xs text-slate-500">{item.vehicle.plateOrSerial}</p>
                 <div className="flex gap-2 mt-1">
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">Last: {item.lastService}</span>
                 </div>
               </div>
             </div>
             <div className="text-right">
                <span className="block text-xs text-slate-400">Next Due</span>
                <span className={`font-bold ${item.status === 'OVERDUE' ? 'text-red-600' : 'text-slate-800'}`}>
                  {item.due}
                </span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};
