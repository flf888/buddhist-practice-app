import express from 'express';
import cors from 'cors';
import { initDatabase } from './src/db.js';
import authRoutes from './src/routes/auth.js';
import userRoutes from './src/routes/user.js';
import settingsRoutes from './src/routes/settings.js';
import templatesRoutes from './src/routes/templates.js';
import recordsRoutes from './src/routes/records.js';
import achievementsRoutes from './src/routes/achievements.js';

const app = express();
const PORT = 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 初始化数据库
initDatabase();
console.log('[数据库] 初始化完成');

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/templates', templatesRoutes);
app.use('/api/records', recordsRoutes);
app.use('/api/achievements', achievementsRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    code: 0,
    message: 'success',
    data: {
      status: 'ok',
      timestamp: new Date().toISOString()
    }
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`[服务器] 佛教修行APP后端服务已启动: http://localhost:${PORT}`);
  console.log('[服务器] API文档: http://localhost:3001/api/health');
});
