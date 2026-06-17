import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import { initDB } from './db.js';
import { authMiddleware } from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import subjectRoutes from './routes/subjects.js';
import planRoutes from './routes/plans.js';
import profileRoutes from './routes/profile.js';
import statsRoutes from './routes/stats.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/subjects', authMiddleware, subjectRoutes);
app.use('/api/plans', authMiddleware, planRoutes);
app.use('/api/profile', authMiddleware, profileRoutes);
app.use('/api/stats', authMiddleware, statsRoutes);

app.get('/api/health', (_, res) => res.json({ ok: true }));

const clientDist = join(__dirname, '..', '..', 'client', 'dist');
if (existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (_, res) => {
    res.sendFile(join(clientDist, 'index.html'));
  });
}

async function start() {
  await initDB();
  app.listen(PORT, () => {
    console.log(`研途 API 服务运行在 http://localhost:${PORT}`);
  });
}

start().catch(console.error);
