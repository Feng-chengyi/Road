import { Router } from 'express';
import { queryAll, queryOne } from '../db.js';

const router = Router();

// GET /api/stats/weekly - 本周每日学习时长
router.get('/weekly', (req, res) => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  const results = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    const row = queryOne(
      'SELECT COALESCE(SUM(duration_minutes), 0) as total FROM study_records WHERE user_id = ? AND date = ?',
      [req.userId, dateStr]
    );

    const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    results.push({
      date: dateStr,
      label: i === ((dayOfWeek + 6) % 7) ? '今天' : dayNames[i],
      hours: +(row.total / 60).toFixed(1),
    });
  }

  res.json(results);
});

// GET /api/stats/overview - 总览统计
router.get('/overview', (req, res) => {
  const subjects = queryAll('SELECT * FROM subjects WHERE user_id = ?', [req.userId]);
  const totalHours = subjects.reduce((sum, s) => sum + (s.total_hours || 0), 0);

  const daysResult = queryOne(
    'SELECT COUNT(DISTINCT date) as count FROM study_records WHERE user_id = ?',
    [req.userId]
  );

  // 本周完成率
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  const mondayStr = `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`;
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const weekPlans = queryOne(
    'SELECT COUNT(*) as total, SUM(CASE WHEN done = 1 THEN 1 ELSE 0 END) as done FROM plans WHERE user_id = ? AND date >= ? AND date <= ?',
    [req.userId, mondayStr, todayStr]
  );

  // 今日学时
  const todayRecord = queryOne(
    'SELECT COALESCE(SUM(duration_minutes), 0) as total FROM study_records WHERE user_id = ? AND date = ?',
    [req.userId, todayStr]
  );

  // 连续打卡天数
  let streak = 0;
  const checkDate = new Date(now);
  while (true) {
    const ds = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
    const hasRecord = queryOne(
      'SELECT 1 FROM study_records WHERE user_id = ? AND date = ? LIMIT 1',
      [req.userId, ds]
    );
    if (!hasRecord) break;
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  const avgProgress = subjects.length
    ? Math.round(subjects.reduce((sum, s) => sum + (s.progress || 0), 0) / subjects.length)
    : 0;

  res.json({
    totalHours,
    totalDays: daysResult.count || 0,
    streak,
    todayHours: +(todayRecord.total / 60).toFixed(1),
    weeklyCompletion: weekPlans.total ? Math.round((weekPlans.done / weekPlans.total) * 100) : 0,
    avgProgress,
    subjectCount: subjects.length,
    subjectTotalHours: totalHours,
  });
});

export default router;
