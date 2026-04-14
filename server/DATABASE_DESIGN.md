# 佛教修行APP - 数据库设计文档

**版本**：V1.0
**编写日期**：2026-04-14
**数据库**：SQLite 3

---

## 一、数据库表结构总览

| 表名 | 说明 |
|------|------|
| users | 用户表 |
| user_settings | 用户遍数配置表 |
| practice_templates | 功课模板表 |
| practice_records | 修行记录表 |
| achievements | 成就表 |
| user_achievements | 用户成就关系表 |

---

## 二、表结构详细设计

### 2.1 用户表（users）

存储用户基本信息，支持微信登录+手机号绑定。

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    union_id VARCHAR(64) UNIQUE NOT NULL COMMENT '微信UnionID',
    open_id VARCHAR(64) COMMENT '微信OpenID',
    nickname VARCHAR(50) DEFAULT '善知识' COMMENT '用户昵称',
    avatar_url VARCHAR(255) COMMENT '头像URL',
    phone VARCHAR(11) UNIQUE COMMENT '手机号',
    level INTEGER DEFAULT 1 COMMENT '修行等级',
    total_exp INTEGER DEFAULT 0 COMMENT '累计经验值',
    total_days INTEGER DEFAULT 0 COMMENT '累计修行天数',
    streak_days INTEGER DEFAULT 0 COMMENT '连续修行天数',
    last_practice_date DATE COMMENT '最后修行日期',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_union_id ON users(union_id);
CREATE INDEX idx_users_phone ON users(phone);
```

**字段说明**：

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键，自增 |
| union_id | VARCHAR(64) | 微信UnionID，唯一，用于用户身份识别 |
| open_id | VARCHAR(64) | 微信OpenID，相同主体下唯一 |
| nickname | VARCHAR(50) | 用户昵称，默认"善知识" |
| avatar_url | VARCHAR(255) | 头像URL |
| phone | VARCHAR(11) | 手机号，唯一，用于验证码登录 |
| level | INTEGER | 修行等级，1-20级 |
| total_exp | INTEGER | 累计经验值 |
| total_days | INTEGER | 累计修行天数 |
| streak_days | INTEGER | 连续修行天数 |
| last_practice_date | DATE | 最后修行日期，用于计算连续天数 |

---

### 2.2 用户遍数配置表（user_settings）

存储用户自定义的修行遍数配置，与用户账号绑定。

```sql
CREATE TABLE user_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    setting_key VARCHAR(50) NOT NULL COMMENT '配置键名',
    setting_value INTEGER NOT NULL COMMENT '配置值',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, setting_key)
);

CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);
```

**配置项说明**：

| setting_key | 默认值 | 最小值 | 最大值 | 说明 |
|-------------|--------|--------|--------|------|
| morning_nianfo | 10 | 1 | 108 | 早课念佛遍数 |
| morning_chant | 7 | 1 | 21 | 早课持咒遍数 |
| morning_sutra | 1 | 1 | 3 | 早课诵经部数 |
| morning_chanhui | 3 | 1 | 7 | 早课忏悔遍数 |
| evening_nianfo | 108 | 1 | 108 | 晚课念佛遍数 |
| evening_chant | 7 | 1 | 21 | 晚课持咒遍数 |
| evening_sutra | 1 | 1 | 3 | 晚课诵经部数 |
| evening_chanhui | 3 | 1 | 7 | 晚课忏悔遍数 |
| baichan_default | 21 | 3 | 108 | 拜忏默认次数 |

---

### 2.3 功课模板表（practice_templates）

存储系统预设的功课模板，支持智能功课计数功能。

```sql
CREATE TABLE practice_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL COMMENT '模板名称',
    type VARCHAR(20) NOT NULL COMMENT '修行类型：nianfo/nianzhou/nianjing/baichan',
    category VARCHAR(20) DEFAULT 'general' COMMENT '分类：general/morning/evening',
    quantity INTEGER NOT NULL COMMENT '数量',
    unit VARCHAR(10) NOT NULL COMMENT '单位：遍/部/拜/卷',
    duration_seconds INTEGER NOT NULL COMMENT '标准时长（秒）',
    voice_guide TEXT COMMENT '语音引导文本',
    sort_order INTEGER DEFAULT 0 COMMENT '排序',
    is_active BOOLEAN DEFAULT 1 COMMENT '是否启用',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_templates_type ON practice_templates(type);
