import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { queryAll, queryOne, run } from '../db.js';

const router = Router();

const PLAN_SELECT = `
  SELECT p.*, s.name as subject_name, s.color as subject_color
  FROM plans p LEFT JOIN subjects s ON p.subject_id = s.id
`;

function getPlan(id) {
  return queryOne(`${PLAN_SELECT} WHERE p.id = ?`, [id]);
}

router.get('/', (req, res) => {
  const { date } = req.query;
  let plans;
  if (date) {
    plans = queryAll(
      `${PLAN_SELECT} WHERE p.user_id = ? AND p.date = ? ORDER BY p.time ASC`,
      [req.userId, date]
    );
  } else {
    plans = queryAll(
      `${PLAN_SELECT} WHERE p.user_id = ? ORDER BY p.date DESC, p.time ASC`,
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

  res.json(getPlan(result.lastInsertRowid));
});

// Batch create recurring plans
router.post('/batch', [
  body('name').trim().notEmpty().withMessage('计划内容不能为空'),
  body('recurrence').isIn(['daily', 'weekly', 'monthly']).withMessage('请选择重复类型'),
  body('repeatStart').trim().notEmpty().withMessage('请选择开始日期'),
  body('repeatEnd').trim().notEmpty().withMessage('请选择结束日期'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const { name, subjectId, time, duration, recurrence, repeatStart, repeatEnd } = req.body;
  const dates = generateDates(recurrence, repeatStart, repeatEnd);

  const planIds = [];
  dates.forEach((date) => {
    const result = run(
      `INSERT INTO plans (user_id, subject_id, name, date, time, duration, recurrence, repeat_start, repeat_end)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.userId, subjectId || null, name, date, time || '09:00', duration || '1h', recurrence, repeatStart, repeatEnd]
    );
    planIds.push(result.lastInsertRowid);
  });

  const plans = planIds.map((id) => getPlan(id));
  res.json(plans);
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

  res.json(getPlan(req.params.id));
});

// Update timer (start/pause/reset/finish)
router.put('/:id/timer', (req, res) => {
  const plan = queryOne(
    'SELECT * FROM plans WHERE id = ? AND user_id = ?',
    [req.params.id, req.userId]
  );
  if (!plan) return res.status(404).json({ error: '计划不存在' });

  const { action, elapsedSeconds } = req.body;

  if (action === 'start') {
    run('UPDATE plans SET started_at = datetime("now") WHERE id = ?', [req.params.id]);
  } else if (action === 'pause') {
    const now = new Date();
    const started = plan.started_at ? new Date(plan.started_at) : now;
    const added = Math.floor((now - started) / 1000);
    const total = (plan.elapsed_seconds || 0) + added;
    run('UPDATE plans SET elapsed_seconds = ?, started_at = NULL WHERE id = ?', [total, req.params.id]);
  } else if (action === 'reset') {
    run('UPDATE plans SET elapsed_seconds = 0, started_at = NULL WHERE id = ?', [req.params.id]);
  } else if (action === 'finish') {
    const now = new Date();
    const started = plan.started_at ? new Date(plan.started_at) : now;
    const added = Math.floor((now - started) / 1000);
    const total = (plan.elapsed_seconds || 0) + added;
    run('UPDATE plans SET elapsed_seconds = ?, started_at = NULL, done = 1 WHERE id = ?', [total, req.params.id]);

    // Create study record
    if (total > 0) {
      const dateStr = plan.date;
      run(
        'INSERT INTO study_records (user_id, subject_id, duration_minutes, date, time_start, time_end) VALUES (?, ?, ?, ?, ?, ?)',
        [req.userId, plan.subject_id, Math.ceil(total / 60), dateStr, plan.time, now.toTimeString().slice(0, 5)]
      );
      // Update subject total_hours
      if (plan.subject_id) {
        run(
          'UPDATE subjects SET total_hours = total_hours + ? WHERE id = ?',
          [+(total / 3600).toFixed(1), plan.subject_id]
        );
      }
    }
  } else if (elapsedSeconds !== undefined) {
    run('UPDATE plans SET elapsed_seconds = ? WHERE id = ?', [elapsedSeconds, req.params.id]);
  }

  res.json(getPlan(req.params.id));
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

// Generate dates based on recurrence
function generateDates(type, startStr, endStr) {
  const dates = [];
  const start = new Date(startStr);
  const end = new Date(endStr);
  const current = new Date(start);

  while (current <= end) {
    dates.push(`${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`);
    if (type === 'daily') {
      current.setDate(current.getDate() + 1);
    } else if (type === 'weekly') {
      current.setDate(current.getDate() + 7);
    } else if (type === 'monthly') {
      current.setMonth(current.getMonth() + 1);
    }
  }
  return dates;
}

export default router;
