# 研途 - 考研备考进度追踪

React + Express + SQLite 全栈应用。

## 本地开发

```bash
npm install
npm run dev
```

## 部署

### 前端 → Vercel
1. https://vercel.com → Import GitHub 仓库
2. Root Directory 设为 `client`
3. Environment Variables 添加 `VITE_API_URL` = 后端地址 + `/api`

### 后端 → Replit
1. https://replit.com → Import GitHub 仓库
2. Shell 运行 `cd server && npm install`
3. 点 Run 或 `node src/index.js`
4. Environment Variables 添加 `JWT_SECRET`

## 项目结构

```
client/    React + Vite + Tailwind
server/    Express + sql.js (SQLite)
```
