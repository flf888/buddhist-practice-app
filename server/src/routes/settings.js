import express from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// 默认设置定义
const DEFAULT_SETTINGS = {
  morning_nianfo: { default: 10, min: 1, max: 108 },
  morning_chant: { default: 7, min: 1, max: 21 },
  morning_sutra: { default: 1, min: 1, max: 3 },
  morning_chanhui: { default: 3, min: 1, max: 7 },
  evening_nianfo: { default: 108, min: 1, max: 108 },
  evening_chant: { default: 7, min: 1, max: 21 },
  evening_sutra: { default: 1, min: 1, max: 3 },
  evening_chanhui: { default: 3, min: 1, max: 7 },
  baichan_default: { default: 21, min: 3, max: 108 },
};

// 获取默认设置
router.get('/defaults', (req, res) => {
  res.json({
    code: 0,
    message: 'success',
    data: DEFAULT_SETTINGS
  });
});

// 获取用户设置
router.get('/', authMiddleware, (req, res) => {
  const userId = req.user.id;

  const settings = db.prepare(`
    SELECT setting_key, setting_value FROM user_settings WHERE user_id = ?
  `).all(userId);

  // 转换为对象
  const result = {};
  for (const [key, config] of Object.entries(DEFAULT_SETTINGS)) {
    const userSetting = settings.find(s => s.setting_key === key);
    result[key] = userSetting ? userSetting.setting_value : config.default;
  }

  res.json({
    code: 0,
    message: 'success',
    data: result
  });
});

// 更新用户设置
router.put('/', authMiddleware, (req, res) => {
  const userId = req.user.id;
  const updates = req.body;

  // 验证并更新每个设置项
  const upsertSetting = db.prepare(`
    INSERT INTO user_settings (user_id, setting_key, setting_value, updated_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id, setting_key) DO UPDATE SET
      setting_value = excluded.setting_value,
      updated_at = CURRENT_TIMESTAMP
  `);

  const errors = [];

  for (const [key, value] of Object.entries(updates)) {
    if (!DEFAULT_SETTINGS[key]) {
      errors.push(`设置项 "${key}" 不存在`);
      continue;
    }

    const config = DEFAULT_SETTINGS[key];
    if (typeof value !== 'number' || value < config.min || value > config.max) {
      errors.push(`设置项 "${key}" 的值必须在 ${config.min} 到 ${config.max} 之间`);
      continue;
    }

    upsertSetting.run(userId, key, value);
  }

  if (errors.length > 0) {
    return res.json({
      code: 4001,
      message: errors.join('; '),
      data: null
    });
  }

  // 返回更新后的设置
  const settings = db.prepare(`
    SELECT setting_key, setting_value FROM user_settings WHERE user_id = ?
  `).all(userId);

  const result = {};
  for (const [key, config] of Object.entries(DEFAULT_SETTINGS)) {
    const userSetting = settings.find(s => s.setting_key === key);
    result[key] = userSetting ? userSetting.setting_value : config.default;
  }

  res.json({
    code: 0,
    message: '设置已保存',
    data: result
  });
});

export default router;
