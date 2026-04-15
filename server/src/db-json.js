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
      // ========== 念佛模板 (nianfo) ==========
      { id: 1, name: '念佛10遍', type: 'nianfo', category: 'general', quantity: 10, unit: '遍', duration_seconds: 30, voice_guide: '开始念佛，净念相继', sort_order: 1, is_active: 1, created_at: new Date().toISOString() },
      { id: 2, name: '念佛108遍', type: 'nianfo', category: 'general', quantity: 108, unit: '遍', duration_seconds: 300, voice_guide: '南无阿弥陀佛', sort_order: 2, is_active: 1, created_at: new Date().toISOString() },
      { id: 3, name: '念佛1000遍', type: 'nianfo', category: 'general', quantity: 1000, unit: '遍', duration_seconds: 2700, voice_guide: '精进念佛，万德洪名', sort_order: 3, is_active: 1, created_at: new Date().toISOString() },

      // ========== 诵经模板 (nianjing) ==========
      { id: 4, name: '诵心经', type: 'nianjing', category: 'morning', quantity: 1, unit: '部', duration_seconds: 120, voice_guide: '开始诵经，般若波罗蜜', sort_order: 1, is_active: 1, created_at: new Date().toISOString() },
      { id: 5, name: '诵阿弥陀经', type: 'nianjing', category: 'evening', quantity: 1, unit: '部', duration_seconds: 300, voice_guide: '开始诵经，极乐世界', sort_order: 2, is_active: 1, created_at: new Date().toISOString() },
      { id: 16, name: '诵大悲咒', type: 'nianjing', category: 'general', quantity: 1, unit: '部', duration_seconds: 180, voice_guide: '大悲神咒，妙用难测', sort_order: 3, is_active: 1, created_at: new Date().toISOString() },
      { id: 17, name: '诵地藏经', type: 'nianjing', category: 'general', quantity: 1, unit: '品', duration_seconds: 600, voice_guide: '地藏菩萨本愿经', sort_order: 4, is_active: 1, created_at: new Date().toISOString() },

      // ========== 持咒模板 (nianzhou) ==========
      { id: 6, name: '持大悲咒3遍', type: 'nianzhou', category: 'morning', quantity: 3, unit: '遍', duration_seconds: 120, voice_guide: '持咒消障，慈悲救苦', sort_order: 1, is_active: 1, created_at: new Date().toISOString() },
      { id: 7, name: '持大悲咒7遍', type: 'nianzhou', category: 'morning', quantity: 7, unit: '遍', duration_seconds: 280, voice_guide: '持咒消障，慈悲救苦', sort_order: 2, is_active: 1, created_at: new Date().toISOString() },
      { id: 8, name: '持大悲咒21遍', type: 'nianzhou', category: 'general', quantity: 21, unit: '遍', duration_seconds: 840, voice_guide: '持咒消障，慈悲救苦', sort_order: 3, is_active: 1, created_at: new Date().toISOString() },
      { id: 9, name: '持往生咒', type: 'nianzhou', category: 'evening', quantity: 7, unit: '遍', duration_seconds: 280, voice_guide: '持往生咒，净除业障', sort_order: 4, is_active: 1, created_at: new Date().toISOString() },
      { id: 10, name: '六字大明咒', type: 'nianzhou', category: 'general', quantity: 108, unit: '遍', duration_seconds: 180, voice_guide: '唵嘛呢叭咪吽', sort_order: 5, is_active: 1, created_at: new Date().toISOString() },

      // ========== 忏悔模板 (chanhui) ==========
      { id: 18, name: '忏悔三礼', type: 'chanhui', category: 'morning', quantity: 3, unit: '遍', duration_seconds: 60, voice_guide: '往昔所造诸恶业，皆由无始贪嗔痴', sort_order: 1, is_active: 1, created_at: new Date().toISOString() },
      { id: 19, name: '忏悔七礼', type: 'chanhui', category: 'general', quantity: 7, unit: '遍', duration_seconds: 140, voice_guide: '从身语意之所生，今对佛前皆忏悔', sort_order: 2, is_active: 1, created_at: new Date().toISOString() },
      { id: 20, name: '礼佛大忏悔文', type: 'chanhui', category: 'general', quantity: 1, unit: '遍', duration_seconds: 300, voice_guide: '大慈大悲愍众生，礼敬诸佛消业障', sort_order: 3, is_active: 1, created_at: new Date().toISOString() },

      // ========== 拜忏模板 (baichan) ==========
      { id: 11, name: '礼佛3拜', type: 'baichan', category: 'general', quantity: 3, unit: '拜', duration_seconds: 60, voice_guide: '一拜消灾障', sort_order: 1, is_active: 1, created_at: new Date().toISOString() },
      { id: 12, name: '礼佛7拜', type: 'baichan', category: 'general', quantity: 7, unit: '拜', duration_seconds: 140, voice_guide: '精进拜忏', sort_order: 2, is_active: 1, created_at: new Date().toISOString() },
      { id: 13, name: '礼佛21拜', type: 'baichan', category: 'general', quantity: 21, unit: '拜', duration_seconds: 420, voice_guide: '诚心拜忏', sort_order: 3, is_active: 1, created_at: new Date().toISOString() },
      { id: 14, name: '礼佛49拜', type: 'baichan', category: 'general', quantity: 49, unit: '拜', duration_seconds: 980, voice_guide: '大力拜忏', sort_order: 4, is_active: 1, created_at: new Date().toISOString() },
      { id: 15, name: '礼佛108拜', type: 'baichan', category: 'general', quantity: 108, unit: '拜', duration_seconds: 2160, voice_guide: '圆满拜忏', sort_order: 5, is_active: 1, created_at: new Date().toISOString() },
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

