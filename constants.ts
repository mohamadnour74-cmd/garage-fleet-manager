import { FleetItem, MaintenanceRecord, Settings } from './types';

export const MOCK_SETTINGS: Settings = {
  categories: ['Sedan', 'Pickup Truck', 'Excavator', 'Forklift', 'Generator'],
  locations: ['Main HQ', 'North Site', 'South Depot'],
  jobTypes: ['Routine Service', 'Breakdown', 'Tire Change', 'Oil Change'],
  accessPin: '1234'
};

export const INITIAL_FLEET: FleetItem[] = [
  {
    id: 'v1',
    type: 'VEHICLE',
    make: 'Toyota',
    model: 'Hilux',
    year: 2022,
    plateOrSerial: 'DXB-10293',
    currentMeter: 45000,
    status: 'ACTIVE',
    category: 'Pickup Truck',
    location: 'Main HQ',
    assignedTo: 'John Doe',
    technicalDetails: { vin: 'JTE12345678', fuelType: 'Diesel' }
  },
  {
    id: 'e1',
    type: 'EQUIPMENT',
    make: 'CAT',
    model: '320 GC',
    year: 2020,
    plateOrSerial: 'CAT-EX-99',
    currentMeter: 3200,
    status: 'WORKSHOP',
    category: 'Excavator',
    location: 'North Site',
    assignedTo: 'Site A Team'
  },
    {
    id: 'v2',
    type: 'VEHICLE',
    make: 'Ford',
    model: 'F-150',
    year: 2023,
    plateOrSerial: 'ABD-5544',
    currentMeter: 12000,
    status: 'ACTIVE',
    category: 'Pickup Truck',
    location: 'South Depot',
    assignedTo: 'Jane Smith'
  }
];

export const INITIAL_RECORDS: MaintenanceRecord[] = [
  {
    id: 'r1',
    fleetItemId: 'v1',
    date: '2023-10-15',
    meterReading: 40000,
    type: 'SERVICE',
    description: 'Regular 40k Service',
    parts: 'Oil Filter, Air Filter, 5W-30 Oil',
    laborCost: 150,
    partsCost: 200,
    totalCost: 350,
    nextDueMeter: 50000,
    technician: 'Mike'
  },
  {
    id: 'r2',
    fleetItemId: 'e1',
    date: '2023-10-20',
    meterReading: 3150,
    type: 'REPAIR',
    description: 'Hydraulic leak fix',
    parts: 'Hose Assembly, O-rings',
    laborCost: 400,
    partsCost: 150,
    totalCost: 550,
    technician: 'Sarah'
  }
];
