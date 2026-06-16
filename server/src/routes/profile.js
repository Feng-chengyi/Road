import { Router } from 'express';
import { queryOne, queryAll, run } from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  const user = queryOne(
    'SELECT id, name, email, phone, school, major, exam_year, daily_goal FROM users WHERE id = ?',
    [req.userId]
  );
  if (!user) return res.status(404).json({ error: '用户不存在' });

  const subjects = queryAll('SELECT * FROM subjects WHERE user_id = ?', [req.userId]);
  const totalHours = subjects.reduce((sum, s) => sum + (s.total_hours || 0), 0);
  const daysResult = queryOne(
    'SELECT COUNT(DISTINCT date) as count FROM study_records WHERE user_id = ?',
    [req.userId]
  );
  const totalDays = daysResult ? daysResult.count : 0;
  const avgProgress = subjects.length
    ? Math.round(subjects.reduce((sum, s) => sum + (s.progress || 0), 0) / subjects.length)
    : 0;

  res.json({
    ...user,
    stats: {
      totalHours,
      totalDays,
      avgProgress,
      subjectCount: subjects.length,
    },
  });
});

router.put('/', (req, res) => {
  const user = queryOne('SELECT * FROM users WHERE id = ?', [req.userId]);
  if (!user) return res.status(404).json({ error: '用户不存在' });

  const { name, school, major, examYear, dailyGoal } = req.body;
  run(
    'UPDATE users SET name = ?, school = ?, major = ?, exam_year = ?, daily_goal = ? WHERE id = ?',
    [
      name ?? user.name,
      school ?? user.school,
      major ?? user.major,
      examYear ?? user.exam_year,
      dailyGoal ?? user.daily_goal,
      req.userId,
    ]
  );

  const updated = queryOne(
    'SELECT id, name, email, phone, school, major, exam_year, daily_goal FROM users WHERE id = ?',
    [req.userId]
  );
  res.json(updated);
});

export default router;
