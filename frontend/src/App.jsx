import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/navbar';
import Toast from './components/toast_msg';
import Landing from './pages/landing_page';
import Dashboard from './pages/dashboard';
import AddEvent from './pages/add_event';
import EditEvent from './pages/edit_event';
import './App.css';

export default function App() {
  const [toast_data, set_toast_data] = useState(null);

  const showToast = (obj) => set_toast_data(obj);
  const closeToast = () => set_toast_data(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/*"
          element={
            <div className="app-shell">
              <Navbar />
              <main className="main-viewport">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard showToast={showToast} />} />
                  <Route path="/add" element={<AddEvent showToast={showToast} />} />
                  <Route path="/edit/:id" element={<EditEvent showToast={showToast} />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </main>
              <Toast toast={toast_data} onClose={closeToast} />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
