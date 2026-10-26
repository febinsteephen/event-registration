import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Users,
  Edit3,
  Trash2,
  Plus,
  RefreshCw,
  Search,
  CalendarDays,
  UserCheck
} from 'lucide-react';
import { getEvents, deleteEvent, registerAttendee } from '../services/api';
import ConfirmModal from '../components/ConfirmModal';

export default function Dashboard({ showToast }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForDelete, setSelectedForDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchEventsData = async () => {
    try {
      setLoading(true);
      const res = await getEvents();
      if (res.success) {
        setEvents(res.data);
      }
    } catch (err) {
      showToast({
        type: 'error',
        message: err.response?.data?.message || 'Could not load events from server'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventsData();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!selectedForDelete) return;
    try {
      setIsDeleting(true);
      await deleteEvent(selectedForDelete._id);
      setEvents((prev) => prev.filter((item) => item._id !== selectedForDelete._id));
      showToast({ type: 'success', message: 'Event successfully removed' });
      setSelectedForDelete(null);
    } catch (err) {
      showToast({
        type: 'error',
        message: err.response?.data?.message || 'Failed to delete event'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleQuickRegister = async (eventId) => {
    try {
      setActionLoadingId(eventId);
      const res = await registerAttendee(eventId);
      if (res.success) {
        setEvents((prev) =>
          prev.map((e) => (e._id === eventId ? { ...e, totalRegistrations: res.data.totalRegistrations } : e))
        );
        showToast({ type: 'success', message: 'Registration recorded!' });
      }
    } catch (err) {
      showToast({ type: 'error', message: 'Failed to record registration' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filtered_events = events.filter((ev) =>
    ev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ev.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (ev.displayId && ev.displayId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalAttendeeCount = events.reduce((sum, item) => sum + (item.totalRegistrations || 0), 0);

  return (
    <div className="page-wrapper">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Event Management Dashboard</h1>
          <p className="page-subtitle">Track, update, and coordinate scheduled campus events</p>
        </div>
        <div className="header-actions">
          <button
            onClick={fetchEventsData}
            className="btn btn-secondary btn-icon"
            title="Refresh events list"
          >
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
          <Link to="/add" className="btn btn-primary">
            <Plus size={18} />
            <span>Add Event</span>
          </Link>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper icon-indigo">
            <CalendarDays size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Events</span>
            <span className="stat-val">{events.length}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper icon-emerald">
            <Users size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Registrations</span>
            <span className="stat-val">{totalAttendeeCount}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper icon-amber">
            <UserCheck size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Avg. Attendees/Event</span>
            <span className="stat-val">
              {events.length > 0 ? (totalAttendeeCount / events.length).toFixed(1) : 0}
            </span>
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="card-toolbar">
          <div className="search-box">
            <Search size={17} className="search-icon" />
            <input
              type="text"
              placeholder="Search by event name, venue, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="table-count">
            Showing <strong>{filtered_events.length}</strong> of {events.length} events
          </div>
        </div>

        {loading ? (
          <div className="table-loading">
            <div className="spinner"></div>
            <p>Loading events from database...</p>
          </div>
        ) : filtered_events.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Calendar size={36} />
            </div>
            <h3>{searchTerm ? 'No matching events found' : 'No events scheduled yet'}</h3>
            <p>
              {searchTerm
                ? 'Try tweaking your search keywords or clear the search input.'
                : 'Get started by creating your first event using the button below.'}
            </p>
            {!searchTerm && (
              <Link to="/add" className="btn btn-primary">
                <Plus size={16} />
                <span>Create New Event</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="table-container">
            <table className="events-table">
              <thead>
                <tr>
                  <th>Event ID</th>
                  <th>Event Name</th>
                  <th>Event Date</th>
                  <th>Venue</th>
                  <th>Total Registrations</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered_events.map((evt) => (
                  <tr key={evt._id} className="event-row">
                    <td>
                      <span className="id-badge" title={evt._id}>
                        {evt.displayId || `EVT-${evt._id.slice(-6).toUpperCase()}`}
                      </span>
                    </td>
                    <td>
                      <div className="event-name-cell">
                        <span className="event-name-text">{evt.name}</span>
                        {evt.description && (
                          <span className="event-desc-snippet" title={evt.description}>
                            {evt.description}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="cell-with-icon">
                        <Calendar size={15} className="text-muted" />
                        <span>{formatDate(evt.date)}</span>
                      </div>
                    </td>
                    <td>
                      <div className="cell-with-icon">
                        <MapPin size={15} className="text-muted" />
                        <span>{evt.venue}</span>
                      </div>
                    </td>
                    <td>
                      <div className="reg-badge-group">
                        <span className="reg-badge">
                          <Users size={14} />
                          <span>{evt.totalRegistrations || 0}</span>
                        </span>
                        <button
                          type="button"
                          className="btn-quick-reg"
                          title="Simulate Attendee Registration"
                          disabled={actionLoadingId === evt._id}
                          onClick={() => handleQuickRegister(evt._id)}
                        >
                          +1
                        </button>
                      </div>
                    </td>
                    <td>
                      <div className="row-actions">
                        <Link
                          to={`/edit/${evt._id}`}
                          className="btn-action btn-edit"
                          title="Update Event"
                        >
                          <Edit3 size={15} />
                          <span>Update</span>
                        </Link>
                        <button
                          type="button"
                          className="btn-action btn-delete"
                          onClick={() => setSelectedForDelete(evt)}
                          title="Delete Event"
                        >
                          <Trash2 size={15} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={Boolean(selectedForDelete)}
        title="Delete Event"
        message={
          selectedForDelete
            ? `Are you sure you want to delete "${selectedForDelete.name}"? This action cannot be reversed.`
            : ''
        }
        onConfirm={handleDeleteConfirm}
        onCancel={() => setSelectedForDelete(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
}

