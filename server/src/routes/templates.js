import express from 'express';
import db from '../db.js';

const router = express.Router();

// 获取模板列表
router.get('/', (req, res) => {
  const { type, category } = req.query;

  let sql = 'SELECT * FROM practice_templates WHERE is_active = 1';
  const params = [];

  if (type) {
    sql += ' AND type = ?';
    params.push(type);
  }

  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }

  sql += ' ORDER BY sort_order ASC, id ASC';

  const templates = db.prepare(sql).all(...params);

  res.json({
    code: 0,
    message: 'success',
    data: templates.map(t => ({
      id: t.id,
      name: t.name,
      type: t.type,
      category: t.category,
      quantity: t.quantity,
      unit: t.unit,
      durationSeconds: t.duration_seconds,
      voiceGuide: t.voice_guide
    }))
  });
});

// 按类型获取模板
router.get('/:type', (req, res) => {
  const { type } = req.params;

  const validTypes = ['nianfo', 'nianzhou', 'nianjing', 'baichan'];
  if (!validTypes.includes(type)) {
    return res.json({
      code: 3001,
      message: '模板类型不存在',
      data: null
    });
  }

  const templates = db.prepare(`
    SELECT * FROM practice_templates
    WHERE type = ? AND is_active = 1
    ORDER BY sort_order ASC, id ASC
  `).all(type);

  res.json({
    code: 0,
    message: 'success',
    data: templates.map(t => ({
      id: t.id,
      name: t.name,
      quantity: t.quantity,
      unit: t.unit,
      durationSeconds: t.duration_seconds,
      voiceGuide: t.voice_guide
    }))
  });
});

// 获取模板详情
router.get('/detail/:id', (req, res) => {
  const { id } = req.params;

  const template = db.prepare(`
    SELECT * FROM practice_templates WHERE id = ? AND is_active = 1
  `).get(id);

  if (!template) {
    return res.json({
      code: 3001,
      message: '模板不存在',
      data: null
    });
  }

  res.json({
    code: 0,
    message: 'success',
    data: {
      id: template.id,
      name: template.name,
      type: template.type,
      category: template.category,
      quantity: template.quantity,
      unit: template.unit,
      durationSeconds: template.duration_seconds,
      voiceGuide: template.voice_guide
    }
  });
});

export default router;
