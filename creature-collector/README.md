# 🐾 Creature Collector — MERN Stack Lab

A full-stack web app where users register, log in, and manage a personal list of creatures.
Built with **MongoDB Atlas · Express · React · Node.js** using JWT + Session authentication.

---

## 📁 Project Structure

```
creature-collector/          ← Express/Node backend
├── controllers/
│   ├── authController.js    ← register, login, logout logic
│   └── creatureController.js← CRUD for creatures
├── models/
│   ├── User.js              ← Mongoose User schema
│   └── Creature.js          ← Mongoose Creature schema
├── routes/
│   ├── auth.js              ← /auth/* routes
│   └── creatures.js         ← /creatures/* routes
├── server.js                ← Express app entry point
├── .env                     ← Environment variables (NEVER commit this)
└── package.json

creature-collector-client/   ← React frontend
└── src/
    ├── api/api.js            ← fetch wrapper (sends cookies)
    ├── components/
    │   ├── Login.js
    │   ├── Register.js
    │   └── Dashboard.js
    ├── App.js               ← view router (login/register/dashboard)
    └── App.css              ← all styles
```

---

## ⚙️ Setup Instructions

### 1. MongoDB Atlas
1. Go to https://cloud.mongodb.com and create a free cluster.
2. Create a database user (Settings → Database Access).
3. Whitelist your IP (Network Access → Add IP → Allow from anywhere for dev).
4. Get your connection string: Clusters → Connect → Drivers → Copy URI.

### 2. Backend Setup

```bash
cd creature-collector
npm install
```

Edit `.env` and replace the placeholders with your real values:

```
MONGO_URI=mongodb+srv://yourUser:yourPassword@cluster0.xxxxx.mongodb.net/creatureDB?retryWrites=true&w=majority
JWT_SECRET=any_long_random_string
SESSION_SECRET=another_long_random_string
PORT=5000
```

Start the backend:

```bash
npm run dev      # uses nodemon (auto-restart on changes)
# or
npm start        # plain node
```

You should see:
```
✅  MongoDB Atlas connected
🚀  Server running on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd creature-collector-client
npm install
npm start
```

React opens at http://localhost:3000 and proxies API calls to port 5000.

---

## 🧪 Testing the API with Postman

| Method | Endpoint              | Body                                      | Description            |
|--------|-----------------------|-------------------------------------------|------------------------|
| POST   | /auth/register        | `{"username":"ash","password":"pikachu"}` | Register new user      |
| POST   | /auth/login           | `{"username":"ash","password":"pikachu"}` | Login, sets cookies    |
| GET    | /creatures            | —                                         | List user's creatures  |
| POST   | /creatures            | `{"name":"Pikachu","power":"Electric"}`   | Add a creature         |
| DELETE | /creatures/:id        | —                                         | Delete a creature      |
| POST   | /auth/logout          | —                                         | Logout, clears cookies |

> In Postman: enable **"Send cookies"** and check **"Automatically follow redirects"** so session/JWT cookies persist between requests.

---

## 🔑 Auth Concepts Explained

| | JWT (Stateless) | Session (Stateful) |
|---|---|---|
| **Stored where?** | Client cookie (HTTP-only) | Server memory; only ID in cookie |
| **Server memory?** | None needed | Must store session data |
| **Scalability** | High (no server state) | Needs shared session store for clusters |
| **Revocation** | Hard (until expiry) | Easy (delete session) |

This lab uses **both** for demonstration. The creature controller checks the session first, then falls back to verifying the JWT.

---

## ✨ Stretch Goals (already included)

- **Search/Filter** — type in the search box on the Dashboard to filter creatures by name in real time.
- **Logout** — button clears both the JWT cookie and the server-side session.
