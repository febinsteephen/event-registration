import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, Users, Zap } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-shell">
      <div className="landing-bg-orb orb-1" />
      <div className="landing-bg-orb orb-2" />
      <div className="landing-bg-grid" />

      <div className="landing-content">
        <div className="landing-badge">
          <Zap size={13} />
          <span>Event Admin Portal</span>
        </div>

        <h1 className="landing-title">
          Gather<span className="title-accent">Up</span>
        </h1>

        <p className="landing-tagline">Manage events. Track registrations. Simply.</p>

        <button
          className="landing-cta"
          onClick={() => navigate('/dashboard')}
        >
          <span>Get Started</span>
          <ArrowRight size={18} />
        </button>

        <div className="landing-stats">
          <div className="landing-stat">
            <Calendar size={18} className="stat-ico" />
            <span>Create Events</span>
          </div>
          <div className="landing-divider" />
          <div className="landing-stat">
            <Users size={18} className="stat-ico" />
            <span>Track Registrations</span>
          </div>
          <div className="landing-divider" />
          <div className="landing-stat">
            <Zap size={18} className="stat-ico" />
            <span>Manage with Ease</span>
          </div>
        </div>
      </div>
    </div>
  );
}
