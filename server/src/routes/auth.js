import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { queryOne, run } from '../db.js';
import { signToken } from '../middleware/auth.js';

const router = Router();

router.post('/register', [
  body('name').trim().notEmpty().withMessage('请输入姓名'),
  body('password').isLength({ min: 6, max: 32 }).withMessage('密码需要6-32位'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const { name, email, phone, password, school, major, examYear } = req.body;
  if (!email && !phone) {
    return res.status(400).json({ error: '请提供邮箱或手机号' });
  }

  const existing = email
    ? queryOne('SELECT id FROM users WHERE email = ?', [email])
    : queryOne('SELECT id FROM users WHERE phone = ?', [phone]);

  if (existing) {
    return res.status(400).json({ error: email ? '该邮箱已注册' : '该手机号已注册' });
  }

  const hashed = bcrypt.hashSync(password, 10);
  const result = run(
    'INSERT INTO users (name, email, phone, password, school, major, exam_year) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, email || null, phone || null, hashed, school || '', major || '', examYear || 2026]
  );

  const token = signToken(result.lastInsertRowid);
  const user = queryOne(
    'SELECT id, name, email, phone, school, major, exam_year, daily_goal FROM users WHERE id = ?',
    [result.lastInsertRowid]
  );

  res.json({ token, user });
});

router.post('/login', [
  body('account').trim().notEmpty().withMessage('请输入账号'),
  body('password').notEmpty().withMessage('请输入密码'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const { account, password } = req.body;
  const user = queryOne(
    'SELECT * FROM users WHERE email = ? OR phone = ?',
    [account, account]
  );

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: '账号或密码错误' });
  }

  const token = signToken(user.id);
  const { password: _, ...safeUser } = user;
  res.json({ token, user: safeUser });
});

router.get('/me', (req, res) => {
  const user = queryOne(
    'SELECT id, name, email, phone, school, major, exam_year, daily_goal FROM users WHERE id = ?',
    [req.userId]
  );
  if (!user) return res.status(404).json({ error: '用户不存在' });
  res.json(user);
});

export default router;
