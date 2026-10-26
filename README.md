# Event Registration Admin Panel

A MERN stack web app to manage college events — add, edit, delete events and track registrations from a single admin dashboard.

## Tech Stack

- **Frontend** — React.js (Vite), React Router, Axios
- **Backend** — Node.js, Express.js
- **Database** — MongoDB Atlas (Mongoose)

## Getting Started

Clone the repo and install dependencies for both frontend and backend.

### Backend

```bash
cd backend
npm install
npm run dev
```

Runs on `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`

## Environment Variables

The `backend/.env` file is included with test credentials pointing to a MongoDB Atlas test database.

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
```

## Features

- Dashboard showing all events with ID, name, date, venue and registration count
- Add new events via a form with basic validation
- Edit existing events — form pre-fills with current data
- Delete events with a confirmation prompt before removing
- Registration count tracker with quick +1 button per event
- Search/filter events by name or venue
- Responsive layout for mobile and desktop

## API Endpoints

| Method | Route | What it does |
|--------|-------|--------------|
| GET | `/api/events` | Get all events |
| GET | `/api/events/:id` | Get one event |
| POST | `/api/events` | Create event |
| PUT | `/api/events/:id` | Update event |
| DELETE | `/api/events/:id` | Delete event |
| PATCH | `/api/events/:id/register` | Increment registration count |
