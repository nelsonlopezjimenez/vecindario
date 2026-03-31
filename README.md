# Vecindario

## Prompt: 
APP vecindario: create an app using MERN stack that allow users to register, signin, post on various topics, something similar to craigslist and/or neighbourhood watch to keep vecinos (neighbors) updated on safety related and other topics. Use git. Design a strightforward deployment/update, in a selfhosted server but easy to migrate to the cloud if needed. Design a way to edit the source files on github (or similar) and push the updates to wherever the server is running. I have expeirience running go server as an executable and linked to a react frontend and edit/update in a relatively easy way. Do not create installations scripts, generate the folder structure, and each file in one markdown document so I could copy/paste and then run the install with npm, or is you suggest another framework (go, bun, hono, astro) i will take care of the build. The purpose is to allow vecinos neighors to interact mostly locally on the same city or neighourhood and then based on popularity expand. Add functionality to attract users based on rewards, access to resources, maybe as a cloud service without having to pay. Generate a way to create strong passwords or to use paswordless login. I remember banks used to use a set of images to suggest one for users to use an extra layer when login in, but it might be also a set of images that user can generate in a row that would be public and let users select the order of title/names of each image as a password similar to the way crypto wallets allow users to 12 words in an specific order for secured signin.

## 3.31.3026

Here's the complete blueprint. One large markdown — copy each file block to its path, then `npm install` in both `backend/` and `frontend/`.Full blueprint — every file, copy-paste ready. Here's a summary of key decisions:

**Image passphrase flow**
- Registration: server sends 6 random images → user clicks all 6 in chosen order → `bcrypt.hash(JSON.stringify([id1,id2,...]))` stored
- Login: same 6 images shuffled → user recreates order → `bcrypt.compare`
- 6! = 720 orderings × selection entropy. Not unbreakable alone, so add `express-rate-limit` before going live.

**Docker + CI/CD**
- `docker-compose.yml` runs mongo + backend + frontend(nginx)
- nginx in the frontend container proxies `/api` → `backend:5000`, handles SPA fallback
- GitHub Actions → `appleboy/ssh-action` → `git pull` + `docker compose up --build -d` on every push to `main`

**Atlas migration** is one line: swap `MONGO_URI` in `.env`, remove the `mongo` service from compose.

**Suggested next steps** before production (in order of priority):
1. `express-rate-limit` on `/api/auth/*`
2. Comments model + route
3. `multer` for post images
4. Admin role enforcement on pin/resolve endpoints

# Vecindario

Neighborhood community board — safety alerts, events, marketplace, and more.
Auth: image-grid passphrase (no text password).

## Dev (local)
```bash
# Terminal 1 — MongoDB
docker run -p 27017:27017 mongo:7

# Terminal 2 — backend
cd backend && cp .env.example .env  # fill JWT_SECRET
npm install && npm run dev

# Terminal 3 — frontend
cd frontend && npm install && npm run dev
```

## Prod (Docker)
```bash
# First time on server
git clone https://github.com/YOU/vecindario /opt/vecindario
cd /opt/vecindario && cp .env.example .env   # set JWT_SECRET
docker compose up -d
```

After that, every push to `main` auto-deploys via GitHub Actions.

## GitHub Secrets Required

| Secret | Value |
|---|---|
| `SERVER_HOST` | server IP or domain |
| `SERVER_USER` | SSH user |
| `SERVER_SSH_KEY` | private key (paste full content) |
| `SERVER_PORT` | 22 (or custom) |

## MongoDB Atlas migration

In `.env` on the server:
```MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/vecindario
```

Remove the `mongo` service from `docker-compose.yml`. Done.

## Points system

| Action | Points |
|---|---|
| Create post | +10 |
| Receive upvote | +2 |

## Next steps (suggested)

- `express-rate-limit` on auth routes (prevent brute force)
- Comments on posts
- Image upload (multer + S3/MinIO)
- Email verification / magic link fallback
- Admin panel to pin/resolve/delete posts
- Geolocation filtering by radius