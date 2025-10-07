const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token)
    return res.status(401).json({
      status: 'warning',
      success: false,
      message: 'Chưa đăng nhập hoặc thiếu token xác thực.',
    })

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({
        status: 'warning',
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn.',
      })
    req.user = user
    next()
  })
}

module.exports = authenticateToken
