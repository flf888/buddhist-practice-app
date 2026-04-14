import express from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// 获取用户信息
router.get('/profile', authMiddleware, (req, res) => {
  const userId = req.user.id;

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

  if (!user) {
    return res.json({
      code: 2001,
      message: '用户不存在',
      data: null
    });
  }

  // 计算称号
  const titles = [
    { maxLevel: 2, title: '初学居士' },
    { maxLevel: 4, title: '精进居士' },
    { maxLevel: 6, title: '念佛行者' },
    { maxLevel: 8, title: '清净行者' },
    { maxLevel: 10, title: '智慧行者' },
    { maxLevel: 15, title: '菩萨行者' },
    { maxLevel: 20, title: '圆满行者' },
  ];

  const title = titles.find(t => user.level <= t.maxLevel)?.title || '圆满行者';

  // 计算升级所需经验
  const expForNextLevel = (user.level + 1) * 100;

  res.json({
    code: 0,
    message: 'success',
    data: {
      id: user.id,
      unionId: user.union_id,
      nickname: user.nickname,
      avatarUrl: user.avatar_url,
      phone: user.phone,
      level: user.level,
      title,
      totalExp: user.total_exp,
      expForNextLevel,
      totalDays: user.total_days,
      streakDays: user.streak_days,
      lastPracticeDate: user.last_practice_date,
      createdAt: user.created_at
    }
  });
});

// 更新用户信息
router.put('/profile', authMiddleware, (req, res) => {
  const userId = req.user.id;
  const { nickname, avatarUrl } = req.body;

  const updates = [];
  const values = [];

  if (nickname !== undefined) {
    updates.push('nickname = ?');
    values.push(nickname);
  }

  if (avatarUrl !== undefined) {
    updates.push('avatar_url = ?');
    values.push(avatarUrl);
  }

  if (updates.length === 0) {
    return res.json({
      code: 400,
      message: '没有需要更新的字段',
      data: null
    });
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(userId);

  db.prepare(`
    UPDATE users SET ${updates.join(', ')} WHERE id = ?
  `).run(...values);

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

  res.json({
    code: 0,
    message: '更新成功',
    data: {
      id: user.id,
      nickname: user.nickname,
      avatarUrl: user.avatar_url
    }
  });
});

export default router;