CREATE INDEX idx_templates_category ON practice_templates(category);
```

**预设模板数据**：

| name | type | category | quantity | unit | duration_seconds | voice_guide |
|------|------|----------|----------|------|------------------|-------------|
| 念佛10遍 | nianfo | general | 10 | 遍 | 30 | 开始念佛，净念相继 |
| 念佛108遍 | nianfo | general | 108 | 遍 | 300 | 南无阿弥陀佛 |
| 念佛1000遍 | nianfo | general | 1000 | 遍 | 2700 | 精进念佛，万德洪名 |
| 诵心经 | nianjing | morning | 1 | 部 | 120 | 开始诵经，般若波罗蜜 |
| 诵阿弥陀经 | nianjing | evening | 1 | 部 | 300 | 开始诵经，极乐世界 |
| 持大悲咒3遍 | nianzhou | morning | 3 | 遍 | 120 | 持咒消障，慈悲救苦 |
| 持大悲咒7遍 | nianzhou | morning | 7 | 遍 | 280 | 持咒消障，慈悲救苦 |
| 持大悲咒21遍 | nianzhou | general | 21 | 遍 | 840 | 持咒消障，慈悲救苦 |
| 持往生咒 | nianzhou | evening | 7 | 遍 | 280 | 持往生咒，净除业障 |
| 六字大明咒 | nianzhou | general | 108 | 遍 | 180 | 唵嘛呢叭咪吽 |
| 礼佛3拜 | baichan | general | 3 | 拜 | 60 | 一拜消灾障 |
| 礼佛7拜 | baichan | general | 7 | 拜 | 140 | 精进拜忏 |
| 礼佛21拜 | baichan | general | 21 | 拜 | 420 | 诚心拜忏 |
| 礼佛49拜 | baichan | general | 49 | 拜 | 980 | 大力拜忏 |
| 礼佛108拜 | baichan | general | 108 | 拜 | 2160 | 圆满拜忏 |

---

### 2.4 修行记录表（practice_records）

存储用户的修行记录明细。

```sql
CREATE TABLE practice_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    template_id INTEGER COMMENT '关联模板ID',
    practice_type VARCHAR(20) NOT NULL COMMENT '修行类型',
    practice_name VARCHAR(50) NOT NULL COMMENT '修行名称',
    quantity INTEGER NOT NULL COMMENT '完成数量',
    unit VARCHAR(10) NOT NULL COMMENT '单位',
    duration_seconds INTEGER COMMENT '实际用时（秒）',
    practice_mode VARCHAR(20) DEFAULT 'smart' COMMENT '修行模式：smart/manual',
    session_type VARCHAR(20) COMMENT '时段类型：morning/evening/general',
    exp_gained INTEGER DEFAULT 0 COMMENT '获得经验',
    practice_date DATE NOT NULL COMMENT '修行日期',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (template_id) REFERENCES practice_templates(id) ON DELETE SET NULL
);

CREATE INDEX idx_records_user_id ON practice_records(user_id);
CREATE INDEX idx_records_date ON practice_records(practice_date);
CREATE INDEX idx_records_type ON practice_records(practice_type);
```

**经验值计算规则**：

| 修行类型 | 单位 | 经验值 |
|----------|------|--------|
| 念佛 | 遍 | 1 |
| 诵经 | 部 | 50 |
| 持咒 | 遍 | 2 |
| 拜忏 | 拜 | 5 |

---

### 2.5 成就表（achievements）

存储系统预设的成就徽章。

```sql
CREATE TABLE achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL COMMENT '成就代码',
    name VARCHAR(50) NOT NULL COMMENT '成就名称',
    description VARCHAR(200) NOT NULL COMMENT '成就描述',
    icon VARCHAR(10) COMMENT '图标emoji',
    category VARCHAR(20) DEFAULT 'general' COMMENT '分类',
    condition_type VARCHAR(20) NOT NULL COMMENT '条件类型',
    condition_value INTEGER NOT NULL COMMENT '条件值',
    exp_reward INTEGER DEFAULT 100 COMMENT '奖励经验',
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**预设成就数据**：

