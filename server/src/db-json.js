import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = join(__dirname, 'buddhist.json');

// 内存数据库
let db = {
  users: [],
  user_settings: [],
  practice_templates: [],
  practice_records: [],
  achievements: [],
  user_achievements: [],
  verify_codes: [],
  counters: { users: 0, user_settings: 0, practice_records: 0, user_achievements: 0, verify_codes: 0 }
};

// 加载数据库
function loadDB() {
  if (existsSync(DB_PATH)) {
    try {
      db = JSON.parse(readFileSync(DB_PATH, 'utf-8'));
    } catch (e) {
      console.log('初始化新数据库');
    }
  }
}

// 保存数据库
function saveDB() {
  writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

// 初始化数据库
export function initDatabase() {
  loadDB();
  
  // 初始化预设数据
  initPresetData();
  saveDB();
}

// 初始化预设数据
function initPresetData() {
  if (db.practice_templates.length === 0) {
    db.practice_templates = [
      { id: 1, name: '念佛10遍', type: 'nianfo', category: 'general', quantity: 10, unit: '遍', duration_seconds: 30, voice_guide: '开始念佛，净念相继', sort_order: 1, is_active: true, created_at: new Date().toISOString() },
      { id: 2, name: '念佛108遍', type: 'nianfo', category: 'general', quantity: 108, unit: '遍', duration_seconds: 300, voice_guide: '南无阿弥陀佛', sort_order: 2, is_active: true, created_at: new Date().toISOString() },
      { id: 3, name: '念佛1000遍', type: 'nianfo', category: 'general', quantity: 1000, unit: '遍', duration_seconds: 2700, voice_guide: '精进念佛，万德洪名', sort_order: 3, is_active: true, created_at: new Date().toISOString() },
      { id: 4, name: '诵心经', type: 'nianjing', category: 'morning', quantity: 1, unit: '部', duration_seconds: 120, voice_guide: '开始诵经，般若波罗蜜', sort_order: 1, is_active: true, created_at: new Date().toISOString() },
      { id: 5, name: '诵阿弥陀经', type: 'nianjing', category: 'evening', quantity: 1, unit: '部', duration_seconds: 300, voice_guide: '开始诵经，极乐世界', sort_order: 1, is_active: true, created_at: new Date().toISOString() },
      { id: 6, name: '持大悲咒3遍', type: 'nianzhou', category: 'morning', quantity: 3, unit: '遍', duration_seconds: 120, voice_guide: '持咒消障，慈悲救苦', sort_order: 1, is_active: true, created_at: new Date().toISOString() },
      { id: 7, name: '持大悲咒7遍', type: 'nianzhou', category: 'morning', quantity: 7, unit: '遍', duration_seconds: 280, voice_guide: '持咒消障，慈悲救苦', sort_order: 2, is_active: true, created_at: new Date().toISOString() },
      { id: 8, name: '持大悲咒21遍', type: 'nianzhou', category: 'general', quantity: 21, unit: '遍', duration_seconds: 840, voice_guide: '持咒消障，慈悲救苦', sort_order: 3, is_active: true, created_at: new Date().toISOString() },
      { id: 9, name: '持往生咒', type: 'nianzhou', category: 'evening', quantity: 7, unit: '遍', duration_seconds: 280, voice_guide: '持往生咒，净除业障', sort_order: 1, is_active: true, created_at: new Date().toISOString() },
      { id: 10, name: '六字大明咒', type: 'nianzhou', category: 'general', quantity: 108, unit: '遍', duration_seconds: 180, voice_guide: '唵嘛呢叭咪吽', sort_order: 4, is_active: true, created_at: new Date().toISOString() },
      { id: 11, name: '礼佛3拜', type: 'baichan', category: 'general', quantity: 3, unit: '拜', duration_seconds: 60, voice_guide: '一拜消灾障', sort_order: 1, is_active: true, created_at: new Date().toISOString() },
      { id: 12, name: '礼佛7拜', type: 'baichan', category: 'general', quantity: 7, unit: '拜', duration_seconds: 140, voice_guide: '精进拜忏', sort_order: 2, is_active: true, created_at: new Date().toISOString() },
      { id: 13, name: '礼佛21拜', type: 'baichan', category: 'general', quantity: 21, unit: '拜', duration_seconds: 420, voice_guide: '诚心拜忏', sort_order: 3, is_active: true, created_at: new Date().toISOString() },
      { id: 14, name: '礼佛49拜', type: 'baichan', category: 'general', quantity: 49, unit: '拜', duration_seconds: 980, voice_guide: '大力拜忏', sort_order: 4, is_active: true, created_at: new Date().toISOString() },
      { id: 15, name: '礼佛108拜', type: 'baichan', category: 'general', quantity: 108, unit: '拜', duration_seconds: 2160, voice_guide: '圆满拜忏', sort_order: 5, is_active: true, created_at: new Date().toISOString() },
    ];
  }

  if (db.achievements.length === 0) {
    db.achievements = [
      { id: 1, code: 'first_nianfo', name: '初发心', description: '完成首次念佛', icon: '🌱', category: 'general', condition_type: 'nianfo_count', condition_value: 1, exp_reward: 50, sort_order: 1, created_at: new Date().toISOString() },
      { id: 2, code: 'first_nianjing', name: '经文通读', description: '完成首次诵经', icon: '📖', category: 'general', condition_type: 'nianjing_count', condition_value: 1, exp_reward: 50, sort_order: 2, created_at: new Date().toISOString() },
      { id: 3, code: 'nianfo_100', name: '佛号百遍', description: '累计念佛100遍', icon: '🙏', category: 'general', condition_type: 'nianfo_total', condition_value: 100, exp_reward: 100, sort_order: 3, created_at: new Date().toISOString() },
      { id: 4, code: 'nianfo_10000', name: '万遍功德', description: '累计念佛一万遍', icon: '✨', category: 'general', condition_type: 'nianfo_total', condition_value: 10000, exp_reward: 500, sort_order: 4, created_at: new Date().toISOString() },
      { id: 5, code: 'nianfo_100000', name: '十万功德', description: '累计念佛十万遍', icon: '🌟', category: 'general', condition_type: 'nianfo_total', condition_value: 100000, exp_reward: 2000, sort_order: 5, created_at: new Date().toISOString() },
      { id: 6, code: 'streak_7', name: '七日精进', description: '连续修行7天', icon: '🔥', category: 'general', condition_type: 'streak_days', condition_value: 7, exp_reward: 200, sort_order: 6, created_at: new Date().toISOString() },
      { id: 7, code: 'streak_30', name: '三十日恒', description: '连续修行30天', icon: '⛰️', category: 'general', condition_type: 'streak_days', condition_value: 30, exp_reward: 1000, sort_order: 7, created_at: new Date().toISOString() },
      { id: 8, code: 'streak_100', name: '百日修行', description: '连续修行100天', icon: '🏔️', category: 'general', condition_type: 'streak_days', condition_value: 100, exp_reward: 3000, sort_order: 8, created_at: new Date().toISOString() },
      { id: 9, code: 'practice_30', name: '修行满月', description: '累计修行30天', icon: '🌙', category: 'general', condition_type: 'total_days', condition_value: 30, exp_reward: 300, sort_order: 9, created_at: new Date().toISOString() },
      { id: 10, code: 'practice_100', name: '修行百日', description: '累计修行100天', icon: '💯', category: 'general', condition_type: 'total_days', condition_value: 100, exp_reward: 1000, sort_order: 10, created_at: new Date().toISOString() },
      { id: 11, code: 'baichan_first', name: '初次拜忏', description: '完成首次拜忏', icon: '❤️', category: 'general', condition_type: 'baichan_count', condition_value: 1, exp_reward: 50, sort_order: 11, created_at: new Date().toISOString() },
      { id: 12, code: 'level_5', name: '五级居士', description: '达到5级', icon: '🎖️', category: 'general', condition_type: 'level', condition_value: 5, exp_reward: 500, sort_order: 12, created_at: new Date().toISOString() },
      { id: 13, code: 'level_10', name: '十级行者', description: '达到10级', icon: '🏅', category: 'general', condition_type: 'level', condition_value: 10, exp_reward: 2000, sort_order: 13, created_at: new Date().toISOString() },
    ];
  }
}

// 数据库操作方法
const database = {
  prepare: (sql) => ({
    get: (...params) => executeQuery(sql, params, 'get'),
    all: (...params) => executeQuery(sql, params, 'all'),
    run: (...params) => executeQuery(sql, params, 'run'),
  })
};

// 执行查询
function executeQuery(sql, params, mode) {
  // 简化 SQL 解析
  const sqlLower = sql.toLowerCase().trim();
  
  if (sqlLower.startsWith('select')) {
    return executeSelect(sql, params, mode);
  } else if (sqlLower.startsWith('insert')) {
    return executeInsert(sql, params);
  } else if (sqlLower.startsWith('update')) {
    return executeUpdate(sql, params);
  } else if (sqlLower.startsWith('delete')) {
    return executeDelete(sql, params);
  }
  
  return null;
}

// 执行 SELECT
function executeSelect(sql, params, mode) {
  const sqlLower = sql.toLowerCase();
  
  // FROM 子句
  const fromMatch = sqlLower.match(/from\s+(\w+)/);
  if (!fromMatch) return null;
  const table = fromMatch[1];
  
  // WHERE 子句
  let results = [...(db[table] || [])];
  
  const whereMatch = sql.match(/WHERE\s+(.+?)(?:\s+ORDER|\s+LIMIT|\s*$)/i);
  if (whereMatch) {
    const whereClause = whereMatch[1];
    
    // 解析 AND 条件
    const conditions = whereClause.split(/\s+AND\s+/i);
    for (const cond of conditions) {
      if (cond.includes('=')) {
        const [field, value] = cond.split('=').map(s => s.trim());
        const fieldName = field.replace(/[\w]+\./, '').replace(/'/g, '');
        const paramIndex = params.shift();
        results = results.filter(r => String(r[fieldName]) === String(paramIndex));
      } else if (cond.includes('>')) {
        const [field, value] = cond.split('>').map(s => s.trim());
        const fieldName = field.replace(/[\w]+\./, '');
        const paramIndex = params.shift();
        results = results.filter(r => r[fieldName] > paramIndex);
      } else if (cond.includes('datetime')) {
        // datetime('now') 比较
        if (cond.includes("expires_at > datetime('now')")) {
          const now = new Date().toISOString();
          results = results.filter(r => r.expires_at > now);
        }
      }
    }
  }
  
  // ORDER BY
  const orderMatch = sql.match(/ORDER BY\s+(\w+)(?:\s+(DESC|ASC))?/i);
  if (orderMatch) {
    const orderField = orderMatch[1].replace(/[\w]+\./, '');
    const orderDir = orderMatch[2] || 'ASC';
    results.sort((a, b) => {
      if (orderDir === 'DESC') return a[orderField] > b[orderField] ? -1 : 1;
      return a[orderField] < b[orderField] ? -1 : 1;
    });
  }
  
  // LIMIT
  const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
  if (limitMatch) {
    results = results.slice(0, parseInt(limitMatch[1]));
  }
  
  if (mode === 'all') return results;
  return results[0] || null;
}

// 执行 INSERT
function executeInsert(sql, params) {
  const tableMatch = sql.match(/INSERT INTO\s+(\w+)/i);
  if (!tableMatch) return { lastInsertRowid: 0 };
  
  const table = tableMatch[1];
  const fieldsMatch = sql.match(/\(([^)]+)\)\s+VALUES/i);
  if (!fieldsMatch) return { lastInsertRowid: 0 };
  
  const fields = fieldsMatch[1].split(',').map(f => f.trim().replace(/[\w]+\./, ''));
  
  const newRecord = {};
  fields.forEach((field, i) => {
    newRecord[field] = params[i];
  });
  
  // 自动 ID
  if (!newRecord.id) {
    db.counters[table] = (db.counters[table] || 0) + 1;
    newRecord.id = db.counters[table];
  }
  
  if (!db[table]) db[table] = [];
  db[table].push(newRecord);
  saveDB();
  
  return { lastInsertRowid: newRecord.id };
}

// 执行 UPDATE
function executeUpdate(sql, params) {
  const tableMatch = sql.match(/UPDATE\s+(\w+)/i);
  if (!tableMatch) return { changes: 0 };
  
  const table = tableMatch[1];
  const setMatch = sql.match(/SET\s+(.+?)\s+WHERE/i);
  const whereMatch = sql.match(/WHERE\s+(.+)$/i);
  
  if (!setMatch || !whereMatch) return { changes: 0 };
  
  const setFields = setMatch[1].split(',').map(s => {
    const [f] = s.split('=').map(x => x.trim().replace(/[\w]+\./, ''));
    return f;
  });
  
  let changes = 0;
  db[table] = db[table].map(record => {
    let match = true;
    const whereConditions = whereMatch[1].split(/\s+AND\s+/i);
    
    for (const cond of whereConditions) {
      if (cond.includes('=')) {
        const [field, value] = cond.split('=').map(s => s.trim().replace(/[\w]+\./, '').replace(/'/g, ''));
        if (String(record[field]) !== String(params.pop())) match = false;
      }
    }
    
    if (match) {
      changes++;
      const newRecord = { ...record };
      setFields.forEach((field, i) => {
        newRecord[field] = params[i];
      });
      return newRecord;
    }
    return record;
  });
  
  saveDB();
  return { changes };
}

// 执行 DELETE
function executeDelete(sql, params) {
  const tableMatch = sql.match(/FROM\s+(\w+)/i);
  if (!tableMatch) return { changes: 0 };
  
  const table = tableMatch[1];
  const whereMatch = sql.match(/WHERE\s+(.+)$/i);
  
  if (!whereMatch) {
    db[table] = [];
    saveDB();
    return { changes: 1 };
  }
  
  let changes = 0;
  db[table] = db[table].filter(record => {
    const whereConditions = whereMatch[1].split(/\s+AND\s+/i);
    let match = true;
    
    for (const cond of whereConditions) {
      if (cond.includes('=')) {
        const [field] = cond.split('=').map(s => s.trim().replace(/[\w]+\./, '').replace(/'/g, ''));
        const paramValue = params.shift();
        if (String(record[field]) !== String(paramValue)) match = false;
      }
    }
    
    if (match) changes++;
    return !match;
  });
  
  saveDB();
  return { changes };
}

export default database;
