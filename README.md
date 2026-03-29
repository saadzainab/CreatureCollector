# Creature Collector 🐾
A Pokémon-inspired MERN stack web app where users can register, log in, and manage their own list of creatures.

What It Does

Register and log in with a username and password
View your personal creature list on a dashboard
Add a new creature (name + power)
Delete a creature from your list
Authentication using JWT (stored in HTTP-only cookie) + express-session


Project Structure
creature-collector/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── creatureController.js
│   ├── models/
│   │   ├── User.js
│   │   └── Creature.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── creatures.js
│   ├── server.js
│   └── package.json
├── frontend/
│   └── src/
│       ├── api/
│       │   └── api.js
│       ├── components/
│       │   ├── Login.js
│       │   ├── Register.js
│       │   └── Dashboard.js
│       ├── App.js
│       └── index.js
└── .gitignore

Prerequisites

Node.js v18+
MongoDB (local or MongoDB Atlas)

# Built With

React — Frontend UI
Node.js + Express — Backend API
MongoDB + Mongoose — Database
JWT + express-session — Authentication
