import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getEvent, updateEvent } from '../services/api';

export default function EditEvent({ showToast }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form_val, setForm_val] = useState({
    name: '',
    description: '',
    date: '',
    venue: '',
    totalRegistrations: 0
  });

  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formErr, setFormErr] = useState({});
  const [not_found, setNot_found] = useState(false);

  // load event
  useEffect(() => {
    const fetch_evt = async () => {
      try {
        setIsLoading(true);
        const res = await getEvent(id);
        if (res.success && res.data) {
          const item = res.data;
          const dt = item.date ? new Date(item.date).toISOString().split('T')[0] : '';
          setForm_val({
            name: item.name || '',
            description: item.description || '',
            date: dt,
            venue: item.venue || '',
            totalRegistrations: item.totalRegistrations || 0
          });
        }
      } catch (err) {
        setNot_found(true);
        showToast({ type: 'error', message: 'Could not fetch event details' });
      } finally {
        setIsLoading(false);
      }
    };

    fetch_evt();
  }, [id]);

  const validate = () => {
    let e = {};
    if (!form_val.name.trim()) e.name = 'Event name is required';
    if (!form_val.description.trim()) e.description = 'Description is required';
    if (!form_val.date) e.date = 'Date is required';
    if (!form_val.venue.trim()) e.venue = 'Venue is required';
    setFormErr(e);
    return Object.keys(e).length === 0;
  };

  const on_change = (e) => {
    const { name, value } = e.target;
    setForm_val((prev) => ({ ...prev, [name]: value }));
    if (formErr[name]) {
      setFormErr((prev) => ({ ...prev, [name]: null }));
    }
  };

  // save updates
  const handle_update = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast({ type: 'error', message: 'Please fix the errors' });
      return;
    }

    try {
      setSaving(true);
      const res = await updateEvent(id, form_val);
      if (res.success) {
        showToast({ type: 'success', message: 'Event updated!' });
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update event';
      showToast({ type: 'error', message: msg });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="page-wrapper">
        <div className="table-loading">
          <div className="spinner"></div>
          <p>Loading event...</p>
        </div>
      </div>
    );
  }

  if (not_found) {
    return (
      <div className="page-wrapper">
        <div className="empty-state">
          <p>Event not found.</p>
          <Link to="/dashboard" className="btn btn-secondary" style={{marginTop: '1rem'}}>
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="form-page-header">
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
        <h1 className="page-title">Edit Event</h1>
        <p className="page-subtitle">Update the event details below</p>
      </div>

      <div className="form-card-container">
        <form onSubmit={handle_update} className="event-form" noValidate>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Event Name *</label>
            <input
              id="name" type="text" name="name"
              value={form_val.name} onChange={on_change}
              className={`form-input ${formErr.name ? 'input-error' : ''}`}
            />
            {formErr.name && <span className="field-error">{formErr.name}</span>}
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="date" className="form-label">Event Date *</label>
              <input
                id="date" type="date" name="date"
                value={form_val.date} onChange={on_change}
                className={`form-input ${formErr.date ? 'input-error' : ''}`}
              />
              {formErr.date && <span className="field-error">{formErr.date}</span>}
            </div>

            <div className="form-group flex-1">
              <label htmlFor="venue" className="form-label">Venue *</label>
              <input
                id="venue" type="text" name="venue"
                value={form_val.venue} onChange={on_change}
                className={`form-input ${formErr.venue ? 'input-error' : ''}`}
              />
              {formErr.venue && <span className="field-error">{formErr.venue}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="totalRegistrations" className="form-label">Registrations</label>
              <input
                id="totalRegistrations" type="number" min="0" name="totalRegistrations"
                value={form_val.totalRegistrations} onChange={on_change}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">Description *</label>
            <textarea
              id="description" name="description" rows={4}
              value={form_val.description} onChange={on_change}
              className={`form-textarea ${formErr.description ? 'input-error' : ''}`}
            />
            {formErr.description && <span className="field-error">{formErr.description}</span>}
          </div>

          <div className="form-actions">
            <Link to="/dashboard" className="btn btn-secondary">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
