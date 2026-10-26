import { useNavigate } from 'react-router-dom';

// home landing
export default function Landing() {
  const nav = useNavigate();

  return (
    <div className="landing-page">
      <div className="landing-center">
        <img src="/logo.jpg" alt="GatherUp" className="landing-logo" />
        <h1 className="landing-title">
          Gather<span className="accent">Up</span>
        </h1>
          <p className="landing-desc">Manage events. Track registrations. Simply.</p>
        <button className="landing-btn" onClick={() => nav('/dashboard')}>
          Get Started →
        </button>
      </div>
    </div>
  );
}
