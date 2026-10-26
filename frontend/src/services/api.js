import axios from 'axios';

// api client setup
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 8000
});

// get all events
export const getEvents = async () => {
  const res = await client.get('/events');
  return res.data;
};

// get single event
export const getEvent = async (id) => {
  const res = await client.get(`/events/${id}`);
  return res.data;
};

// create event
export const createEvent = async (eventData) => {
  const res = await client.post('/events', eventData);
  return res.data;
};

// update event
export const updateEvent = async (id, eventData) => {
  const res = await client.put(`/events/${id}`, eventData);
  return res.data;
};

// delete event
export const deleteEvent = async (id) => {
  const res = await client.delete(`/events/${id}`);
  return res.data;
};

// register attendee (+1)
export const registerAttendee = async (id) => {
  const res = await client.patch(`/events/${id}/register`);
  return res.data;
};

export default client;
