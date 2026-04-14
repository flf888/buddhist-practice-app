import express from 'express';
import db from '../db.js';
import { generateToken } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// 发送验证码
router.post('/send-code', (req, res) => {
  const { phone } = req.body;

  // 验证手机号格式
  if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
    return res.json({
      code: 1001,
      message: '手机号格式错误',
      data: null
    });
  }

  // 检查60秒内是否已发送
  const recentCode = db.prepare(`
    SELECT * FROM verify_codes
    WHERE phone = ? AND expires_at > datetime('now') AND created_at > datetime('now', '-60 seconds')
    ORDER BY created_at DESC LIMIT 1
  `).get(phone);

  if (recentCode) {
    return res.json({
      code: 1004,
      message: '验证码发送过于频繁，请60秒后重试',
      data: null
    });
  }

  // 生成验证码（演示环境固定为123456）
  const code = '123456';
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  // 删除旧验证码
  db.prepare('DELETE FROM verify_codes WHERE phone = ?').run(phone);

  // 插入新验证码
  db.prepare(`
    INSERT INTO verify_codes (phone, code, expires_at)
    VALUES (?, ?, ?)
  `).run(phone, code, expiresAt);

  console.log(`[验证码] 手机号 ${phone} 的验证码: ${code}`);

  res.json({
    code: 0,
    message: '验证码已发送',
    data: {
      expiresIn: 300
    }
  });
});

// 手机号登录
router.post('/login', (req, res) => {
  const { phone, code } = req.body;

  // 验证参数
  if (!phone || !code) {
    return res.json({
      code: 400,
      message: '手机号和验证码不能为空',
      data: null
    });
  }

  // 验证验证码
  const verifyRecord = db.prepare(`
    SELECT * FROM verify_codes
    WHERE phone = ? AND code = ? AND expires_at > datetime('now')
    ORDER BY created_at DESC LIMIT 1
  `).get(phone, code);

  if (!verifyRecord) {
    return res.json({
      code: 1003,
      message: '验证码错误或已过期',
      data: null
    });
  }

  // 删除已使用的验证码
  db.prepare('DELETE FROM verify_codes WHERE phone = ?').run(phone);

  // 查找或创建用户
  let user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);

  if (!user) {
    // 创建新用户
    const unionId = 'phone_' + phone + '_' + uuidv4().substring(0, 8);
    const result = db.prepare(`
      INSERT INTO users (union_id, phone, nickname)
      VALUES (?, ?, ?)
    `).run(unionId, phone, '善知识');

    user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);

    // 创建默认设置
    const defaultSettings = [
      ['morning_nianfo', 10],
      ['morning_chant', 7],
      ['morning_sutra', 1],
      ['morning_chanhui', 3],
      ['evening_nianfo', 108],
      ['evening_chant', 7],
      ['evening_sutra', 1],
      ['evening_chanhui', 3],
      ['baichan_default', 21],
    ];

    const insertSetting = db.prepare(`
      INSERT INTO user_settings (user_id, setting_key, setting_value)
      VALUES (?, ?, ?)
    `);

    for (const [key, value] of defaultSettings) {
      insertSetting.run(user.id, key, value);
    }
  }

  // 生成Token
  const token = generateToken(user);

  res.json({
    code: 0,
    message: '登录成功',
    data: {
      token,
      user: {
        id: user.id,
        unionId: user.union_id,
        nickname: user.nickname,
        phone: user.phone,
        avatarUrl: user.avatar_url,
        level: user.level,
        totalExp: user.total_exp
      }
    }
  });
});

// 微信登录（模拟）
router.post('/wechat-login', (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.json({
      code: 400,
      message: '授权码不能为空',
      data: null
    });
  }

  // 模拟微信返回的unionId（实际应该调用微信API）
  const unionId = 'wechat_' + code.substring(0, 16) + '_' + uuidv4().substring(0, 8);

  // 查找用户
  let user = db.prepare('SELECT * FROM users WHERE union_id = ?').get(unionId);

  if (!user) {
    // 创建新用户
    const result = db.prepare(`
      INSERT INTO users (union_id, nickname)
      VALUES (?, ?)
    `).run(unionId, '善知识');

    user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);

    // 创建默认设置
    const defaultSettings = [
      ['morning_nianfo', 10],
      ['morning_chant', 7],
      ['morning_sutra', 1],
      ['morning_chanhui', 3],
      ['evening_nianfo', 108],
      ['evening_chant', 7],
      ['evening_sutra', 1],
      ['evening_chanhui', 3],
      ['baichan_default', 21],
    ];

    const insertSetting = db.prepare(`
      INSERT INTO user_settings (user_id, setting_key, setting_value)
      VALUES (?, ?, ?)
    `);

    for (const [key, value] of defaultSettings) {
      insertSetting.run(user.id, key, value);
    }
  }

  // 生成Token
  const token = generateToken(user);

  const needBindPhone = !user.phone;

  res.json({
    code: 0,
    message: needBindPhone ? '请绑定手机号' : '登录成功',
    data: {
      token,
      user: {
        id: user.id,
        unionId: user.union_id,
        nickname: user.nickname,
        avatarUrl: user.avatar_url,
        phone: user.phone,
        level: user.level,
        totalExp: user.total_exp,
        needBindPhone
      }
    }
  });
});

// 退出登录
router.post('/logout', (req, res) => {
  res.json({
    code: 0,
    message: '已退出登录',
    data: null
  });
});

export default router;
