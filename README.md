# Event Registration Admin Panel (MERN Stack)

A modern, responsive Event Management Admin Panel built with the **MERN Stack** (MongoDB Atlas, Express.js, React.js, and Node.js).

---

## Features

- **Dashboard Overview**: Displays all events with Event ID, Event Name, Event Date, Venue, and Total Registrations.
- **Search & Filter**: Real-time filtering across event titles, venue locations, and IDs.
- **Add Event**: Form with validation for Event Name, Description, Date, and Venue. Initializes registrations to 0.
- **Update Event**: Pre-populated form to edit existing events and persist changes to MongoDB.
- **Delete Event**: Safe deletion workflow with an interactive confirmation modal.
- **Simulate Attendee Registration**: Quick `+1` action directly on the dashboard to test registration count increments.
- **Modern Responsive UI**: Indigo primary theme (`#4F46E5`), subtle animations, accessible states, and mobile-friendly layouts.

---

## Project Structure

```text
event-registration/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── eventController.js
│   ├── models/
│   │   └── Event.js
│   ├── routes/
│   │   └── eventRoutes.js
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ConfirmModal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Toast.jsx
│   │   ├── pages/
│   │   │   ├── AddEvent.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── EditEvent.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## Setup & Running the Project

### Prerequisites
- Node.js (v18 or higher recommended)
- npm
- MongoDB Atlas cluster connection string (or a local MongoDB instance)

---

### 1. Backend Setup

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `backend/.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/event_registration?retryWrites=true&w=majority
   ```
   *(Replace `<username>` and `<password>` with your MongoDB Atlas database user credentials).*

4. Start the backend server:
   ```bash
   # Development mode with hot reload:
   npm run dev

   # Or standard production mode:
   npm start
   ```
   The backend will run on `http://localhost:5000`.

---

### 2. Frontend Setup

1. Open another terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will run at `http://localhost:5173`.

---

## REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/events` | Fetch list of all events |
| `GET` | `/api/events/:id` | Fetch single event by ID |
| `POST` | `/api/events` | Create a new event |
| `PUT` | `/api/events/:id` | Update an existing event |
| `DELETE` | `/api/events/:id` | Delete an event |
| `PATCH` | `/api/events/:id/register` | Increment registration count |
| `GET` | `/api/health` | Service health status |

---

## Submission Checklist

- [x] Complete project structure (`frontend/` and `backend/`).
- [x] Separate `package.json` for frontend and backend with all dependencies listed.
- [x] `.env` and `.env.example` included in the backend directory.
- [x] RESTful CRUD endpoints verified.
- [x] Responsive UI with sticky navbar and routing between Dashboard and Add Event.
- [x] Update and Delete with confirmation modal working end-to-end.
- [x] Total Registrations tracked and displayed.
