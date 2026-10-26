# GatherUp - Event Registration Admin Panel

MERN stack project for managing college events and tracking registrations.

## Tech Used
- React (Vite) + React Router for frontend
- Node.js, Express for backend
- MongoDB with Mongoose

## Running the project

Start backend first:
```
cd backend
npm install
npm run dev
```
Backend runs on http://localhost:5000

Then start frontend:
```
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:5173

## What it does
- Dashboard showing all events in a table
- Add, edit, delete events
- Search events by name/venue
- Click +1 to increase registration count
- Dark themed UI

## Env setup
Create `backend/.env` with:
```
PORT=5000
MONGO_URI=your_mongo_atlas_uri
```
