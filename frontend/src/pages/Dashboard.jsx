import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit3, Trash2, Plus } from 'lucide-react';
import { getEvents, deleteEvent, registerAttendee } from '../services/api';
import ConfirmModal from '../components/ConfirmModal';

export default function Dashboard({ showToast }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForDelete, setSelectedForDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // fetch events from backend
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

  // handle delete
  const handleDeleteConfirm = async () => {
    if (!selectedForDelete) return;
    try {
      setIsDeleting(true);
      await deleteEvent(selectedForDelete._id);
      setEvents((prev) => prev.filter((item) => item._id !== selectedForDelete._id));
      showToast({ type: 'success', message: 'Event deleted' });
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

  // add +1 registration
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

  // filter events based on search
  const filtered_events = events.filter((ev) =>
    ev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ev.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-wrapper">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Events Dashboard</h1>
          <p className="page-subtitle">Manage all your events here</p>
        </div>
        <div className="header-actions">
          <button onClick={fetchEventsData} className="btn btn-secondary" title="Refresh">
            Refresh
          </button>
          <Link to="/add" className="btn btn-primary">
            <Plus size={18} />
            <span>Add Event</span>
          </Link>
        </div>
      </div>

      <div className="content-card">
        <div className="card-toolbar">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="table-count">
            {filtered_events.length} of {events.length} events
          </span>
        </div>

        {loading ? (
          <div className="table-loading">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        ) : filtered_events.length === 0 ? (
          <div className="empty-state">
            <p>{searchTerm ? 'No matching events found.' : 'No events yet.'}</p>
            {!searchTerm && (
              <Link to="/add" className="btn btn-primary" style={{marginTop: '1rem'}}>
                <Plus size={16} /> Create Event
              </Link>
            )}
          </div>
        ) : (
          <div className="table-container">
            <table className="events-table">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Date</th>
                  <th>Venue</th>
                  <th>Registrations</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered_events.map((evt) => (
                  <tr key={evt._id}>
                    <td>
                      <strong>{evt.name}</strong>
                      {evt.description && (
                        <div className="event-desc-snippet">{evt.description}</div>
                      )}
                    </td>
                    <td>{formatDate(evt.date)}</td>
                    <td>{evt.venue}</td>
                    <td>
                      <span className="reg-count">{evt.totalRegistrations || 0}</span>
                      <button
                        type="button"
                        className="btn-quick-reg"
                        disabled={actionLoadingId === evt._id}
                        onClick={() => handleQuickRegister(evt._id)}
                      >
                        +1
                      </button>
                    </td>
                    <td>
                      <div className="row-actions">
                        <Link to={`/edit/${evt._id}`} className="btn-action btn-edit" title="Edit">
                          <Edit3 size={15} /> Edit
                        </Link>
                        <button
                          type="button"
                          className="btn-action btn-delete"
                          onClick={() => setSelectedForDelete(evt)}
                          title="Delete"
                        >
                          <Trash2 size={15} /> Delete
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
            ? `Are you sure you want to delete "${selectedForDelete.name}"?`
            : ''
        }
        onConfirm={handleDeleteConfirm}
        onCancel={() => setSelectedForDelete(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
}
