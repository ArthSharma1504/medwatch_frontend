import { create } from 'zustand';

const useAppStore = create((set, get) => ({
  // Users
  users: [
    { id: 1, name: 'Dr. Amit Sharma', role: 'Doctor', email: 'amit@hospital.com', active: true },
    { id: 2, name: 'Nurse Priya Singh', role: 'Nurse', email: 'priya@hospital.com', active: true },
    { id: 3, name: 'Receptionist Raj', role: 'Receptionist', email: 'raj@hospital.com', active: true },
  ],
  addUser: (user) => set((state) => ({ users: [...state.users, { ...user, id: Date.now() }] })),
  updateUser: (id, updates) => set((state) => ({
    users: state.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
  })),
  deleteUser: (id) => set((state) => ({ users: state.users.filter((u) => u.id !== id) })),

  // Patients
  patients: [
    {
      id: 'P001',
      name: 'Ramesh Kumar',
      age: 45,
      status: 'red',
      mdrStatus: 'Confirmed',
      room: 'R101',
      lastContact: '2025-11-09T14:30:00',
    },
    {
      id: 'P002',
      name: 'Sunita Devi',
      age: 38,
      status: 'yellow',
      mdrStatus: 'Contact',
      room: 'R102',
      lastContact: '2025-11-09T16:00:00',
    },
    {
      id: 'P003',
      name: 'Vikram Patel',
      age: 52,
      status: 'green',
      mdrStatus: 'Safe',
      room: 'R103',
      lastContact: '2025-11-10T09:15:00',
    },
  ],
  addPatient: (patient) => set((state) => ({ patients: [...state.patients, patient] })),
  updatePatient: (id, updates) => set((state) => ({
    patients: state.patients.map((p) => (p.id === id ? { ...p, ...updates } : p)),
  })),

  // Alerts
  alerts: [
    {
      id: 1,
      type: 'MDR Lab Result Posted',
      message: 'MDR positive result for Patient P001 - Ramesh Kumar',
      timestamp: '2025-11-10T08:30:00',
      read: false,
      priority: 'high',
    },
    {
      id: 2,
      type: 'Isolation Breach',
      message: 'Patient P002 left isolation room R102',
      timestamp: '2025-11-10T10:15:00',
      read: false,
      priority: 'critical',
    },
  ],
  addAlert: (alert) => set((state) => ({ alerts: [{ ...alert, id: Date.now() }, ...state.alerts] })),
  markAlertRead: (id) => set((state) => ({
    alerts: state.alerts.map((a) => (a.id === id ? { ...a, read: true } : a)),
  })),

  // Alert Rules
  alertRules: [
    {
      id: 1,
      trigger: 'MDR Lab Result Posted',
      teams: ['Doctors', 'Admin'],
      enabled: true,
    },
    {
      id: 2,
      trigger: 'Isolation Breach',
      teams: ['Nurses', 'Security', 'Admin'],
      enabled: true,
    },
  ],
  addAlertRule: (rule) => set((state) => ({ alertRules: [...state.alertRules, { ...rule, id: Date.now() }] })),
  updateAlertRule: (id, updates) => set((state) => ({
    alertRules: state.alertRules.map((r) => (r.id === id ? { ...r, ...updates } : r)),
  })),

  // Map Configuration
  mapConfig: {
    blueprint: null,
    rooms: [
      { id: 'R101', name: 'ICU-1', rfidEnabled: true, coordinates: { x: 50, y: 50, width: 100, height: 80 } },
      { id: 'R102', name: 'Ward A', rfidEnabled: true, coordinates: { x: 200, y: 50, width: 120, height: 80 } },
      { id: 'R103', name: 'Ward B', rfidEnabled: false, coordinates: { x: 50, y: 180, width: 120, height: 80 } },
    ],
  },
  updateMapConfig: (config) => set({ mapConfig: config }),
  addRoom: (room) => set((state) => ({
    mapConfig: {
      ...state.mapConfig,
      rooms: [...state.mapConfig.rooms, room],
    },
  })),

  // Equipment
  equipment: [
    {
      id: 'EQ001',
      name: 'Ventilator-A',
      lastUsers: [
        { userId: 'P001', userName: 'Ramesh Kumar', timestamp: '2025-11-09T14:00:00', status: 'red' },
        { userId: 'P002', userName: 'Sunita Devi', timestamp: '2025-11-09T16:30:00', status: 'yellow' },
      ],
      contaminated: true,
      action: 'Replace',
    },
    {
      id: 'EQ002',
      name: 'X-Ray Machine',
      lastUsers: [
        { userId: 'P003', userName: 'Vikram Patel', timestamp: '2025-11-10T09:00:00', status: 'green' },
      ],
      contaminated: false,
      action: 'Clean',
    },
  ],
  addEquipmentUsage: (equipmentId, usage) => set((state) => ({
    equipment: state.equipment.map((eq) =>
      eq.id === equipmentId
        ? { ...eq, lastUsers: [usage, ...eq.lastUsers].slice(0, 5) }
        : eq
    ),
  })),

  // Contact Tracing Data
  contactData: [
    // P001 (Ramesh Kumar - MDR+) contacts
    { personId: 'P001', contactId: 'P002', roomId: 'R101', timestamp: '2025-11-09T14:30:00', duration: 30 },
    { personId: 'P001', contactId: 'P004', roomId: 'R101', timestamp: '2025-11-09T15:00:00', duration: 45 },
    { personId: 'P001', contactId: 'D001', roomId: 'R101', timestamp: '2025-11-09T14:00:00', duration: 60 },
    { personId: 'P001', equipmentId: 'EQ001', roomId: 'R101', timestamp: '2025-11-09T14:00:00' },
    
    // P002 (Sunita Devi) contacts
    { personId: 'P002', contactId: 'P003', roomId: 'R102', timestamp: '2025-11-09T16:00:00', duration: 20 },
    { personId: 'P002', equipmentId: 'EQ001', roomId: 'R102', timestamp: '2025-11-09T16:30:00' },
    
    // Additional contacts
    { personId: 'P003', equipmentId: 'EQ002', roomId: 'R103', timestamp: '2025-11-10T09:00:00' },
    { personId: 'P004', contactId: 'P005', roomId: 'R101', timestamp: '2025-11-09T17:00:00', duration: 15 },
  ],
  setContactData: (data) => set({ contactData: data }),

  // System Health
  systemHealth: {
    emrStatus: 'Connected',
    labStatus: 'Connected',
    rfidStatus: 'Connected',
    lastSync: '2025-11-10T11:30:00',
  },
  updateSystemHealth: (health) => set({ systemHealth: health }),

  // Isolation Checklist
  isolationChecklists: {},
  updateChecklist: (patientId, checklist) => set((state) => ({
    isolationChecklists: {
      ...state.isolationChecklists,
      [patientId]: checklist,
    },
  })),
}));

export default useAppStore;
