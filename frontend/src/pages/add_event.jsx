import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createEvent } from '../services/api';

// page to add event
export default function AddEvent({ showToast }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    venue: '',
    totalRegistrations: 0
  });

  const [errors, set_errors] = useState({});
  const [is_submitting, set_is_submitting] = useState(false);

  // validation check
  const checkForm = () => {
    let errs = {};
    if (!formData.name.trim()) errs.name = 'Event name is required';
    if (!formData.description.trim()) errs.description = 'Description is required';
    if (!formData.date) errs.date = 'Date is required';
    if (!formData.venue.trim()) errs.venue = 'Venue is required';
    set_errors(errs);
    return Object.keys(errs).length === 0;
  };

  const handle_change = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      set_errors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // on submit
  const handle_submit = async (e) => {
    e.preventDefault();
    if (!checkForm()) {
      showToast({ type: 'error', message: 'Please fill in all required fields' });
      return;
    }

    try {
      set_is_submitting(true);
      const res = await createEvent(formData);
      if (res.success) {
        showToast({ type: 'success', message: 'Event created!' });
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create event';
      showToast({ type: 'error', message: msg });
    } finally {
      set_is_submitting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="form-page-header">
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
        <h1 className="page-title">Create New Event</h1>
        <p className="page-subtitle">Fill in the details below to add a new event</p>
      </div>

      <div className="form-card-container">
        <form onSubmit={handle_submit} className="event-form" noValidate>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Event Name *</label>
            <input
              id="name" type="text" name="name"
              value={formData.name} onChange={handle_change}
              placeholder="e.g. National Hackathon 2026"
              className={`form-input ${errors.name ? 'input-error' : ''}`}
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="date" className="form-label">Event Date *</label>
              <input
                id="date" type="date" name="date"
                value={formData.date} onChange={handle_change}
                className={`form-input ${errors.date ? 'input-error' : ''}`}
              />
              {errors.date && <span className="field-error">{errors.date}</span>}
            </div>

            <div className="form-group flex-1">
              <label htmlFor="venue" className="form-label">Venue *</label>
              <input
                id="venue" type="text" name="venue"
                value={formData.venue} onChange={handle_change}
                placeholder="e.g. Main Auditorium"
                className={`form-input ${errors.venue ? 'input-error' : ''}`}
              />
              {errors.venue && <span className="field-error">{errors.venue}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">Description *</label>
            <textarea
              id="description" name="description" rows={4}
              value={formData.description} onChange={handle_change}
              placeholder="Write a short description about the event..."
              className={`form-textarea ${errors.description ? 'input-error' : ''}`}
            />
            {errors.description && <span className="field-error">{errors.description}</span>}
          </div>

          <div className="form-actions">
            <Link to="/dashboard" className="btn btn-secondary">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={is_submitting}>
              {is_submitting ? 'Saving...' : 'Save Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
