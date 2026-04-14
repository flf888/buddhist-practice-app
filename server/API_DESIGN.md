# 佛教修行APP - API接口设计文档

**版本**：V1.0
**编写日期**：2026-04-14
**基础URL**：开发环境 `http://localhost:3001/api`

---

## 一、接口规范

### 1.1 通用规范

**请求格式**：
- Content-Type: application/json
- Authorization: Bearer {token}（需认证接口）

**响应格式**：
```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

**状态码**：
| code | 说明 |
|------|------|
| 0 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权/Token无效 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

### 1.2 认证方式

使用 JWT Token 进行身份认证。

登录后返回 token，后续请求在 Header 中携带：
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 二、接口列表

### 2.1 认证模块（/auth）

| 接口 | 方法 | 说明 | 认证 |
|------|------|------|------|
| POST /auth/send-code | POST | 发送验证码 | 否 |
| POST /auth/login | POST | 登录/注册 | 否 |
| POST /auth/wechat-login | POST | 微信登录 | 否 |
| POST /auth/logout | POST | 退出登录 | 是 |

### 2.2 用户模块（/user）

| 接口 | 方法 | 说明 | 认证 |
|------|------|------|------|
| GET /user/profile | GET | 获取用户信息 | 是 |
| PUT /user/profile | PUT | 更新用户信息 | 是 |

### 2.3 设置模块（/settings）

| 接口 | 方法 | 说明 | 认证 |
|------|------|------|------|
| GET /settings | GET | 获取用户设置 | 是 |
| PUT /settings | PUT | 更新用户设置 | 是 |
| GET /settings/defaults | GET | 获取默认设置 | 否 |

### 2.4 功课模板模块（/templates）

| 接口 | 方法 | 说明 | 认证 |
|------|------|------|------|
| GET /templates | GET | 获取模板列表 | 否 |
| GET /templates/:type | GET | 按类型获取模板 | 否 |
| GET /templates/:id | GET | 获取模板详情 | 否 |

### 2.5 修行记录模块（/records）

| 接口 | 方法 | 说明 | 认证 |
|------|------|------|------|
| POST /records | POST | 记录修行 | 是 |
| GET /records | GET | 获取修行记录列表 | 是 |
| GET /records/stats | GET | 获取修行统计 | 是 |
| GET /records/weekly | GET | 获取本周数据 | 是 |

### 2.6 成就模块（/achievements）

| 接口 | 方法 | 说明 | 认证 |
|------|------|------|------|
| GET /achievements | GET | 获取成就列表 | 是 |
| GET /achievements/unlocked | GET | 获取已解锁成就 | 是 |

---

## 三、接口详细设计

### 3.1 认证模块

#### 3.1.1 发送验证码

```
POST /api/auth/send-code
```

**请求参数**：
```json
{
  "phone": "13800138000"
}
```

**响应**：
```json
{
  "code": 0,
  "message": "验证码已发送",
  "data": {
    "expiresIn": 300
  }
}
```

**规则**：
- 同一手机号60秒内不可重复发送
- 验证码5分钟内有效
- 演示环境固定验证码：123456

---

#### 3.1.2 手机号登录

```
POST /api/auth/login
```

**请求参数**：
```json
{
  "phone": "13800138000",
  "code": "123456"
}
```

**响应**：
```json
{
  "code": 0,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "nickname": "善知识",
      "phone": "13800138000",
      "level": 1,
      "totalExp": 0,
      "avatarUrl": null
    }
  }
}
```

---

#### 3.1.3 微信登录

```
POST /api/auth/wechat-login
```

**请求参数**：
```json
{
  "code": "微信授权code"
}
```

**响应**：
```json
{
  "code": 0,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "unionId": "oXXXXXXXXXXXXXX",
      "nickname": "善知识",
      "avatarUrl": "https://example.com/avatar.jpg",
      "needBindPhone": true
    }
  }
}
```

**说明**：
- 如果用户未绑定手机号，返回 needBindPhone: true，前端跳转绑定页
- 如果用户已绑定，直接返回完整用户信息

---

#### 3.1.4 退出登录

```
POST /api/auth/logout
Authorization: Bearer {token}
```

**响应**：
```json
{
  "code": 0,
  "message": "已退出登录"
}
```

---

### 3.2 用户模块

#### 3.2.1 获取用户信息

```
GET /api/user/profile
Authorization: Bearer {token}
```

**响应**：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "unionId": "oXXXXXXXXXXXXXX",
    "nickname": "善知识",
    "avatarUrl": "https://example.com/avatar.jpg",
    "phone": "13800138000",
    "level": 3,
    "title": "精进居士",
    "totalExp": 15680,
    "expForNextLevel": 20000,
    "totalDays": 89,
    "streakDays": 15,
    "lastPracticeDate": "2026-04-14",
    "createdAt": "2026-03-01T08:00:00Z"
  }
}
```