| code | name | description | icon | condition_type | condition_value | exp_reward |
|------|------|-------------|------|----------------|-----------------|------------|
| first_nianfo | 初发心 | 完成首次念佛 | 🌱 | nianfo_count | 1 | 50 |
| first_nianjing | 经文通读 | 完成首次诵经 | 📖 | nianjing_count | 1 | 50 |
| nianfo_100 | 佛号百遍 | 累计念佛100遍 | 🙏 | nianfo_total | 100 | 100 |
| nianfo_10000 | 万遍功德 | 累计念佛一万遍 | ✨ | nianfo_total | 10000 | 500 |
| nianfo_100000 | 十万功德 | 累计念佛十万遍 | 🌟 | nianfo_total | 100000 | 2000 |
| streak_7 | 七日精进 | 连续修行7天 | 🔥 | streak_days | 7 | 200 |
| streak_30 | 三十日恒 | 连续修行30天 | ⛰️ | streak_days | 30 | 1000 |
| streak_100 | 百日修行 | 连续修行100天 | 🏔️ | streak_days | 100 | 3000 |
| practice_30 | 修行满月 | 累计修行30天 | 🌙 | total_days | 30 | 300 |
| practice_100 | 修行百日 | 累计修行100天 | 💯 | total_days | 100 | 1000 |
| baichan_first | 初次拜忏 | 完成首次拜忏 | ❤️ | baichan_count | 1 | 50 |
| level_5 | 五级居士 | 达到5级 | 🎖️ | level | 5 | 500 |
| level_10 | 十级行者 | 达到10级 | 🏅 | level | 10 | 2000 |

---

### 2.6 用户成就关系表（user_achievements）

存储用户已解锁的成就。

```sql
CREATE TABLE user_achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    achievement_id INTEGER NOT NULL,
    unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE,
    UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_ach_user_id ON user_achievements(user_id);
```

---

## 三、ER关系图

```
┌─────────────┐       ┌──────────────────┐       ┌─────────────────────┐
│   users    │──────<│  user_settings   │       │  achievements       │
│            │  1:N  │                  │       │                     │
│ - id       │       │ - id             │       │ - id                │
│ - union_id │       │ - user_id (FK)   │       │ - code              │
│ - phone    │       │ - setting_key    │       │ - name              │
│ - level    │       │ - setting_value   │       │ - condition_type    │
│ - total_exp│       └──────────────────┘       │ - condition_value   │
└─────┬───────┘                                 └──────────┬──────────┘
      │                                                    │
      │ 1:N                                                │ N:N
      │                                         ┌──────────┴──────────┐
      │                                         │ user_achievements  │
      │                                         └──────────┬──────────┘
      │                                                    │
      │ 1:N                                                 │
┌─────┴───────┐        ┌───────────────────┐                │
│practice_    │        │ practice_templates│                │
│records       │        │                   │                │
│              │        │ - id              │                │
│ - id         │        │ - name            │                │
│ - user_id(FK)│>───────│ - type            │                │
│ - template_id│  N:1   │ - quantity        │                │
│ - practice_type        │ - duration_seconds               │
│ - quantity   │        │ - voice_guide     │                │
│ - exp_gained │        └───────────────────┘                │
│ - practice_date       (预设模板数据)                       │
└─────────────┘
```

---

## 四、索引设计

| 表名 | 索引名 | 索引字段 | 类型 | 说明 |
|------|--------|----------|------|------|
| users | idx_users_union_id | union_id | UNIQUE | 微信登录查询 |
| users | idx_users_phone | phone | UNIQUE | 手机号查询 |
| user_settings | idx_user_settings_user_id | user_id | NORMAL | 用户配置查询 |
| practice_templates | idx_templates_type | type | NORMAL | 按类型筛选模板 |
| practice_templates | idx_templates_category | category | NORMAL | 按分类筛选模板 |
| practice_records | idx_records_user_id | user_id | NORMAL | 用户记录查询 |
| practice_records | idx_records_date | practice_date | NORMAL | 按日期统计 |
| practice_records | idx_records_type | practice_type | NORMAL | 按类型统计 |
| user_achievements | idx_user_ach_user_id | user_id | NORMAL | 用户成就查询 |

