# AGENTS.md

## What this is

Full-stack web app for "研途" (exam prep progress tracker). React + Vite frontend, Express + SQLite backend, JWT auth.

## Structure

```
client/          React + Vite + Tailwind CSS frontend
  src/pages/     Login, Register, Dashboard, Subjects, Plans, Profile
  src/context/   AuthContext (JWT state management)
  src/api.js     Axios instance with auth interceptors
server/          Express + sql.js backend
  src/routes/    auth, subjects, plans, profile
  src/db.js      SQLite (sql.js, file-based, auto-saves to data.db)
  src/middleware/auth.js   JWT verification
package.json     Root scripts: dev, build, start
render.yaml      Render.com deployment config
```

## Commands

- `npm run setup` — install all dependencies
- `npm run dev` — start both client (5173) and server (3001) with hot reload
- `npm run build` — build client for production
- `npm start` — start server in production (serves built client)

## Key facts

- **Auth**: Register requires name + password + (email OR phone). Login uses email/phone + password. JWT tokens stored in localStorage.
- **Database**: sql.js (pure JS SQLite). Data persisted to `server/data.db`. No native compilation needed.
- **API prefix**: All backend routes under `/api/`. Health check at `GET /api/health`.
- **Production**: Server serves `client/dist/` as static files. Single port deployment.
- **Design system**: Brand primary `#6366F1`, surface `#0B1120`. See `考研备考App-设计系统.md` for full tokens.

## Editing rules

- All UI text is Simplified Chinese.
- `client/` uses Tailwind CSS utility classes. `server/` has no frontend code.
- Color tokens in Tailwind config (`tailwind.config.js`), not inline.
- Both `index.html` and `研途-交互原型.html` are legacy prototypes — do not edit for the production app.
