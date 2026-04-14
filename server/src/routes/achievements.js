import express from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// 获取成就列表（含用户进度）
router.get('/', authMiddleware, (req, res) => {
  const userId = req.user.id;

  // 获取用户已解锁成就
  const unlockedAchs = db.prepare(`
    SELECT achievement_id, unlocked_at FROM user_achievements WHERE user_id = ?
  `).all(userId);

  const unlockedMap = {};
  for (const ua of unlockedAchs) {
    unlockedMap[ua.achievement_id] = ua.unlocked_at;
  }

  // 获取用户累计数据
  const totals = db.prepare(`
    SELECT
      SUM(CASE WHEN practice_type = 'nianfo' THEN quantity ELSE 0 END) as total_nianfo,
      SUM(CASE WHEN practice_type = 'nianjing' THEN quantity ELSE 0 END) as total_nianjing,
      SUM(CASE WHEN practice_type = 'nianzhou' THEN quantity ELSE 0 END) as total_nianzhou,
      SUM(CASE WHEN practice_type = 'baichan' THEN quantity ELSE 0 END) as total_baichan
    FROM practice_records WHERE user_id = ?
  `).get(userId);

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

  // 获取所有成就
  const achievements = db.prepare(`
    SELECT * FROM achievements ORDER BY sort_order ASC
  `).all();

  const result = achievements.map(ach => {
    const isUnlocked = unlockedMap[ach.id] !== undefined;
    let current = 0;
    let target = ach.condition_value;

    if (!isUnlocked) {
      switch (ach.condition_type) {
        case 'nianfo_count':
        case 'nianfo_total':
          current = totals.total_nianfo || 0;
          break;
        case 'nianjing_count':
          current = totals.total_nianjing || 0;
          break;
        case 'nianzhou_total':
          current = totals.total_nianzhou || 0;
          break;
        case 'baichan_count':
          current = totals.total_baichan || 0;
          break;
        case 'streak_days':
          current = user.streak_days;
          break;
        case 'total_days':
          current = user.total_days;
          break;
        case 'level':
          current = user.level;
          break;
      }
    }

    return {
      id: ach.id,
      code: ach.code,
      name: ach.name,
      description: ach.description,
      icon: ach.icon,
      category: ach.category,
      expReward: ach.exp_reward,
      unlocked: isUnlocked,
      unlockedAt: unlockedMap[ach.id] || null,
      progress: {
        current: Math.min(current, target),
        target
      }
    };
  });

  res.json({
    code: 0,
    message: 'success',
    data: result
  });
});

// 获取已解锁成就
router.get('/unlocked', authMiddleware, (req, res) => {
  const userId = req.user.id;

  const achievements = db.prepare(`
    SELECT a.*, ua.unlocked_at
    FROM achievements a
    INNER JOIN user_achievements ua ON a.id = ua.achievement_id
    WHERE ua.user_id = ?
    ORDER BY ua.unlocked_at DESC
  `).all(userId);

  const total = db.prepare('SELECT COUNT(*) as count FROM achievements').get().count;

  res.json({
    code: 0,
    message: 'success',
    data: {
      count: achievements.length,
      total,
      achievements: achievements.map(ach => ({
        id: ach.id,
        code: ach.code,
        name: ach.name,
        description: ach.description,
        icon: ach.icon,
        unlockedAt: ach.unlocked_at
      }))
    }
  });
});

export default router;
