import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarPlus, Sparkles } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="navbar-wrapper">
      <div className="navbar-container">
        <div className="brand-group">
          <div className="brand-badge">
            <Sparkles size={18} />
          </div>
          <div className="brand-titles">
            <span className="brand-name">EventHub</span>
            <span className="brand-sub">Admin Portal</span>
          </div>
        </div>

        <nav className="nav-tabs" aria-label="Main Navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/add"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <CalendarPlus size={18} />
            <span>Add Event</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
