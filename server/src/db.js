import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'buddhist.db'));

// 启用外键约束
db.pragma('foreign_keys = ON');

// 初始化数据库表
export function initDatabase() {
  // 用户表
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      union_id VARCHAR(64) UNIQUE,
      open_id VARCHAR(64),
      nickname VARCHAR(50) DEFAULT '善知识',
      avatar_url VARCHAR(255),
      phone VARCHAR(11) UNIQUE,
      level INTEGER DEFAULT 1,
      total_exp INTEGER DEFAULT 0,
      total_days INTEGER DEFAULT 0,
      streak_days INTEGER DEFAULT 0,
      last_practice_date DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 用户设置表
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      setting_key VARCHAR(50) NOT NULL,
      setting_value INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, setting_key)
    )
  `);

  // 功课模板表
  db.exec(`
    CREATE TABLE IF NOT EXISTS practice_templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(50) NOT NULL,
      type VARCHAR(20) NOT NULL,
      category VARCHAR(20) DEFAULT 'general',
      quantity INTEGER NOT NULL,
      unit VARCHAR(10) NOT NULL,
      duration_seconds INTEGER NOT NULL,
      voice_guide TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 修行记录表
  db.exec(`
    CREATE TABLE IF NOT EXISTS practice_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      template_id INTEGER,
      practice_type VARCHAR(20) NOT NULL,
      practice_name VARCHAR(50) NOT NULL,
      quantity INTEGER NOT NULL,
      unit VARCHAR(10) NOT NULL,
      duration_seconds INTEGER,
      practice_mode VARCHAR(20) DEFAULT 'smart',
      session_type VARCHAR(20),
      exp_gained INTEGER DEFAULT 0,
      practice_date DATE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (template_id) REFERENCES practice_templates(id) ON DELETE SET NULL
    )
  `);

  // 成就表
  db.exec(`
    CREATE TABLE IF NOT EXISTS achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code VARCHAR(50) UNIQUE NOT NULL,
      name VARCHAR(50) NOT NULL,
      description VARCHAR(200) NOT NULL,
      icon VARCHAR(10),
      category VARCHAR(20) DEFAULT 'general',
      condition_type VARCHAR(20) NOT NULL,
      condition_value INTEGER NOT NULL,
      exp_reward INTEGER DEFAULT 100,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 用户成就关系表
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      achievement_id INTEGER NOT NULL,
      unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE,
      UNIQUE(user_id, achievement_id)
    )
  `);

  // 验证码表（临时存储）
  db.exec(`
    CREATE TABLE IF NOT EXISTS verify_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone VARCHAR(11) NOT NULL,
      code VARCHAR(6) NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 初始化预设数据
  initPresetData();
}

// 初始化预设数据
function initPresetData() {
  // 检查模板是否已存在
  const templateCount = db.prepare('SELECT COUNT(*) as count FROM practice_templates').get();
  if (templateCount.count === 0) {
    const insertTemplate = db.prepare(`
      INSERT INTO practice_templates (name, type, category, quantity, unit, duration_seconds, voice_guide, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // 念佛模板 (nianfo)
    const templates = [
      ['念佛10遍', 'nianfo', 'general', 10, '遍', 30, '开始念佛，净念相继', 1],
      ['念佛108遍', 'nianfo', 'general', 108, '遍', 300, '南无阿弥陀佛', 2],
      ['念佛1000遍', 'nianfo', 'general', 1000, '遍', 2700, '精进念佛，万德洪名', 3],
      // 诵经模板 (nianjing)
      ['诵心经', 'nianjing', 'morning', 1, '部', 120, '开始诵经，般若波罗蜜', 1],
      ['诵阿弥陀经', 'nianjing', 'evening', 1, '部', 300, '开始诵经，极乐世界', 2],
      ['诵大悲咒', 'nianjing', 'general', 1, '部', 180, '大悲神咒，妙用难测', 3],
      ['诵地藏经', 'nianjing', 'general', 1, '品', 600, '地藏菩萨本愿经', 4],
      // 持咒模板 (nianzhou)
      ['持大悲咒3遍', 'nianzhou', 'morning', 3, '遍', 120, '持咒消障，慈悲救苦', 1],
      ['持大悲咒7遍', 'nianzhou', 'morning', 7, '遍', 280, '持咒消障，慈悲救苦', 2],
      ['持大悲咒21遍', 'nianzhou', 'general', 21, '遍', 840, '持咒消障，慈悲救苦', 3],
      ['持往生咒', 'nianzhou', 'evening', 7, '遍', 280, '持往生咒，净除业障', 4],
      ['六字大明咒', 'nianzhou', 'general', 108, '遍', 180, '唵嘛呢叭咪吽', 5],
      // 忏悔模板 (chanhui)
      ['忏悔三礼', 'chanhui', 'morning', 3, '遍', 60, '往昔所造诸恶业，皆由无始贪嗔痴', 1],
      ['忏悔七礼', 'chanhui', 'general', 7, '遍', 140, '从身语意之所生，今对佛前皆忏悔', 2],
      ['礼佛大忏悔文', 'chanhui', 'general', 1, '遍', 300, '大慈大悲愍众生，礼敬诸佛消业障', 3],
      // 拜忏模板 (baichan)
      ['礼佛3拜', 'baichan', 'general', 3, '拜', 60, '一拜消灾障', 1],
      ['礼佛7拜', 'baichan', 'general', 7, '拜', 140, '精进拜忏', 2],
      ['礼佛21拜', 'baichan', 'general', 21, '拜', 420, '诚心拜忏', 3],
      ['礼佛49拜', 'baichan', 'general', 49, '拜', 980, '大力拜忏', 4],
      ['礼佛108拜', 'baichan', 'general', 108, '拜', 2160, '圆满拜忏', 5],
    ];

    for (const t of templates) {
      insertTemplate.run(...t);
    }
  }

  // 检查成就是否已存在
  const achievementCount = db.prepare('SELECT COUNT(*) as count FROM achievements').get();
  if (achievementCount.count === 0) {
    const insertAchievement = db.prepare(`
      INSERT INTO achievements (code, name, description, icon, condition_type, condition_value, exp_reward, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const achievements = [
      ['first_nianfo', '初发心', '完成首次念佛', '🌱', 'nianfo_count', 1, 50, 1],
      ['first_nianjing', '经文通读', '完成首次诵经', '📖', 'nianjing_count', 1, 50, 2],
      ['nianfo_100', '佛号百遍', '累计念佛100遍', '🙏', 'nianfo_total', 100, 100, 3],
      ['nianfo_10000', '万遍功德', '累计念佛一万遍', '✨', 'nianfo_total', 10000, 500, 4],
      ['nianfo_100000', '十万功德', '累计念佛十万遍', '🌟', 'nianfo_total', 100000, 2000, 5],
      ['streak_7', '七日精进', '连续修行7天', '🔥', 'streak_days', 7, 200, 6],
      ['streak_30', '三十日恒', '连续修行30天', '⛰️', 'streak_days', 30, 1000, 7],
      ['streak_100', '百日修行', '连续修行100天', '🏔️', 'streak_days', 100, 3000, 8],
      ['practice_30', '修行满月', '累计修行30天', '🌙', 'total_days', 30, 300, 9],
      ['practice_100', '修行百日', '累计修行100天', '💯', 'total_days', 100, 1000, 10],
      ['baichan_first', '初次拜忏', '完成首次拜忏', '❤️', 'baichan_count', 1, 50, 11],
      ['level_5', '五级居士', '达到5级', '🎖️', 'level', 5, 500, 12],
      ['level_10', '十级行者', '达到10级', '🏅', 'level', 10, 2000, 13],
    ];

    for (const a of achievements) {
      insertAchievement.run(...a);
    }
  }
}

export default db;
