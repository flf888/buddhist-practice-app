import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

import { initDatabase } from './db-json.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import settingsRoutes from './routes/settings.js';
import templatesRoutes from './routes/templates.js';
import recordsRoutes from './routes/records.js';
import achievementsRoutes from './routes/achievements.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 初始化数据库
initDatabase();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/templates', templatesRoutes);
app.use('/api/records', recordsRoutes);
app.use('/api/achievements', achievementsRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ code: 0, message: 'OK', data: { status: 'running' } });
});

// 静态文件服务（前端）
const frontendPath = join(__dirname, '../../frontend');
if (existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
  app.get('*', (req, res) => {
    res.sendFile(join(frontendPath, 'index.html'));
  });
}

// 错误处理
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ code: 500, message: err.message || '服务器错误' });
});

const server = createServer(app);
server.listen(PORT, '0.0.0.0', () => {
  console.log(`佛教修行App服务器运行在 http://0.0.0.0:${PORT}`);
  console.log(`前端访问: http://YOUR_DOMAIN:${PORT}`);
});