// ===================== SQL 参数提取工具 =====================

// 从 SQL 片段中提取所有 ? 的位置和参数映射
// 返回 { paramCount, getParam } 用于正确消费 params 数组
function createParamConsumer(params) {
  let idx = 0;
  return {
    consume: () => params[idx++],
    peek: () => params[idx],
    idx: () => idx
  };
}

// ===================== WHERE 条件求值 =====================

function evaluateWhereClause(whereClause, record, paramsConsumer) {
  if (!whereClause) return true;
  
  const conditions = whereClause.split(/\s+AND\s+/i);
  
  for (const cond of conditions) {
    const condTrimmed = cond.trim();
    
    // datetime 比较 - 不消耗 params
    if (condTrimmed.includes('datetime')) {
      if (condTrimmed.includes("expires_at > datetime('now')")) {
        const now = new Date().toISOString();
        if (!(record.expires_at > now)) return false;
        continue;
      }
      if (condTrimmed.includes("created_at > datetime('now'")) {
        const secondsMatch = condTrimmed.match(/datetime\('now',\s*'[-+]?(\d+)\s*seconds'\)/);
        const seconds = secondsMatch ? parseInt(secondsMatch[1]) : 0;
        const targetTime = new Date(Date.now() - seconds * 1000).toISOString();
        const fieldMatch = condTrimmed.match(/(\w+)\s*>/);
        const fieldName = fieldMatch ? fieldMatch[1].replace(/[\w]+\./, '') : 'created_at';
        if (!(record[fieldName] > targetTime)) return false;
        continue;
      }
    }
    
    // LIKE 操作
    if (condTrimmed.includes(' LIKE ')) {
      const [field, value] = condTrimmed.split(/\s+LIKE\s+/i).map(s => s.trim());
      const fieldName = field.replace(/[\w]+\./, '').replace(/'/g, '');
      let pattern;
      if (value === '?') {
        pattern = String(paramsConsumer.consume());
      } else {
        pattern = value.replace(/'/g, '');
      }
      // 简化 LIKE：支持 % 通配符
      const regex = new RegExp('^' + pattern.replace(/%/g, '.*').replace(/_/g, '.') + '$', 'i');
      if (!regex.test(String(record[fieldName] || ''))) return false;
      continue;
    }
    
    // >= 操作
    if (condTrimmed.includes('>=') ) {
      const [field, value] = condTrimmed.split('>=').map(s => s.trim());
      const fieldName = field.replace(/[\w]+\./, '').replace(/'/g, '');
      let paramValue;
      if (value === '?') {
        paramValue = paramsConsumer.consume();
      } else {
        paramValue = value.replace(/'/g, '');
        if (paramValue !== '' && !isNaN(Number(paramValue))) paramValue = Number(paramValue);
      }
      if (!(compareValues(record[fieldName], paramValue) >= 0)) return false;
      continue;
    }
    
    // <= 操作
    if (condTrimmed.includes('<=')) {
      const [field, value] = condTrimmed.split('<=').map(s => s.trim());
      const fieldName = field.replace(/[\w]+\./, '').replace(/'/g, '');
      let paramValue;
      if (value === '?') {
        paramValue = paramsConsumer.consume();
      } else {
        paramValue = value.replace(/'/g, '');
        if (paramValue !== '' && !isNaN(Number(paramValue))) paramValue = Number(paramValue);
      }
      if (!(compareValues(record[fieldName], paramValue) <= 0)) return false;
      continue;
    }
    
    // != 或 <> 操作
    if (condTrimmed.includes('!=') || condTrimmed.includes('<>')) {
      const parts = condTrimmed.split(/!=|<>/);
      const [field, value] = parts.map(s => s.trim());
      const fieldName = field.replace(/[\w]+\./, '').replace(/'/g, '');
      let paramValue;
      if (value === '?') {
        paramValue = paramsConsumer.consume();
      } else {
        paramValue = value.replace(/'/g, '');
        if (paramValue !== '' && !isNaN(Number(paramValue))) paramValue = Number(paramValue);
      }
      if (String(record[fieldName]) === String(paramValue)) return false;
      continue;
    }
    
    // > 操作（非 datetime）
    if (condTrimmed.includes('>') && !condTrimmed.includes('datetime')) {
      const [field, value] = condTrimmed.split('>').map(s => s.trim());
      const fieldName = field.replace(/[\w]+\./, '').replace(/'/g, '');
      let paramValue;
      if (value === '?') {
        paramValue = paramsConsumer.consume();
      } else {
        paramValue = value.replace(/'/g, '');
        if (paramValue !== '' && !isNaN(Number(paramValue))) paramValue = Number(paramValue);
      }
      if (!(compareValues(record[fieldName], paramValue) > 0)) return false;
      continue;
    }
    
    // < 操作
    if (condTrimmed.includes('<') && !condTrimmed.includes('<=') && !condTrimmed.includes('<>')) {
      const [field, value] = condTrimmed.split('<').map(s => s.trim());
      const fieldName = field.replace(/[\w]+\./, '').replace(/'/g, '');
      let paramValue;
      if (value === '?') {
        paramValue = paramsConsumer.consume();
      } else {
        paramValue = value.replace(/'/g, '');
        if (paramValue !== '' && !isNaN(Number(paramValue))) paramValue = Number(paramValue);
      }
      if (!(compareValues(record[fieldName], paramValue) < 0)) return false;
      continue;
    }
    
    // = 操作
    if (condTrimmed.includes('=')) {
      const [field, value] = condTrimmed.split('=').map(s => s.trim());
      const fieldName = field.replace(/[\w]+\./, '').replace(/'/g, '');
      let paramValue;
      if (value === '?') {
        paramValue = paramsConsumer.consume();
      } else {
        // SQL 中直接写的值
        paramValue = value.replace(/'/g, '');
        if (paramValue !== '' && !isNaN(Number(paramValue))) {
          paramValue = Number(paramValue);
        }
      }
      const recordVal = record[fieldName];
      const match = equalValues(recordVal, paramValue);
      if (!match) {
        console.log(`[DEBUG WHERE] NO MATCH: field="${fieldName}" recordVal="${JSON.stringify(recordVal)}" paramValue="${JSON.stringify(paramValue)}" recordKeys="${Object.keys(record).join(',')}"`);
        return false;
      }
      continue;
    }
  }
  
  return true;
}

// 值比较工具函数
function compareValues(a, b) {
  const na = Number(a);
  const nb = Number(b);
  if (!isNaN(na) && !isNaN(nb)) return na - nb;
  return String(a || '').localeCompare(String(b || ''));
}

function equalValues(rowVal, paramValue) {
  // 布尔值与数字的兼容比较
  if (typeof rowVal === 'boolean' && typeof paramValue === 'number') {
    return rowVal ? paramValue === 1 : paramValue === 0;
  }
  if (typeof paramValue === 'boolean' && typeof rowVal === 'number') {
    return paramValue ? rowVal === 1 : rowVal === 0;
  }
  return String(rowVal) === String(paramValue);
}

// ===================== SELECT 列解析（含聚合函数） =====================

// 解析 SELECT 子句，返回列定义数组
function parseSelectColumns(selectClause) {
  const columns = [];
  let depth = 0;
  let current = '';
  
  for (let i = 0; i < selectClause.length; i++) {
    const ch = selectClause[i];
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) {
      columns.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) columns.push(current.trim());
  
  return columns.map(col => {
    // SUM(CASE WHEN practice_type = 'nianfo' THEN quantity ELSE 0 END) as total_nianfo
    const aliasMatch = col.match(/\bAS\s+(\w+)\s*$/i);
    const alias = aliasMatch ? aliasMatch[1] : null;
    const expr = aliasMatch ? col.substring(0, col.length - aliasMatch[0].length).trim() : col;
    
    // 检测聚合函数
    const sumMatch = expr.match(/^SUM\((.+)\)$/i);
    const countMatch = expr.match(/^COUNT\((.+)\)$/i);
    const avgMatch = expr.match(/^AVG\((.+)\)$/i);
    const maxMatch = expr.match(/^MAX\((.+)\)$/i);
    const minMatch = expr.match(/^MIN\((.+)\)$/i);
    
    if (sumMatch) {
      return { type: 'SUM', inner: sumMatch[1].trim(), alias: alias || 'SUM' };
    }
    if (countMatch) {
      const inner = countMatch[1].trim();
      if (inner === '*') {
        return { type: 'COUNT', inner: '*', alias: alias || 'COUNT' };
      }
      return { type: 'COUNT', inner, alias: alias || 'COUNT' };
    }
    if (avgMatch) {
      return { type: 'AVG', inner: avgMatch[1].trim(), alias: alias || 'AVG' };
    }
    if (maxMatch) {
      return { type: 'MAX', inner: maxMatch[1].trim(), alias: alias || 'MAX' };
    }
    if (minMatch) {
      return { type: 'MIN', inner: minMatch[1].trim(), alias: alias || 'MIN' };
    }
    
    // CASE WHEN 表达式（最外层不是聚合函数但包含 CASE）
    if (expr.match(/^CASE\b/i)) {
      return { type: 'CASE', expr, alias: alias || 'CASE' };
    }
    
    // 普通列：可能带表前缀
    const fieldName = expr.replace(/[\w]+\./, '').replace(/'/g, '');
    return { type: 'FIELD', name: fieldName, alias: alias || fieldName, expr };
  });
}

// 对一组记录计算聚合值
function evaluateAggregate(aggDef, records) {
  if (aggDef.type === 'COUNT') {
    if (aggDef.inner === '*') {
      return records.length;
    }
    return records.filter(r => r[aggDef.inner] != null).length;
  }
  
  if (aggDef.type === 'SUM') {
    // inner 可能是 CASE WHEN 表达式
    if (aggDef.inner.match(/^CASE\b/i)) {
      return records.reduce((sum, r) => sum + evaluateCaseWhen(aggDef.inner, r), 0);
    }
    // 简单字段名
    const fieldName = aggDef.inner.replace(/[\w]+\./, '');
    return records.reduce((sum, r) => sum + (Number(r[fieldName]) || 0), 0);
  }
  
  if (aggDef.type === 'AVG') {
    const fieldName = aggDef.inner.replace(/[\w]+\./, '');
    if (records.length === 0) return 0;
    return records.reduce((sum, r) => sum + (Number(r[fieldName]) || 0), 0) / records.length;
  }
  
  if (aggDef.type === 'MAX') {
    const fieldName = aggDef.inner.replace(/[\w]+\./, '');
    return Math.max(...records.map(r => Number(r[fieldName]) || 0));
  }
  
  if (aggDef.type === 'MIN') {
    const fieldName = aggDef.inner.replace(/[\w]+\./, '');
    return Math.min(...records.map(r => Number(r[fieldName]) || 0));
  }
  
  // CASE WHEN 在 SUM 外面，如 SUM(CASE...)
  // 实际上不会走到这里，因为被 SUM 捕获了
  return 0;
}

// 解析并求值 CASE WHEN 表达式
function evaluateCaseWhen(expr, record) {
  // CASE WHEN practice_type = 'nianfo' THEN quantity ELSE 0 END
  // 或嵌套: SUM(CASE WHEN ... THEN quantity ELSE 0 END)
  
  // 提取所有 WHEN ... THEN ... 分支
  const whenRegex = /WHEN\s+(.+?)\s+THEN\s+(.+?)(?=\s+WHEN|\s+ELSE|\s+END)/gi;
  let match;
  const branches = [];
  
  while ((match = whenRegex.exec(expr)) !== null) {
    branches.push({
      condition: match[1].trim(),
      result: match[2].trim()
    });
  }
  
  // 提取 ELSE 值
  const elseMatch = expr.match(/ELSE\s+(.+?)\s+END/i);
  const elseValue = elseMatch ? elseMatch[1].trim() : '0';
  
  for (const branch of branches) {
    if (evaluateSimpleCondition(branch.condition, record)) {
      return resolveFieldValue(branch.result, record);
    }
  }
  
  return resolveFieldValue(elseValue, record);
}

// 评估简单条件（如 practice_type = 'nianfo'）
function evaluateSimpleCondition(condition, record) {
  // 支持 =, !=, <>, >, <, >=, <=
  const ops = ['>=', '<=', '!=', '<>', '>', '<', '='];
  for (const op of ops) {
    if (condition.includes(op)) {
      const [left, right] = condition.split(op).map(s => s.trim());
      const leftVal = resolveFieldValue(left, record);
      let rightVal = right.replace(/'/g, '');
      if (rightVal !== '' && !isNaN(Number(rightVal))) rightVal = Number(rightVal);
      return equalOrCompare(leftVal, rightVal, op);
    }
  }
  return false;
}

function equalOrCompare(left, right, op) {
  switch (op) {
    case '=': return String(left) === String(right);
    case '!=': case '<>': return String(left) !== String(right);
    case '>': return compareValues(left, right) > 0;
    case '<': return compareValues(left, right) < 0;
    case '>=': return compareValues(left, right) >= 0;
    case '<=': return compareValues(left, right) <= 0;
    default: return false;
  }
}

// 解析字段值
function resolveFieldValue(expr, record) {
  const trimmed = expr.trim();
  // 数字
  if (!isNaN(Number(trimmed)) && trimmed !== '') return Number(trimmed);
  // 字符串字面量
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) return trimmed.slice(1, -1);
  // 字段名
  const fieldName = trimmed.replace(/[\w]+\./, '');
  return record[fieldName] != null ? record[fieldName] : 0;
}

// ===================== 数据库操作方法 =====================

const database = {
  prepare: (sql) => ({
    get: (...params) => executeQuery(sql, params, 'get'),
    all: (...params) => executeQuery(sql, params, 'all'),
    run: (...params) => executeQuery(sql, params, 'run'),
  }),
  
  // 事务支持：better-sqlite3 风格，返回可调用函数
  transaction: (fn) => {
    // 返回一个可延迟调用的函数
    return (...args) => {
      try {
        const result = fn(...args);
        saveDB();
        return result;
      } catch (e) {
        // 事务失败，重新加载数据库回滚
        loadDB();
        throw e;
      }
    };
  }
};

// 执行查询
function executeQuery(sql, params, mode) {
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
  
  console.log('[DEBUG executeQuery] Unknown SQL type:', sql.substring(0, 50));
  return null;
}

// ===================== SELECT 执行 =====================

function executeSelect(sql, params, mode) {
  const sqlLower = sql.toLowerCase();
  
  // FROM 子句
  const fromMatch = sqlLower.match(/from\s+(\w+)/);
  if (!fromMatch) return null;
  const table = fromMatch[1];
  
  // 获取表数据
  let results = [...(db[table] || [])];

  // 解析 SELECT 列
  const selectMatch = sql.match(/SELECT\s+(.+?)\s+FROM/i);
  const selectClause = selectMatch ? selectMatch[1] : '*';
  const columns = parseSelectColumns(selectClause);
  
  // 检测是否有聚合函数
  const hasAggregation = columns.some(c => ['SUM', 'COUNT', 'AVG', 'MAX', 'MIN', 'CASE'].includes(c.type));

  // WHERE 子句
  const whereMatch = sql.match(/WHERE\s+(.+?)(?:\s+GROUP|\s+ORDER|\s+LIMIT|\s*$)/i);
  if (whereMatch) {
    console.log(`[DEBUG SELECT] WHERE clause: "${whereMatch[1]}", params: ${JSON.stringify(params)}, table records: ${results.length}`);
    results = results.filter(r => {
      const paramsConsumer = createParamConsumer(params); // 每个记录重新创建
      return evaluateWhereClause(whereMatch[1], r, paramsConsumer);
    });
    console.log(`[DEBUG SELECT] After filter: ${results.length} records`);
  }

  // GROUP BY
  const groupMatch = sql.match(/GROUP BY\s+(.+?)(?:\s+HAVING|\s+ORDER|\s+LIMIT|\s*$)/i);
  
  if (hasAggregation || groupMatch) {
    // 聚合查询
    if (groupMatch) {
      const groupFields = groupMatch[1].split(',').map(f => f.trim().replace(/[\w]+\./, ''));
      
      // 分组
      const groups = {};
      for (const r of results) {
        const key = groupFields.map(f => String(r[f] ?? '')).join('|||');
        if (!groups[key]) groups[key] = [];
        groups[key].push(r);
      }
      
      // 对每个分组计算聚合
      const aggregatedResults = [];
      for (const [key, groupRecords] of Object.entries(groups)) {
        const row = {};
        // 写入分组字段值
        groupFields.forEach((f, i) => {
          row[f] = groupRecords[0][f];
        });
        // 计算聚合列
        for (const col of columns) {
          if (col.type === 'FIELD' && !groupFields.includes(col.name)) continue;
          if (col.alias && col.type !== 'FIELD') {
            row[col.alias] = evaluateAggregate(col, groupRecords);
          }
          if (col.type === 'FIELD' && groupFields.includes(col.name)) {
            row[col.alias] = groupRecords[0][col.name];
          }
        }
        aggregatedResults.push(row);
      }
      
      results = aggregatedResults;
    } else {
      // 整体聚合（无 GROUP BY，返回单行结果）
      const row = {};
      for (const col of columns) {
        if (col.type === 'FIELD') {
          // 非聚合的普通列，取第一条记录的值（如果有记录）
          row[col.alias] = results.length > 0 ? results[0][col.name] : null;
        } else if (col.type === 'CASE') {
          // SUM 外层的 CASE WHEN（较少见，通常在 SUM 内部）
          row[col.alias] = results.reduce((sum, r) => sum + evaluateCaseWhen(col.expr, r), 0);
        } else {
          row[col.alias] = evaluateAggregate(col, results);
        }
      }
      results = [row];
    }
  }
  
  // ORDER BY
  const orderMatch = sql.match(/ORDER BY\s+(.+?)(?:\s+LIMIT|\s*$)/i);
  if (orderMatch) {
    const orderParts = orderMatch[1].split(',').map(p => p.trim());
    results.sort((a, b) => {
      for (const part of orderParts) {
        const [field, dir] = part.split(/\s+/);
        const fieldName = field.replace(/[\w]+\./, '');
        const desc = (dir || '').toUpperCase() === 'DESC';
        const cmp = compareValues(a[fieldName], b[fieldName]);
        if (cmp !== 0) return desc ? -cmp : cmp;
      }
      return 0;
    });
  }
  
  // LIMIT
  const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
  if (limitMatch) {
    results = results.slice(0, parseInt(limitMatch[1]));
  }
  
  // 如果没有聚合也没有 GROUP BY，构建输出（字段映射）
  if (!hasAggregation && !groupMatch) {
    // 仅当 SELECT 不是 * 时做字段映射
    if (selectClause !== '*') {
      results = results.map(r => {
        const row = {};
        for (const col of columns) {
          if (col.type === 'FIELD') {
            row[col.alias] = r[col.name];
          }
        }
        return row;
      });
    }
  }
  
  if (mode === 'all') return results;
  return results[0] || null;
}

// ===================== INSERT 执行 =====================

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
  
  // 自动 created_at
  if (!newRecord.created_at) {
    newRecord.created_at = new Date().toISOString();
  }
  
  if (!db[table]) db[table] = [];
  db[table].push(newRecord);
  saveDB();
  
  return { lastInsertRowid: newRecord.id };
}

// ===================== UPDATE 执行（修复参数映射 bug） =====================

function executeUpdate(sql, params) {
  console.log('[DEBUG executeUpdate] SQL:', sql.replace(/\n/g, ' ').substring(0, 120), 'params:', JSON.stringify(params));
  const tableMatch = sql.match(/UPDATE\s+(\w+)/i);
  if (!tableMatch) return { changes: 0 };
  
  const table = tableMatch[1];
  const setMatch = sql.match(/SET\s+(.+?)\s+WHERE/is);
  const whereMatch = sql.match(/WHERE\s+(.+)$/is);
  
  console.log('[DEBUG executeUpdate] table:', table, 'setMatch:', !!setMatch, 'whereMatch:', !!whereMatch, 'whereClause:', whereMatch ? whereMatch[1] : 'null');
  
  if (!setMatch || !whereMatch) return { changes: 0 };
  
  // 解析 SET 子句中的字段名和 ? 数量
  const setParts = setMatch[1].split(',').map(s => s.trim());
  const setFields = [];
  let setParamCount = 0;
  
  for (const part of setParts) {
    const [fieldExpr, valueExpr] = part.split('=').map(x => x.trim());
    const fieldName = fieldExpr.replace(/[\w]+\./, '');
    setFields.push({
      field: fieldName,
      isParam: valueExpr.trim() === '?',
      // 如果值是表达式如 total_exp + ?，需要特殊处理
      isExpression: valueExpr.includes('+') || valueExpr.includes('-'),
      valueExpr: valueExpr.trim()
    });
    // 计算这个 SET 部分消耗了多少个 ?
    const questionMarks = (valueExpr.match(/\?/g) || []).length;
    setParamCount += questionMarks;
  }
  
  // 参数分配：SET 部分取前 setParamCount 个参数，WHERE 部分取剩余
  const setParams = params.slice(0, setParamCount);
  const whereParams = params.slice(setParamCount);
  
  console.log(`[DEBUG UPDATE] table=${table} setFields=${JSON.stringify(setFields)} setParamCount=${setParamCount} setParams=${JSON.stringify(setParams)} whereParams=${JSON.stringify(whereParams)} allParams=${JSON.stringify(params)}`);
  
  let changes = 0;
  let setParamIdx = 0;
  
  db[table] = db[table].map(record => {
    const paramsConsumer = createParamConsumer(whereParams);
    if (!evaluateWhereClause(whereMatch[1], record, paramsConsumer)) {
      return record;
    }
    
    // 匹配，执行更新
    changes++;
    const newRecord = { ...record };
    setParamIdx = 0;  // 重置，每条记录都要从0开始
    
    for (const sf of setFields) {
      if (sf.isParam) {
        newRecord[sf.field] = setParams[setParamIdx++];
      } else if (sf.isExpression) {
        // 如 total_exp = total_exp + ?
        const currentVal = Number(record[sf.field]) || 0;
        const exprParts = sf.valueExpr.split(/([+-])/);
        let val = currentVal;
        for (let i = 0; i < exprParts.length; i++) {
          const part = exprParts[i].trim();
          if (part === '?') {
            const op = exprParts[i - 1];
            const num = setParams[setParamIdx++];
            if (op === '+') val += Number(num) || 0;
            else if (op === '-') val -= Number(num) || 0;
          }
        }
        newRecord[sf.field] = val;
      } else if (sf.valueExpr === 'CURRENT_TIMESTAMP') {
        newRecord[sf.field] = new Date().toISOString();
      } else {
        // 直接写的值
        let val = sf.valueExpr.replace(/'/g, '');
        if (val !== '' && !isNaN(Number(val))) val = Number(val);
        newRecord[sf.field] = val;
      }
    }
    
    return newRecord;
  });
  
  saveDB();
  return { changes };
}

// ===================== DELETE 执行 =====================

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
  const paramsConsumer = createParamConsumer([...params]);
  
  db[table] = db[table].filter(record => {
    const pc = createParamConsumer([...params]);
    if (evaluateWhereClause(whereMatch[1], record, pc)) {
      changes++;
      return false;
    }
    return true;
  });
  
  saveDB();
  return { changes };
}

export default database;
