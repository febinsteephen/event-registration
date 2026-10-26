import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import AddEvent from './pages/AddEvent';
import EditEvent from './pages/EditEvent';
import './App.css';

export default function App() {
  const [toast, setToast] = useState(null);

  const showToast = (toastObj) => setToast(toastObj);
  const closeToast = () => setToast(null);

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
              <Toast toast={toast} onClose={closeToast} />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
