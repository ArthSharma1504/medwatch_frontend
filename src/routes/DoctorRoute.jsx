import { Routes, Route, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import PatientSearch from '../features/doctor/PatientSearch/PatientSearch';
import RealTimeMap from '../features/doctor/RealTimeMap/RealTimeMap';
import NetworkGraph from '../features/doctor/NetworkGraph/NetworkGraph';
import EquipmentCheck from '../features/doctor/EquipmentCheck/EquipmentCheck';
import Checklist from '../features/doctor/Checklist/Checklist';

const doctorMenuItems = [
  { path: '/search', label: 'Patient Search', icon: 'ri-search-line' },
  { path: '/map', label: 'Real-Time Map', icon: 'ri-map-pin-line' },
  { path: '/network', label: 'Contact Network', icon: 'ri-node-tree' },
  { path: '/equipment', label: 'Equipment Check', icon: 'ri-stethoscope-line' },
  { path: '/checklist', label: 'MDR Checklist', icon: 'ri-checkbox-multiple-line' },
];

const DoctorRoute = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Doctor Dashboard - MDR Contact Tracing" />
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar items={doctorMenuItems} type="doctor" />
        <main className="flex-1 p-6 overflow-auto bg-gray-100">
          <Routes>
            <Route path="/" element={<Navigate to="/doctor/search" replace />} />
            <Route path="/search" element={<PatientSearch />} />
            <Route path="/map" element={<RealTimeMap />} />
            <Route path="/network" element={<NetworkGraph />} />
            <Route path="/equipment" element={<EquipmentCheck />} />
            <Route path="/checklist" element={<Checklist />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default DoctorRoute;
