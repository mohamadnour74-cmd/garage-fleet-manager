import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { FleetItem, MaintenanceRecord, Settings } from '../types';
import { INITIAL_FLEET, INITIAL_RECORDS, MOCK_SETTINGS } from '../constants';

interface FleetContextType {
  fleet: FleetItem[];
  records: MaintenanceRecord[];
  settings: Settings;
  addFleetItem: (item: FleetItem) => void;
  updateFleetItem: (item: FleetItem) => void;
  deleteFleetItem: (id: string) => void;
  importFleet: (items: FleetItem[]) => void;
  clearFleet: () => void;
  addRecord: (record: MaintenanceRecord) => void;
  getFleetHistory: (itemId: string) => MaintenanceRecord[];
}

const FleetContext = createContext<FleetContextType | undefined>(undefined);

interface FleetProviderProps {
  children: ReactNode;
}

export const FleetProvider: React.FC<FleetProviderProps> = ({ children }) => {
  const [fleet, setFleet] = useState<FleetItem[]>(() => {
    const saved = localStorage.getItem('fleet');
    return saved ? JSON.parse(saved) : INITIAL_FLEET;
  });

  const [records, setRecords] = useState<MaintenanceRecord[]>(() => {
    const saved = localStorage.getItem('records');
    return saved ? JSON.parse(saved) : INITIAL_RECORDS;
  });

  const [settings, setSettings] = useState<Settings>(MOCK_SETTINGS);

  useEffect(() => {
    localStorage.setItem('fleet', JSON.stringify(fleet));
  }, [fleet]);

  useEffect(() => {
    localStorage.setItem('records', JSON.stringify(records));
  }, [records]);

  const addFleetItem = (item: FleetItem) => {
    setFleet((prev) => [...prev, item]);
  };

  const updateFleetItem = (updatedItem: FleetItem) => {
    setFleet((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
  };

  const deleteFleetItem = (id: string) => {
    setFleet((prev) => prev.filter((item) => item.id !== id));
    setRecords((prev) => prev.filter((r) => r.fleetItemId !== id));
  };

  const importFleet = (newItems: FleetItem[]) => {
    setFleet((prev) => {
      // Filter out duplicates based on plate/serial if they already exist
      const existingIds = new Set(prev.map(i => i.plateOrSerial.toLowerCase()));
      const uniqueNewItems = newItems.filter(i => !existingIds.has(i.plateOrSerial.toLowerCase()));
      return [...prev, ...uniqueNewItems];
    });
  };

  const clearFleet = () => {
    if (window.confirm("Are you sure you want to delete all vehicles and records? This cannot be undone.")) {
      setFleet([]);
      setRecords([]);
    }
  };

  const addRecord = (record: MaintenanceRecord) => {
    setRecords((prev) => [...prev, record]);
    const fleetItem = fleet.find(f => f.id === record.fleetItemId);
    if (fleetItem) {
        const newMeter = Math.max(fleetItem.currentMeter, record.meterReading);
        updateFleetItem({ ...fleetItem, currentMeter: newMeter });
    }
  };

  const getFleetHistory = (itemId: string) => {
    return records
      .filter((r) => r.fleetItemId === itemId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  return (
    <FleetContext.Provider
      value={{
        fleet,
        records,
        settings,
        addFleetItem,
        updateFleetItem,
        deleteFleetItem,
        importFleet,
        clearFleet,
        addRecord,
        getFleetHistory,
      }}
    >
      {children}
    </FleetContext.Provider>
  );
};

export const useFleet = () => {
  const context = useContext(FleetContext);
  if (!context) throw new Error('useFleet must be used within a FleetProvider');
  return context;
};