const db = require('../models')
const uploadIoImgBB = require('../utils/imgbb')
const bcrypt = require('bcrypt')
const fs = require('fs')
const uploadToImgBB = require('../utils/imgbb')
const resizeImage = require('../utils/imageProcessor')

exports.getMe = async (userId) => {
  const user = await db.User.findByPk(userId)
  if (!user) {
    const err = new Error('User không tồn tại')
    err.status = 404
    throw err
  }
  return user
}

exports.getUserById = async (id) => {
  const user = await db.User.findByPk(id, {
    attributes: ['id', 'username', 'avatar_url'],
  })
  if (!user) {
    return { error: 'User không tồn tại', status: 404 }
  }
  return user
}

exports.updateSettings = async (userId, { settings }) => {
  const user = await db.User.findByPk(userId)
  if (!user) {
    const err = new Error('User không tồn tại')
    err.status = 404
    throw err
  }

  user.personal_settings = settings
  await user.save()

  return user
}

exports.updateProfile = async (userId, { username, email, password }) => {
  const updateData = { updated_at: new Date() }

  if (username) updateData.username = username
  if (email) updateData.email = email
  if (password) updateData.password_hash = await bcrypt.hash(password, 10)

  await db.User.update(updateData, { where: { id: userId } })
  return { message: 'Cập nhật thông tin thành công' }
}

exports.changeAvatar = async (userId, imagePath) => {
  const user = await db.User.findByPk(userId)
  if (!user) throw new Error('User không tồn tại')

  const resizedPath = await resizeImage(imagePath, 256, 256)

  const avatarUrl = await uploadToImgBB(resizedPath, process.env.IMGBB_API_KEY)

  user.avatar_url = avatarUrl
  user.updated_at = new Date()
  await user.save()

  fs.unlinkSync(resizedPath)

  return user
}

exports.getCommentsByUser = async (userId) => {
  const comments = await db.Comment.findAll({
    where: { user_id: userId },
    include: [
      { model: db.Chapter, attributes: ['id', 'title'] },
      { model: db.User, attributes: ['id', 'username', 'avatar_url'] },
    ],
    order: [['created_at', 'DESC']],
  })

  return comments
}
