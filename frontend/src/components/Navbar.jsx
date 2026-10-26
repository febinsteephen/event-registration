import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarPlus, Zap } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="navbar-wrapper">
      <div className="navbar-container">
        <NavLink to="/" className="brand-group">
          <div className="brand-badge">
            <img src="/logo.jpg" alt="GatherUp logo" className="brand-logo" />
          </div>
          <div className="brand-titles">
            <span className="brand-name">Gather<span className="brand-accent">Up</span></span>
            <span className="brand-sub">Admin Portal</span>
          </div>
        </NavLink>

        <nav className="nav-tabs" aria-label="Main Navigation">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={17} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/add"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <CalendarPlus size={17} />
            <span>Add Event</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
