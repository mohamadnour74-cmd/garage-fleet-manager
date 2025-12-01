import React, { useState } from 'react';
import { useFleet } from '../context/FleetContext';
import { FleetItem, MaintenanceRecord, MaintenanceType } from '../types';
import { analyzeMaintenanceIssue } from '../services/geminiService';
import { ArrowLeft, Save, Sparkles, Loader2 } from 'lucide-react';

interface MaintenanceFormProps {
  itemId: string;
  initialType: MaintenanceType;
  onBack: () => void;
  onSuccess: () => void;
}

export const MaintenanceForm: React.FC<MaintenanceFormProps> = ({ itemId, initialType, onBack, onSuccess }) => {
  const { fleet, addRecord } = useFleet();
  const vehicle = fleet.find(f => f.id === itemId);

  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{ diagnosis: string; steps: string[] } | null>(null);

  const [formData, setFormData] = useState<Partial<MaintenanceRecord>>({
    date: new Date().toISOString().split('T')[0],
    meterReading: vehicle?.currentMeter || 0,
    type: initialType,
    description: '',
    parts: '',
    laborCost: 0,
    partsCost: 0,
    technician: ''
  });

  const handleAIAnalysis = async () => {
    if (!formData.description || !vehicle) return;
    setIsLoadingAI(true);
    setAiAnalysis(null);
    
    const result = await analyzeMaintenanceIssue(vehicle, formData.description);
    if (result) {
      setAiAnalysis(result);
    }
    setIsLoadingAI(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle) return;

    const totalCost = Number(formData.laborCost) + Number(formData.partsCost);
    const newRecord: MaintenanceRecord = {
      id: Date.now().toString(),
      fleetItemId: vehicle.id,
      date: formData.date!,
      meterReading: Number(formData.meterReading),
      type: formData.type as MaintenanceType,
      description: formData.description!,
      parts: formData.parts || 'None',
      laborCost: Number(formData.laborCost),
      partsCost: Number(formData.partsCost),
      totalCost,
      technician: formData.technician,
      // Simple logic for next due: +10,000 km or 500 hours
      nextDueMeter: formData.type === 'REPAIR' ? undefined : Number(formData.meterReading) + (vehicle.type === 'VEHICLE' ? 10000 : 500),
      nextDueDate: formData.type === 'REPAIR' ? undefined : new Date(new Date(formData.date!).setFullYear(new Date(formData.date!).getFullYear() + 1)).toISOString().split('T')[0]
    };

    addRecord(newRecord);
    onSuccess();
  };

  if (!vehicle) return <div>Vehicle not found</div>;

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white p-4 border-b border-slate-100 flex items-center justify-between">
        <button onClick={onBack} className="text-slate-600">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <span className="font-semibold text-slate-800">
          {formData.type === 'REPAIR' ? 'Report Breakdown' : 'Log Maintenance'}
        </span>
        <div className="w-6" /> {/* Spacer */}
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        
        {/* Basic Details */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 space-y-4">
          <h3 className="font-bold text-slate-700">{vehicle.make} {vehicle.model} ({vehicle.plateOrSerial})</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Date</label>
              <input 
                type="date" 
                required
                className="w-full p-2 border rounded-lg bg-slate-50"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Current Reading</label>
              <input 
                type="number" 
                required
                className="w-full p-2 border rounded-lg bg-slate-50"
                value={formData.meterReading}
                onChange={e => setFormData({...formData, meterReading: Number(e.target.value)})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Job Type</label>
            <select 
              className="w-full p-2 border rounded-lg bg-slate-50"
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value as MaintenanceType})}
            >
              <option value="SERVICE">Routine Service (Preventive)</option>
              <option value="INSPECTION">Inspection</option>
              <option value="REPAIR">Repair (Breakdown/Corrective)</option>
            </select>
          </div>
        </div>

        {/* Description & AI */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              {formData.type === 'REPAIR' ? 'Issue Description / Failure Reason' : 'Service Tasks Performed'}
            </label>
            <textarea 
              className="w-full p-3 border rounded-lg bg-slate-50 h-24"
              placeholder={formData.type === 'REPAIR' ? "e.g. Engine overheating, flat tire..." : "e.g. Oil change, filter replacement..."}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {/* AI Helper Button */}
          {process.env.API_KEY && (
            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-800 flex items-center">
                  <Sparkles className="h-3 w-3 mr-1" /> Gemini Mechanic AI
                </span>
                <button 
                  type="button"
                  onClick={handleAIAnalysis}
                  disabled={isLoadingAI || !formData.description}
                  className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-md disabled:opacity-50"
                >
                  {isLoadingAI ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Analyze Issue'}
                </button>
              </div>
              
              {aiAnalysis && (
                <div className="text-xs text-indigo-900 mt-2 space-y-2">
                  <p><strong>Possible Diagnosis:</strong> {aiAnalysis.diagnosis}</p>
                  <ul className="list-disc pl-4 space-y-1">
                    {aiAnalysis.steps.map((step, i) => <li key={i}>{step}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Costs */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Parts Used</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded-lg bg-slate-50"
              placeholder="Comma separated parts"
              value={formData.parts}
              onChange={e => setFormData({...formData, parts: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Parts Cost ($)</label>
              <input 
                type="number" 
                className="w-full p-2 border rounded-lg bg-slate-50"
                value={formData.partsCost}
                onChange={e => setFormData({...formData, partsCost: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Labor Cost ($)</label>
              <input 
                type="number" 
                className="w-full p-2 border rounded-lg bg-slate-50"
                value={formData.laborCost}
                onChange={e => setFormData({...formData, laborCost: Number(e.target.value)})}
              />
            </div>
          </div>
           
           <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Technician</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-lg bg-slate-50"
                placeholder="Name"
                value={formData.technician}
                onChange={e => setFormData({...formData, technician: e.target.value})}
              />
            </div>
        </div>

        <button 
          type="submit"
          className={`w-full py-4 rounded-xl font-bold shadow-lg active:scale-[0.98] transition flex items-center justify-center text-white ${formData.type === 'REPAIR' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          <Save className="h-5 w-5 mr-2" /> 
          {formData.type === 'REPAIR' ? 'Save Breakdown Record' : 'Save Maintenance Record'}
        </button>
      </form>
    </div>
  );
};