**等级称号对应**：
| 等级 | 称号 |
|------|------|
| 1-2 | 初学居士 |
| 3-4 | 精进居士 |
| 5-6 | 念佛行者 |
| 7-8 | 清净行者 |
| 9-10 | 智慧行者 |
| 11-15 | 菩萨行者 |
| 16-20 | 圆满行者 |

---

#### 3.2.2 更新用户信息

```
PUT /api/user/profile
Authorization: Bearer {token}
```

**请求参数**：
```json
{
  "nickname": "新的昵称",
  "avatarUrl": "https://example.com/new-avatar.jpg"
}
```

**响应**：
```json
{
  "code": 0,
  "message": "更新成功",
  "data": {
    "id": 1,
    "nickname": "新的昵称",
    "avatarUrl": "https://example.com/new-avatar.jpg"
  }
}
```

---

### 3.3 设置模块

#### 3.3.1 获取用户设置

```
GET /api/settings
Authorization: Bearer {token}
```

**响应**：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "morning_nianfo": 10,
    "morning_chant": 7,
    "morning_sutra": 1,
    "morning_chanhui": 3,
    "evening_nianfo": 108,
    "evening_chant": 7,
    "evening_sutra": 1,
    "evening_chanhui": 3,
    "baichan_default": 21
  }
}
```

---

#### 3.3.2 更新用户设置

```
PUT /api/settings
Authorization: Bearer {token}
```

**请求参数**：
```json
{
  "morning_nianfo": 20,
  "morning_chant": 14
}
```

**响应**：
```json
{
  "code": 0,
  "message": "设置已保存",
  "data": {
    "morning_nianfo": 20,
    "morning_chant": 14,
    "morning_sutra": 1,
    "morning_chanhui": 3,
    "evening_nianfo": 108,
    "evening_chant": 7,
    "evening_sutra": 1,
    "evening_chanhui": 3,
    "baichan_default": 21
  }
}
```

---

#### 3.3.3 获取默认设置

```
GET /api/settings/defaults
```

**响应**：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "morning_nianfo": { "default": 10, "min": 1, "max": 108 },
    "morning_chant": { "default": 7, "min": 1, "max": 21 },
    "morning_sutra": { "default": 1, "min": 1, "max": 3 },
    "morning_chanhui": { "default": 3, "min": 1, "max": 7 },
    "evening_nianfo": { "default": 108, "min": 1, "max": 108 },
    "evening_chant": { "default": 7, "min": 1, "max": 21 },
    "evening_sutra": { "default": 1, "min": 1, "max": 3 },
    "evening_chanhui": { "default": 3, "min": 1, "max": 7 },
    "baichan_default": { "default": 21, "min": 3, "max": 108 }
  }
}
```

---

### 3.4 功课模板模块

#### 3.4.1 获取模板列表

```
GET /api/templates
```

**查询参数**：
- type: nianfo | nianzhou | nianjing | baichan（可选）
- category: morning | evening | general（可选）

