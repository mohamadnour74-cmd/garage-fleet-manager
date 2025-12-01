import React, { useRef, useState } from 'react';
import { useFleet } from '../context/FleetContext';
import { downloadTemplate, parseCSV, exportToCSV } from '../utils/csvUtils';
import { Download, Upload, FileSpreadsheet, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

export const SettingsPage = () => {
  const { fleet, importFleet, clearFleet } = useFleet();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const items = parseCSV(text);
        if (items.length === 0) {
            setMessage({ type: 'error', text: "No valid data found in CSV. Check the template." });
            return;
        }
        importFleet(items);
        setMessage({ type: 'success', text: `Successfully imported ${items.length} items!` });
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (err) {
        setMessage({ type: 'error', text: "Failed to parse CSV file." });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="h-full flex flex-col pb-20">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Settings</h1>

      <div className="space-y-6">
        {/* Data Management Card */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <FileSpreadsheet className="mr-2 h-5 w-5 text-green-600" /> 
            Data Management
          </h2>
          
          <p className="text-sm text-slate-500 mb-6">
            Import your fleet data from Excel (saved as CSV) or export your current data for backup.
          </p>

          <div className="space-y-4">
            {/* Download Template */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <h3 className="font-semibold text-slate-700">1. Download Template</h3>
                <p className="text-xs text-slate-500">Get the CSV format to fill in your data.</p>
              </div>
              <button 
                onClick={downloadTemplate}
                className="flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                <Download className="mr-2 h-4 w-4" /> Template
              </button>
            </div>

            {/* Import */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <h3 className="font-semibold text-slate-700">2. Import Fleet Data</h3>
                <p className="text-xs text-slate-500">Upload your filled CSV file.</p>
              </div>
              <div className="relative">
                <input 
                  type="file" 
                  accept=".csv"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  id="csv-upload"
                />
                <label 
                  htmlFor="csv-upload"
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-blue-700 transition"
                >
                  <Upload className="mr-2 h-4 w-4" /> Import CSV
                </label>
              </div>
            </div>

            {/* Export */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <h3 className="font-semibold text-slate-700">Export All Data</h3>
                <p className="text-xs text-slate-500">Download current fleet list as CSV.</p>
              </div>
              <button 
                onClick={() => exportToCSV(fleet)}
                className="flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                <Download className="mr-2 h-4 w-4" /> Export Data
              </button>
            </div>
          </div>

          {/* Messages */}
          {message && (
            <div className={`mt-4 p-3 rounded-lg flex items-center ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              {message.text}
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl border border-red-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-red-600 mb-4 flex items-center">
            <AlertCircle className="mr-2 h-5 w-5" /> 
            Danger Zone
          </h2>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Permanently delete all vehicles and records.</p>
            <button 
              onClick={clearFleet}
              className="flex items-center px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Reset App
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};