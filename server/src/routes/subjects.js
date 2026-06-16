import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { queryAll, queryOne, run } from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  const subjects = queryAll(
    'SELECT * FROM subjects WHERE user_id = ? ORDER BY created_at DESC',
    [req.userId]
  );
  res.json(subjects);
});

router.post('/', [
  body('name').trim().notEmpty().withMessage('科目名称不能为空'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const { name, color, targetScore, dailyHours } = req.body;
  const result = run(
    'INSERT INTO subjects (user_id, name, color, target_score, daily_hours) VALUES (?, ?, ?, ?, ?)',
    [req.userId, name, color || '#6366F1', targetScore || 100, dailyHours || 1.5]
  );

  const subject = queryOne('SELECT * FROM subjects WHERE id = ?', [result.lastInsertRowid]);
  res.json(subject);
});

router.put('/:id', (req, res) => {
  const subject = queryOne(
    'SELECT * FROM subjects WHERE id = ? AND user_id = ?',
    [req.params.id, req.userId]
  );
  if (!subject) return res.status(404).json({ error: '科目不存在' });

  const { name, color, targetScore, dailyHours, progress } = req.body;
  run(
    'UPDATE subjects SET name = ?, color = ?, target_score = ?, daily_hours = ?, progress = ? WHERE id = ?',
    [
      name ?? subject.name,
      color ?? subject.color,
      targetScore ?? subject.target_score,
      dailyHours ?? subject.daily_hours,
      progress ?? subject.progress,
      req.params.id,
    ]
  );

  const updated = queryOne('SELECT * FROM subjects WHERE id = ?', [req.params.id]);
  res.json(updated);
});

router.delete('/:id', (req, res) => {
  const subject = queryOne(
    'SELECT * FROM subjects WHERE id = ? AND user_id = ?',
    [req.params.id, req.userId]
  );
  if (!subject) return res.status(404).json({ error: '科目不存在' });

  run('DELETE FROM subjects WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

export default router;