**响应**：
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "念佛10遍",
      "type": "nianfo",
      "category": "general",
      "quantity": 10,
      "unit": "遍",
      "durationSeconds": 30,
      "voiceGuide": "开始念佛，净念相继"
    },
    {
      "id": 2,
      "name": "念佛108遍",
      "type": "nianfo",
      "category": "general",
      "quantity": 108,
      "unit": "遍",
      "durationSeconds": 300,
      "voiceGuide": "南无阿弥陀佛"
    }
  ]
}
```

---

#### 3.4.2 按类型获取模板

```
GET /api/templates/nianfo
```

**响应**：
```json
{
  "code": 0,
  "message": "success",
  "data": [
    { "id": 1, "name": "念佛10遍", "quantity": 10, "durationSeconds": 30 },
    { "id": 2, "name": "念佛108遍", "quantity": 108, "durationSeconds": 300 },
    { "id": 3, "name": "念佛1000遍", "quantity": 1000, "durationSeconds": 2700 }
  ]
}
```

---

#### 3.4.3 获取模板详情

```
GET /api/templates/1
```

**响应**：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "name": "念佛10遍",
    "type": "nianfo",
    "category": "general",
    "quantity": 10,
    "unit": "遍",
    "durationSeconds": 30,
    "voiceGuide": "开始念佛，净念相继"
  }
}
```

---

### 3.5 修行记录模块

#### 3.5.1 记录修行

```
POST /api/records
Authorization: Bearer {token}
```

**请求参数**：
```json
{
  "templateId": 1,
  "practiceType": "nianfo",
  "practiceName": "念佛10遍",
  "quantity": 10,
  "unit": "遍",
  "durationSeconds": 30,
  "practiceMode": "smart",
  "sessionType": "general"
}
```

**响应**：
```json
{
  "code": 0,
  "message": "修行记录已保存",
  "data": {
    "recordId": 123,
    "expGained": 10,
    "newLevel": 1,
    "levelUp": false,
    "unlockedAchievements": []
  }
}
```

**经验值计算**：
| 修行类型 | 经验值 |
|----------|--------|
| nianfo | quantity * 1 |
| nianzhou | quantity * 2 |
| nianjing | quantity * 50 |
| baichan | quantity * 5 |

---

#### 3.5.2 获取修行记录列表

```
GET /api/records
Authorization: Bearer {token}
```

**查询参数**：
- page: 页码（默认1）
- limit: 每页数量（默认20）
- type: 修行类型筛选（可选）
- startDate: 开始日期（可选）
- endDate: 结束日期（可选）

**响应**：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "records": [
      {
        "id": 123,
        "practiceType": "nianfo",
        "practiceName": "念佛108遍",
        "quantity": 108,
        "unit": "遍",
        "durationSeconds": 300,
        "expGained": 108,
        "practiceDate": "2026-04-14",
        "createdAt": "2026-04-14T08:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "totalPages": 8
    }
  }
}
```

---

#### 3.5.3 获取修行统计

```
GET /api/records/stats
Authorization: Bearer {token}
```

**响应**：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "totalNianfo": 45600,
    "totalNianjing": 23,
    "totalNianzhou": 2100,
    "totalBaichan": 5,
    "totalExp": 15680,
    "totalDays": 89,
    "streakDays": 15,
    "lastPracticeDate": "2026-04-14"
  }
}
```

---

#### 3.5.4 获取本周数据

```
GET /api/records/weekly
Authorization: Bearer {token}
```

