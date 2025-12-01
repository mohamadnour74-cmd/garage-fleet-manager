export type FleetType = 'VEHICLE' | 'EQUIPMENT';
export type FleetStatus = 'ACTIVE' | 'WORKSHOP' | 'OUT_OF_SERVICE';
export type MaintenanceType = 'SERVICE' | 'REPAIR' | 'INSPECTION';

export interface FleetItem {
  id: string;
  type: FleetType;
  make: string;
  model: string;
  year: number;
  plateOrSerial: string;
  currentMeter: number; // KM for vehicles, Hours for equipment
  status: FleetStatus;
  category: string;
  location: string;
  assignedTo?: string;
  technicalDetails?: {
    engineType?: string;
    vin?: string;
    tireSize?: string;
    fuelType?: string;
  };
}

export interface MaintenanceRecord {
  id: string;
  fleetItemId: string;
  date: string;
  meterReading: number;
  type: MaintenanceType;
  description: string;
  parts: string;
  laborCost: number;
  partsCost: number;
  totalCost: number;
  nextDueMeter?: number;
  nextDueDate?: string;
  technician?: string;
  attachments?: string[]; // Simplified for demo (URLs or placeholders)
}

export interface Settings {
  categories: string[];
  locations: string[];
  jobTypes: string[];
  accessPin: string;
}

export interface AISuggestion {
  diagnosis: string;
  estimatedHours: number;
  recommendedParts: string[];
}
