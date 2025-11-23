import { Routes, Route, Navigate } from 'react-router-dom';
import AdminRoute from './routes/AdminRoute';
import DoctorRoute from './routes/DoctorRoute';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/doctor" replace />} />
        <Route path="/admin/*" element={<AdminRoute />} />
        <Route path="/doctor/*" element={<DoctorRoute />} />
      </Routes>
    </div>
  );
}

export default App;
