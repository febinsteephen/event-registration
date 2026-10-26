```md
# Event Registration Admin Panel

Simple MERN stack project for managing college events.

## Tech Stack
- Frontend → React (Vite), React Router, Axios, Lucide icons
- Backend → Node.js + Express
- Database → MongoDB (Mongoose)

## How to run

### Backend
```bash
cd backend
npm install
npm run dev
```
Server runs on http://localhost:5000

### Frontend
```bash
cd frontend
npm install
npm run dev
```
App runs on http://localhost:5173

Make sure the backend is running first, otherwise the frontend won't be able to fetch data.

## Features
- View all events on dashboard
- Search events by name or venue
- Add new event
- Edit existing event
- Delete event (with confirmation)
- Increase registration count with one click

## Environment Variables

Create a file `backend/.env` with:

```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
```

(You can copy from `.env.example`)
```