import { NavLink } from 'react-router-dom';

// navbar with brand and navigation links
export default function Navbar() {
  return (
    <header className="navbar-wrapper">
      <div className="navbar-container">
        <NavLink to="/" className="brand-group">
          <img src="/logo.jpg" alt="GatherUp" className="brand-logo" />
          <div className="brand-titles">
            <span className="brand-name">Gather<span className="accent">Up</span></span>
            <span className="brand-sub">Admin Portal</span>
          </div>
        </NavLink>

        <nav className="nav-tabs">
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Dashboard
          </NavLink>
          <NavLink to="/add" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Add Event
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
