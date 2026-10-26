import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, AlignLeft, Tag, ArrowLeft, Save, Users, AlertCircle } from 'lucide-react';
import { getEvent, updateEvent } from '../services/api';

export default function EditEvent({ showToast }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    venue: '',
    totalRegistrations: 0
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);
        const res = await getEvent(id);
        if (res.success && res.data) {
          const item = res.data;
          const formattedDate = item.date ? new Date(item.date).toISOString().split('T')[0] : '';
          setFormData({
            name: item.name || '',
            description: item.description || '',
            date: formattedDate,
            venue: item.venue || '',
            totalRegistrations: item.totalRegistrations || 0
          });
        }
      } catch (err) {
        setFetchError('Event not found or failed to load');
        showToast({ type: 'error', message: 'Could not fetch event details' });
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

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
      showToast({ type: 'error', message: 'Please correct the form errors' });
      return;
    }

    try {
      setSubmitting(true);
      const res = await updateEvent(id, formData);
      if (res.success) {
        showToast({ type: 'success', message: 'Event successfully updated!' });
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update event';
      showToast({ type: 'error', message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="table-loading">
          <div className="spinner"></div>
          <p>Loading event information...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="page-wrapper">
        <div className="empty-state">
          <div className="empty-state-icon text-danger">
            <AlertCircle size={36} />
          </div>
          <h3>Event Not Found</h3>
          <p>The event you are attempting to edit does not exist or has been removed.</p>
          <Link to="/dashboard" className="btn btn-secondary">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="form-page-header">
        <Link to="/dashboard" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="page-title">Edit Event</h1>
        <p className="page-subtitle">Modify details and update event record in MongoDB</p>
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
                className={`form-input ${errors.venue ? 'input-error' : ''}`}
              />
              {errors.venue && <span className="field-error">{errors.venue}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="totalRegistrations" className="form-label">
                <Users size={15} />
                <span>Total Registrations</span>
              </label>
              <input
                id="totalRegistrations"
                type="number"
                min="0"
                name="totalRegistrations"
                value={formData.totalRegistrations}
                onChange={handleChange}
                className="form-input"
              />
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
                <span className="btn-loading">Updating...</span>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

