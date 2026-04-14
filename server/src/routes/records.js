import express from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// 经验值计算规则
const EXP_RULES = {
  nianfo: 1,     // 1遍 = 1经验
  nianzhou: 2,   // 1遍 = 2经验
  nianjing: 50,  // 1部 = 50经验
  baichan: 5     // 1拜 = 5经验
};

// 记录修行
router.post('/', authMiddleware, (req, res) => {
  const userId = req.user.id;
  const {
    templateId,
    practiceType,
    practiceName,
    quantity,
    unit,
    durationSeconds,
    practiceMode = 'smart',
    sessionType = 'general'
  } = req.body;

  // 计算经验值
  const expGained = quantity * (EXP_RULES[practiceType] || 1);

  // 获取当前用户信息
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

  // 获取今天的日期
  const today = new Date().toISOString().split('T')[0];

  // 更新连续修行天数
  let newStreakDays = user.streak_days;
  if (user.last_practice_date) {
    const lastDate = new Date(user.last_practice_date);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // 连续第二天
      newStreakDays += 1;
    } else if (diffDays > 1) {
      // 中断了
      newStreakDays = 1;
    }
    // diffDays === 0 表示同一天，不更新streak
  } else {
    newStreakDays = 1;
  }

  // 更新总天数（只有不同日期才增加）
  let newTotalDays = user.total_days;
  if (user.last_practice_date !== today) {
    newTotalDays += 1;
  }

  // 计算新经验和新等级
  const newTotalExp = user.total_exp + expGained;
  const newLevel = Math.min(20, Math.floor(newTotalExp / 100) + 1);

  // 开启事务
  const transaction = db.transaction(() => {
    // 插入修行记录
    const result = db.prepare(`
      INSERT INTO practice_records
        (user_id, template_id, practice_type, practice_name, quantity, unit, duration_seconds, practice_mode, session_type, exp_gained, practice_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(userId, templateId || null, practiceType, practiceName, quantity, unit, durationSeconds || 0, practiceMode, sessionType, expGained, today);

    // 更新用户信息
    db.prepare(`
      UPDATE users SET
        total_exp = ?,
        level = ?,
        total_days = ?,
        streak_days = ?,
        last_practice_date = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(newTotalExp, newLevel, newTotalDays, newStreakDays, today, userId);

    return result.lastInsertRowid;
  });

  const recordId = transaction();

  // 检查成就
  const unlockedAchievements = checkAchievements(userId, {
    nianfoCount: practiceType === 'nianfo' ? quantity : 0,
    nianzhouCount: practiceType === 'nianzhou' ? quantity : 0,
    nianjingCount: practiceType === 'nianjing' ? quantity : 0,
    baichanCount: practiceType === 'baichan' ? quantity : 0,
    streakDays: newStreakDays,
    totalDays: newTotalDays,
    level: newLevel
  });

  // 计算是否升级
  const oldLevel = user.level;

  res.json({
    code: 0,
    message: '修行记录已保存',
    data: {
      recordId,
      expGained,
      newLevel,
      levelUp: newLevel > oldLevel,
      unlockedAchievements
    }
  });
});

