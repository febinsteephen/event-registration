import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit3, Trash2, Plus } from 'lucide-react';
import { getEvents, deleteEvent, registerAttendee } from '../services/api';
import ConfirmModal from '../components/confirm_modal';

export default function Dashboard({ showToast }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search_txt, setSearch_txt] = useState('');
  const [del_target, setDel_target] = useState(null);
  const [is_deleting, setIs_deleting] = useState(false);
  const [loading_id, setLoading_id] = useState(null);

  // fetch data from api
  const load_data = async () => {
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
    load_data();
  }, []);

  // delete an event
  const handleDelete = async () => {
    if (!del_target) return;
    try {
      setIs_deleting(true);
      await deleteEvent(del_target._id);
      setEvents((prev) => prev.filter((item) => item._id !== del_target._id));
      showToast({ type: 'success', message: 'Event deleted' });
      setDel_target(null);
    } catch (err) {
      showToast({
        type: 'error',
        message: err.response?.data?.message || 'Failed to delete event'
      });
    } finally {
      setIs_deleting(false);
    }
  };

  // +1 button click
  const handlePlusOne = async (id) => {
    try {
      setLoading_id(id);
      const res = await registerAttendee(id);
      if (res.success) {
        setEvents((prev) =>
          prev.map((e) => (e._id === id ? { ...e, totalRegistrations: res.data.totalRegistrations } : e))
        );
        showToast({ type: 'success', message: 'Registration recorded!' });
      }
    } catch (err) {
      showToast({ type: 'error', message: 'Failed to record registration' });
    } finally {
      setLoading_id(null);
    }
  };

  const formatDate = (str) => {
    if (!str) return 'TBA';
    const d = new Date(str);
    if (isNaN(d.getTime())) return str;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // search filter
  const filtered_events = events.filter((ev) =>
    ev.name.toLowerCase().includes(search_txt.toLowerCase()) ||
    ev.venue.toLowerCase().includes(search_txt.toLowerCase())
  );

  return (
    <div className="page-wrapper">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Events Dashboard</h1>
          <p className="page-subtitle">Manage all your events here</p>
        </div>
        <div className="header-actions">
          <button onClick={load_data} className="btn btn-secondary" title="Refresh">
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
            value={search_txt}
            onChange={(e) => setSearch_txt(e.target.value)}
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
            <p>{search_txt ? 'No matching events found.' : 'No events yet.'}</p>
            {!search_txt && (
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
                        disabled={loading_id === evt._id}
                        onClick={() => handlePlusOne(evt._id)}
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
                          onClick={() => setDel_target(evt)}
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
        isOpen={Boolean(del_target)}
        title="Delete Event"
        message={
          del_target
            ? `Are you sure you want to delete "${del_target.name}"?`
            : ''
        }
        onConfirm={handleDelete}
        onCancel={() => setDel_target(null)}
        isDeleting={is_deleting}
      />
    </div>
  );
}
