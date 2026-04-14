import jwt from 'jsonwebtoken';

const JWT_SECRET = 'buddhist-practice-app-secret-key-2026';

// 验证Token中间件
export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      code: 9001,
      message: '未授权，请先登录',
      data: null
    });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        code: 9002,
        message: 'Token已过期，请重新登录',
        data: null
      });
    }
    return res.status(401).json({
      code: 9001,
      message: 'Token无效',
      data: null
    });
  }
}

// 生成Token
export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      unionId: user.union_id,
      phone: user.phone
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

export { JWT_SECRET };