// 获取修行记录列表
router.get('/', authMiddleware, (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 20, type, startDate, endDate } = req.query;

  let sql = 'SELECT * FROM practice_records WHERE user_id = ?';
  const params = [userId];

  if (type) {
    sql += ' AND practice_type = ?';
    params.push(type);
  }

  if (startDate) {
    sql += ' AND practice_date >= ?';
    params.push(startDate);
  }

  if (endDate) {
    sql += ' AND practice_date <= ?';
    params.push(endDate);
  }

  // 获取总数
  const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as count');
  const total = db.prepare(countSql).get(...params).count;

  // 分页查询
  sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  const offset = (parseInt(page) - 1) * parseInt(limit);
  params.push(parseInt(limit), offset);

  const records = db.prepare(sql).all(...params);

  res.json({
    code: 0,
    message: 'success',
    data: {
      records: records.map(r => ({
        id: r.id,
        practiceType: r.practice_type,
        practiceName: r.practice_name,
        quantity: r.quantity,
        unit: r.unit,
        durationSeconds: r.duration_seconds,
        expGained: r.exp_gained,
        practiceDate: r.practice_date,
        createdAt: r.created_at
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    }
  });
});

// 获取修行统计
router.get('/stats', authMiddleware, (req, res) => {
  const userId = req.user.id;

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

  // 统计各类型总数
  const stats = db.prepare(`
    SELECT
      practice_type,
      SUM(quantity) as total_quantity,
      COUNT(*) as total_count
    FROM practice_records
    WHERE user_id = ?
    GROUP BY practice_type
  `).all(userId);

  const result = {
    totalNianfo: 0,
    totalNianjing: 0,
    totalNianzhou: 0,
    totalBaichan: 0,
    totalExp: user.total_exp,
    totalDays: user.total_days,
    streakDays: user.streak_days,
    lastPracticeDate: user.last_practice_date
  };

  for (const s of stats) {
    if (s.practice_type === 'nianfo') result.totalNianfo = s.total_quantity;
    if (s.practice_type === 'nianjing') result.totalNianjing = s.total_quantity;
    if (s.practice_type === 'nianzhou') result.totalNianzhou = s.total_quantity;
    if (s.practice_type === 'baichan') result.totalBaichan = s.total_quantity;
  }

  res.json({
    code: 0,
    message: 'success',
    data: result
  });
});

// 获取本周数据
router.get('/weekly', authMiddleware, (req, res) => {
  const userId = req.user.id;

  // 获取本周起始日期（周一）
  const today = new Date();
  const dayOfWeek = today.getDay() || 7;
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - dayOfWeek + 1);
  const weekStartStr = weekStart.toISOString().split('T')[0];

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  const weekEndStr = weekEnd.toISOString().split('T')[0];

  // 获取本周每天的数据
  const dailyData = db.prepare(`
    SELECT
      practice_date,
      SUM(exp_gained) as daily_exp
    FROM practice_records
    WHERE user_id = ? AND practice_date >= ? AND practice_date <= ?
    GROUP BY practice_date
    ORDER BY practice_date ASC
  `).all(userId, weekStartStr, weekEndStr);

  // 生成完整7天数据
  const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const result = [];
  let weekTotal = 0;

  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const dayData = dailyData.find(d => d.practice_date === dateStr);

    const exp = dayData ? dayData.daily_exp : 0;
    weekTotal += exp;

    result.push({
      date: dateStr,
      day: dayNames[i],
      totalExp: exp
    });
  }

  res.json({
    code: 0,
    message: 'success',
    data: {
      weekStart: weekStartStr,
      weekEnd: weekEndStr,
      dailyData: result,
      weekTotal
    }
  });
});

// 检查成就
function checkAchievements(userId, stats) {
  const unlocked = [];

  // 获取用户累计数据
  const totals = db.prepare(`
    SELECT
      SUM(CASE WHEN practice_type = 'nianfo' THEN quantity ELSE 0 END) as total_nianfo,
      SUM(CASE WHEN practice_type = 'nianjing' THEN quantity ELSE 0 END) as total_nianjing,
      SUM(CASE WHEN practice_type = 'nianzhou' THEN quantity ELSE 0 END) as total_nianzhou,
      SUM(CASE WHEN practice_type = 'baichan' THEN quantity ELSE 0 END) as total_baichan
    FROM practice_records WHERE user_id = ?
  `).get(userId);

  // 获取所有成就
  const achievements = db.prepare('SELECT * FROM achievements').all();

  // 获取用户已解锁的成就
  const unlockedIds = db.prepare(`
    SELECT achievement_id FROM user_achievements WHERE user_id = ?
  `).all(userId).map(a => a.achievement_id);

  const transaction = db.transaction(() => {
    for (const ach of achievements) {
      if (unlockedIds.includes(ach.id)) continue;

      let unlocked = false;
      let currentValue = 0;

      switch (ach.condition_type) {
        case 'nianfo_count':
          currentValue = totals.total_nianfo + stats.nianfoCount;
          unlocked = currentValue >= ach.condition_value;
          break;
        case 'nianfo_total':
          currentValue = totals.total_nianfo;
          unlocked = currentValue >= ach.condition_value;
          break;
        case 'nianjing_count':
          currentValue = totals.total_nianjing + stats.nianjingCount;
          unlocked = currentValue >= ach.condition_value;
          break;
        case 'nianzhou_total':
          currentValue = totals.total_nianzhou;
          unlocked = currentValue >= ach.condition_value;
          break;
        case 'baichan_count':
          currentValue = totals.total_baichan + stats.baichanCount;
          unlocked = currentValue >= ach.condition_value;
          break;
        case 'streak_days':
          currentValue = stats.streakDays;
          unlocked = currentValue >= ach.condition_value;
          break;
        case 'total_days':
          currentValue = stats.totalDays;
          unlocked = currentValue >= ach.condition_value;
          break;
        case 'level':
          currentValue = stats.level;
          unlocked = currentValue >= ach.condition_value;
          break;
      }

      if (unlocked) {
        db.prepare(`
          INSERT INTO user_achievements (user_id, achievement_id)
          VALUES (?, ?)
        `).run(userId, ach.id);

        // 奖励经验值
        db.prepare(`
          UPDATE users SET total_exp = total_exp + ? WHERE id = ?
        `).run(ach.exp_reward, userId);

        unlocked.push({
          code: ach.code,
          name: ach.name,
          description: ach.description,
          icon: ach.icon,
          expReward: ach.exp_reward
        });
      }
    }
  });

  if (unlocked.length > 0) {
    transaction();
  }

  return unlocked;
}

export default router;
