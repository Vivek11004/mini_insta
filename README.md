# Mini Instagram

A production-style **Mini Instagram clone** built using **FastAPI**, **PostgreSQL**, and **React**.  
This project focuses on **backend correctness, security, and real-world API design**, rather than UI polish.

---

## 🚀 Features

- User signup & login using **JWT authentication**
- Protected feed endpoint
- Create posts
- Like & unlike posts (race-condition safe)
- Delete posts (**owner-only, IDOR protected**)
- Frontend authentication guards
- Proper REST semantics (204 No Content handling)

---

## 🛠️ Tech Stack

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT (python-jose)
- dotenv for environment variables

### Frontend
- React
- React Router
- Fetch API

---

## 🔐 Security & Correctness

- Backend-enforced authorization (IDOR prevention)
- Ownership checks before delete operations
- Database-level uniqueness constraint on likes
- Atomic updates for like count to avoid race conditions
- Secrets stored in environment variables (`.env` not committed)

---

## 📦 API Endpoints

### Authentication
- `POST /auth/signup` – Create a new user
- `POST /auth/login` – Login and receive JWT token

### Feed & Posts
- `GET /feed` – Get authenticated user feed
- `POST /posts` – Create a new post
- `DELETE /posts/{post_id}` – Delete a post (owner only)

### Likes
- `POST /posts/{post_id}/like` – Like a post
- `DELETE /posts/{post_id}/like` – Unlike a post

---

## 🧠 Key Learnings

- JWT authentication & protected APIs
- Authorization vs authentication
- Preventing IDOR vulnerabilities
- Handling REST edge cases (204 No Content)
- Frontend–backend route consistency
- Debugging real production-style issues
- Git conflict resolution and merge handling

---

## ▶️ Running the Project Locally

### Backend

```bash
uvicorn app.main:app --reload
```
##  📌 Notes

This project was built to demonstrate backend engineering fundamentals, secure API design, and real-world debugging experience.

UI is intentionally kept minimal.
---

##  👤 Author
GitHub: https://github.com/Vivek11004