**响应**：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "weekStart": "2026-04-08",
    "weekEnd": "2026-04-14",
    "dailyData": [
      { "date": "2026-04-08", "day": "周一", "totalExp": 1200 },
      { "date": "2026-04-09", "day": "周二", "totalExp": 1500 },
      { "date": "2026-04-10", "day": "周三", "totalExp": 800 },
      { "date": "2026-04-11", "day": "周四", "totalExp": 1800 },
      { "date": "2026-04-12", "day": "周五", "totalExp": 2000 },
      { "date": "2026-04-13", "day": "周六", "totalExp": 2200 },
      { "date": "2026-04-14", "day": "周日", "totalExp": 1600 }
    ],
    "weekTotal": 11100
  }
}
```

---

### 3.6 成就模块

#### 3.6.1 获取成就列表

```
GET /api/achievements
Authorization: Bearer {token}
```

**响应**：
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": 1,
      "code": "first_nianfo",
      "name": "初发心",
      "description": "完成首次念佛",
      "icon": "🌱",
      "category": "general",
      "expReward": 50,
      "unlocked": true,
      "unlockedAt": "2026-03-05T10:00:00Z",
      "progress": { "current": 10, "target": 10 }
    },
    {
      "id": 2,
      "code": "first_nianjing",
      "name": "经文通读",
      "description": "完成首次诵经",
      "icon": "📖",
      "category": "general",
      "expReward": 50,
      "unlocked": true,
      "unlockedAt": "2026-03-06T15:00:00Z",
      "progress": { "current": 3, "target": 1 }
    },
    {
      "id": 3,
      "code": "nianfo_10000",
      "name": "万遍功德",
      "description": "累计念佛一万遍",
      "icon": "✨",
      "category": "general",
      "expReward": 500,
      "unlocked": false,
      "progress": { "current": 4560, "target": 10000 }
    }
  ]
}
```

---

#### 3.6.2 获取已解锁成就

```
GET /api/achievements/unlocked
Authorization: Bearer {token}
```

**响应**：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "count": 5,
    "total": 13,
    "achievements": [
      {
        "id": 1,
        "code": "first_nianfo",
        "name": "初发心",
        "description": "完成首次念佛",
        "icon": "🌱",
        "unlockedAt": "2026-03-05T10:00:00Z"
      }
    ]
  }
}
```

---

## 四、错误码定义

| 错误码 | 说明 | 处理建议 |
|--------|------|----------|
| 1001 | 手机号格式错误 | 提示用户输入正确格式 |
| 1002 | 验证码已过期 | 提示重新获取 |
| 1003 | 验证码错误 | 提示重新输入 |
| 1004 | 验证码发送过于频繁 | 提示60秒后重试 |
| 1005 | 手机号已被绑定 | 提示该手机号已注册 |
| 2001 | 用户不存在 | 提示登录 |
| 3001 | 模板不存在 | 提示选择其他模板 |
| 4001 | 设置项不存在 | 提示正确配置项 |
| 9001 | Token无效 | 提示重新登录 |
| 9002 | Token已过期 | 提示重新登录 |

---

## 五、数据类型对照

**数据库 → API 字段命名**：

| 数据库字段 | API字段 | 类型 |
|------------|---------|------|
| created_at | createdAt | ISO8601 |
| updated_at | updatedAt | ISO8601 |
| practice_type | practiceType | camelCase |
| practice_date | practiceDate | ISO8601 |
| duration_seconds | durationSeconds | Number |
| exp_gained | expGained | Number |
| total_exp | totalExp | Number |
| streak_days | streakDays | Number |
| avatar_url | avatarUrl | String |
| is_active | isActive | Boolean |
| sort_order | sortOrder | Number |
| voice_guide | voiceGuide | String |

---

## 六、测试用例

### 6.1 发送验证码
```bash
curl -X POST http://localhost:3001/api/auth/send-code \
  -H "Content-Type: application/json" \
  -d '{"phone": "13800138000"}'
```

### 6.2 手机号登录
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone": "13800138000", "code": "123456"}'
```

### 6.3 记录修行
```bash
curl -X POST http://localhost:3001/api/records \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "templateId": 1,
    "practiceType": "nianfo",
    "practiceName": "念佛10遍",
    "quantity": 10,
    "unit": "遍",
    "durationSeconds": 30,
    "practiceMode": "smart",
    "sessionType": "general"
  }'
```

### 6.4 获取修行统计
```bash
curl http://localhost:3001/api/records/stats \
  -H "Authorization: Bearer {token}"
```
