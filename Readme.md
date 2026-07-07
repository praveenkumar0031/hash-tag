# #️⃣ Hash-Tag

> **A real-time, time-bound social messaging platform built with the MERN Stack.**

Hash-Tag reimagines online conversations by replacing permanent chat histories with **ephemeral, topic-based lounges**. Instead of storing conversations forever, users join live discussion rooms centered around shared interests, where messages automatically expire after a fixed duration—creating a more engaging, privacy-friendly, and clutter-free social experience.

🌐 **Live Demo:** https://hash-tag-henna.vercel.app

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Overview](#-api-overview)
- [Future Enhancements](#-future-enhancements)
- [Author](#-author)

---

# 📖 Overview

Most messaging platforms accumulate conversations over time, making chats difficult to organize and reducing spontaneous interactions.

Hash-Tag solves this by introducing **time-bound Lounges** where users can discuss topics they're interested in at that moment. Every room has a limited lifetime, encouraging meaningful conversations while eliminating unnecessary digital clutter.

Whether it's technology, gaming, movies, travel, or random late-night thoughts, users can instantly connect with others sharing the same interests.

---

# ✨ Features

### Authentication

- JWT Authentication
- Secure Login & Registration
- Protected Routes

### Real-Time Communication

- Real-time Group Messaging
- Socket.IO Integration
- Instant Message Delivery
- Live User Presence

### Lounge System

- Topic-based Lounges
- Join & Leave Rooms
- Time-bound Discussions
- Auto-expiring Messages (24 Hours)

### User Experience

- Responsive UI
- Clean Dashboard
- Fast Navigation
- Modern React Components

---

# 🛠 Tech Stack

| Category | Technologies |
|-----------|--------------|
| Frontend | React.js, Vite, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT |
| Real-Time | Socket.IO |
| File Upload | Multer |
| DevOps | Docker, Jenkins, Terraform |
| Deployment | Vercel, MongoDB Atlas |

---

# 🏗 Architecture

```text
                   ┌──────────────────────┐
                   │   React Frontend     │
                   └──────────┬───────────┘
                              │
                REST API + Socket.IO
                              │
                   ┌──────────▼───────────┐
                   │ Node.js + Express.js │
                   └──────────┬───────────┘
                              │
                         Mongoose ODM
                              │
                   ┌──────────▼───────────┐
                   │    MongoDB Atlas     │
                   └──────────────────────┘
```

---

# 📂 Project Structure

```text
Hash-Tag/
│
├── backend/
│   ├── config/
│   ├── controller/
│   ├── middleware/
│   ├── model/
│   ├── router/
│   ├── socket/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.js
│
├── terraform/
├── Jenkinsfile
├── .gitignore
└── README.md
```

---

# 🚀 Getting Started

## Clone the Repository

```bash
git clone https://github.com/<your-username>/Hash-Tag.git
cd Hash-Tag
```

---

## Backend Setup

```bash
cd backend
npm install
```

Start the backend server

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at

```
http://localhost:5173
```

---

# 🔑 Environment Variables

## Backend (.env)

```env
PORT=5000

MONGO_URI=

JWT_SECRET=

CLIENT_URL=http://localhost:5173
```

## Frontend (.env)

```env
VITE_API_URL=http://localhost:5000
```

---

# 📡 API Overview

### Authentication

```
POST   /api/users/register
POST   /api/users/login
```

### User

```
GET    /api/users/profile
PUT    /api/users/profile
```

### Rooms

```
GET    /api/rooms
POST   /api/rooms
GET    /api/rooms/:id
```

### Messages

```
GET    /api/messages/:roomId
POST   /api/messages
```

### Socket Events

```
join-room
leave-room
send-message
receive-message
typing
disconnect
```

---

# 🔄 Application Flow

```text
User Login
      │
      ▼
Browse Lounges
      │
      ▼
Join Lounge
      │
      ▼
Real-time Chat
      │
      ▼
Messages Expire Automatically
```

---

# 🚀 Deployment

| Service | Platform |
|----------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |

---

# 🎯 Future Enhancements

- Voice & Video Calling
- AI-powered Lounge Recommendations
- Nearby Lounge Discovery
- Push Notifications
- Dark Mode
- Anonymous Rooms
- Message Reactions
- Media Sharing

---

# 📸 Screenshots

> Add screenshots of the application here.

```
screenshots/
├── home.png
├── login.png
├── dashboard.png
├── lounge.png
├── chat.png
└── profile.png
```

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push your branch

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

# 👨‍💻 Author

**Praveen Kumar S**

- GitHub: https://github.com/praveenkumar0031<your-github>
- LinkedIn: https://www.linkedin.com/in/praveen-kumar-s-38b971288<your-linkedin>

---

# 📄 License

This project is licensed under the MIT License.

---

## ⭐ If you like this project, don't forget to star the repository!