---

## 五、数据初始化SQL

```sql
-- 插入预设功课模板
INSERT INTO practice_templates (name, type, category, quantity, unit, duration_seconds, voice_guide, sort_order) VALUES
('念佛10遍', 'nianfo', 'general', 10, '遍', 30, '开始念佛，净念相继', 1),
('念佛108遍', 'nianfo', 'general', 108, '遍', 300, '南无阿弥陀佛', 2),
('念佛1000遍', 'nianfo', 'general', 1000, '遍', 2700, '精进念佛，万德洪名', 3),
('诵心经', 'nianjing', 'morning', 1, '部', 120, '开始诵经，般若波罗蜜', 1),
('诵阿弥陀经', 'nianjing', 'evening', 1, '部', 300, '开始诵经，极乐世界', 1),
('持大悲咒3遍', 'nianzhou', 'morning', 3, '遍', 120, '持咒消障，慈悲救苦', 1),
('持大悲咒7遍', 'nianzhou', 'morning', 7, '遍', 280, '持咒消障，慈悲救苦', 2),
('持大悲咒21遍', 'nianzhou', 'general', 21, '遍', 840, '持咒消障，慈悲救苦', 3),
('持往生咒', 'nianzhou', 'evening', 7, '遍', 280, '持往生咒，净除业障', 1),
('六字大明咒', 'nianzhou', 'general', 108, '遍', 180, '唵嘛呢叭咪吽', 4),
('礼佛3拜', 'baichan', 'general', 3, '拜', 60, '一拜消灾障', 1),
('礼佛7拜', 'baichan', 'general', 7, '拜', 140, '精进拜忏', 2),
('礼佛21拜', 'baichan', 'general', 21, '拜', 420, '诚心拜忏', 3),
('礼佛49拜', 'baichan', 'general', 49, '拜', 980, '大力拜忏', 4),
('礼佛108拜', 'baichan', 'general', 108, '拜', 2160, '圆满拜忏', 5);

-- 插入预设成就
INSERT INTO achievements (code, name, description, icon, condition_type, condition_value, exp_reward, sort_order) VALUES
('first_nianfo', '初发心', '完成首次念佛', '🌱', 'nianfo_count', 1, 50, 1),
('first_nianjing', '经文通读', '完成首次诵经', '📖', 'nianjing_count', 1, 50, 2),
('nianfo_100', '佛号百遍', '累计念佛100遍', '🙏', 'nianfo_total', 100, 100, 3),
('nianfo_10000', '万遍功德', '累计念佛一万遍', '✨', 'nianfo_total', 10000, 500, 4),
('nianfo_100000', '十万功德', '累计念佛十万遍', '🌟', 'nianfo_total', 100000, 2000, 5),
('streak_7', '七日精进', '连续修行7天', '🔥', 'streak_days', 7, 200, 6),
('streak_30', '三十日恒', '连续修行30天', '⛰️', 'streak_days', 30, 1000, 7),
('streak_100', '百日修行', '连续修行100天', '🏔️', 'streak_days', 100, 3000, 8),
('practice_30', '修行满月', '累计修行30天', '🌙', 'total_days', 30, 300, 9),
('practice_100', '修行百日', '累计修行100天', '💯', 'total_days', 100, 1000, 10),
('baichan_first', '初次拜忏', '完成首次拜忏', '❤️', 'baichan_count', 1, 50, 11),
('level_5', '五级居士', '达到5级', '🎖️', 'level', 5, 500, 12),
('level_10', '十级行者', '达到10级', '🏅', 'level', 10, 2000, 13);
```

---

## 六、设计原则

1. **范式设计**：遵循第三范式，减少数据冗余
2. **外键约束**：使用外键保证数据完整性
3. **索引优化**：为高频查询字段创建索引
4. **软删除**：使用 is_active 字段支持软删除
5. **时间戳**：记录创建和更新时间
6. **经验值设计**：
   - 念佛：1遍 = 1经验
   - 诵经：1部 = 50经验
   - 持咒：1遍 = 2经验
   - 拜忏：1拜 = 5经验
7. **等级设计**：
   - 1级：0经验
   - 每升1级需要：level * 100经验
   - 例如：2级需要200经验，3级需要300经验...
