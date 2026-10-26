import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 8000
});

export const getEvents = async () => {
  const res = await client.get('/events');
  return res.data;
};

export const getEvent = async (id) => {
  const res = await client.get(`/events/${id}`);
  return res.data;
};

export const createEvent = async (eventData) => {
  const res = await client.post('/events', eventData);
  return res.data;
};

export const updateEvent = async (id, eventData) => {
  const res = await client.put(`/events/${id}`, eventData);
  return res.data;
};

export const deleteEvent = async (id) => {
  const res = await client.delete(`/events/${id}`);
  return res.data;
};

export const registerAttendee = async (id) => {
  const res = await client.patch(`/events/${id}/register`);
  return res.data;
};

export default client;
