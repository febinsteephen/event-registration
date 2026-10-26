import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, AlignLeft, Tag, ArrowLeft, Send } from 'lucide-react';
import { createEvent } from '../services/api';

export default function AddEvent({ showToast }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    venue: '',
    totalRegistrations: 0
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Event name is required';
    if (!formData.description.trim()) errs.description = 'Event description is required';
    if (!formData.date) errs.date = 'Event date is required';
    if (!formData.venue.trim()) errs.venue = 'Venue location is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast({ type: 'error', message: 'Please fill in all required fields' });
      return;
    }

    try {
      setSubmitting(true);
      const res = await createEvent(formData);
      if (res.success) {
        showToast({ type: 'success', message: 'Event successfully created!' });
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create event';
      showToast({ type: 'error', message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="form-page-header">
        <Link to="/dashboard" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="page-title">Create New Event</h1>
        <p className="page-subtitle">Schedule an upcoming event and open it for student registrations</p>
      </div>

      <div className="form-card-container">
        <form onSubmit={handleSubmit} className="event-form" noValidate>
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              <Tag size={15} />
              <span>Event Name *</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. National Hackathon 2026"
              className={`form-input ${errors.name ? 'input-error' : ''}`}
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="date" className="form-label">
                <Calendar size={15} />
                <span>Event Date *</span>
              </label>
              <input
                id="date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`form-input ${errors.date ? 'input-error' : ''}`}
              />
              {errors.date && <span className="field-error">{errors.date}</span>}
            </div>

            <div className="form-group flex-1">
              <label htmlFor="venue" className="form-label">
                <MapPin size={15} />
                <span>Venue *</span>
              </label>
              <input
                id="venue"
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="e.g. Main Auditorium, Block C"
                className={`form-input ${errors.venue ? 'input-error' : ''}`}
              />
              {errors.venue && <span className="field-error">{errors.venue}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              <AlignLeft size={15} />
              <span>Event Description *</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide event details, schedule highlights, agenda, or guidelines..."
              className={`form-textarea ${errors.description ? 'input-error' : ''}`}
            />
            {errors.description && <span className="field-error">{errors.description}</span>}
          </div>

          <div className="form-actions">
            <Link to="/dashboard" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? (
                <span className="btn-loading">Saving Event...</span>
              ) : (
                <>
                  <Send size={16} />
                  <span>Publish Event</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

