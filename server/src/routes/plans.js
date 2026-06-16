import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { queryAll, queryOne, run } from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  const { date } = req.query;
  let plans;
  if (date) {
    plans = queryAll(
      `SELECT p.*, s.name as subject_name, s.color as subject_color
       FROM plans p LEFT JOIN subjects s ON p.subject_id = s.id
       WHERE p.user_id = ? AND p.date = ?
       ORDER BY p.time ASC`,
      [req.userId, date]
    );
  } else {
    plans = queryAll(
      `SELECT p.*, s.name as subject_name, s.color as subject_color
       FROM plans p LEFT JOIN subjects s ON p.subject_id = s.id
       WHERE p.user_id = ?
       ORDER BY p.date DESC, p.time ASC`,
      [req.userId]
    );
  }
  res.json(plans);
});

router.post('/', [
  body('name').trim().notEmpty().withMessage('计划内容不能为空'),
  body('date').trim().notEmpty().withMessage('请选择日期'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const { name, subjectId, date, time, duration } = req.body;
  const result = run(
    'INSERT INTO plans (user_id, subject_id, name, date, time, duration) VALUES (?, ?, ?, ?, ?, ?)',
    [req.userId, subjectId || null, name, date, time || '09:00', duration || '1h']
  );

  const plan = queryOne(
    `SELECT p.*, s.name as subject_name, s.color as subject_color
     FROM plans p LEFT JOIN subjects s ON p.subject_id = s.id
     WHERE p.id = ?`,
    [result.lastInsertRowid]
  );
  res.json(plan);
});

router.put('/:id', (req, res) => {
  const plan = queryOne(
    'SELECT * FROM plans WHERE id = ? AND user_id = ?',
    [req.params.id, req.userId]
  );
  if (!plan) return res.status(404).json({ error: '计划不存在' });

  const { name, subjectId, date, time, duration, done } = req.body;
  run(
    'UPDATE plans SET name = ?, subject_id = ?, date = ?, time = ?, duration = ?, done = ? WHERE id = ?',
    [
      name ?? plan.name,
      subjectId !== undefined ? subjectId : plan.subject_id,
      date ?? plan.date,
      time ?? plan.time,
      duration ?? plan.duration,
      done !== undefined ? (done ? 1 : 0) : plan.done,
      req.params.id,
    ]
  );

  const updated = queryOne(
    `SELECT p.*, s.name as subject_name, s.color as subject_color
     FROM plans p LEFT JOIN subjects s ON p.subject_id = s.id
     WHERE p.id = ?`,
    [req.params.id]
  );
  res.json(updated);
});

router.delete('/:id', (req, res) => {
  const plan = queryOne(
    'SELECT * FROM plans WHERE id = ? AND user_id = ?',
    [req.params.id, req.userId]
  );
  if (!plan) return res.status(404).json({ error: '计划不存在' });

  run('DELETE FROM plans WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

export default router;
