const db = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'

exports.register = async ({ username, email, password }) => {
  if (!username || !email || !password) {
    const err = new Error('Thiếu thông tin')
    err.status = 400
    throw err
  }

  const existingUser = await db.User.findOne({
    where: { [db.Sequelize.Op.or]: [{ username }, { email }] },
  })
  if (existingUser) {
    const err = new Error('Username hoặc email đã tồn tại')
    err.status = 409
    throw err
  }

  const password_hash = await bcrypt.hash(password, 10)
  const newUser = await db.User.create({
    username,
    email,
    password_hash,
  })

  const token = jwt.sign(
    { id: newUser.id, username: newUser.username },
    JWT_SECRET,
    { expiresIn: '7d' },
  )

  return {
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
    token,
  }
}

exports.login = async ({ usernameOrEmail, password }) => {
  const user = await db.User.findOne({
    where: {
      [db.Sequelize.Op.or]: [
        { username: usernameOrEmail },
        { email: usernameOrEmail },
      ],
    },
  })
  if (!user) {
    const err = new Error('Sai username/email hoặc mật khẩu')
    err.status = 401
    throw err
  }

  const isMatch = await bcrypt.compare(password, user.password_hash)
  if (!isMatch) {
    const err = new Error('Sai username/email hoặc mật khẩu')
    err.status = 401
    throw err
  }

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: '7d',
  })

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    avatarUrl: user.avatar_url,
    token,
  }
}

exports.changePassword = async (userId, { oldPassword, newPassword }) => {
  const user = await db.User.findByPk(userId)
  if (!user) {
    const err = new Error('Người dùng không tồn tại')
    err.status = 404
    throw err
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password_hash)
  if (!isMatch) {
    const err = new Error('Mật khẩu cũ không đúng')
    err.status = 401
    throw err
  }

  user.password_hash = await bcrypt.hash(newPassword, 10)
  await user.save()
}
