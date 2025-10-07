const userService = require('../services/user.service')

exports.getMe = async (req, res) => {
  try {
    const user = await userService.getMe(req.user.id)
    res.json(user)
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
}

exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id)
    res.json(user)
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
}

exports.updateSettings = async (req, res) => {
  try {
    const user = await userService.updateSettings(req.user.id, req.body)
    res.json(user)
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
}

exports.updateProfile = async (req, res) => {
  try {
    const { username, email, password } = req.body
    const result = await userService.updateProfile(req.user.id, {
      username,
      email,
      password,
    })
    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Lỗi server' })
  }
}

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Chưa chọn file' })

    const user = await userService.changeAvatar(req.user.id, req.file.path)

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatar_url,
      createdDate: user.created_at,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Upload avatar thất bại' })
  }
}

exports.getCommentsByUser = async (req, res) => {
  try {
    const result = await userService.getCommentsByUser(req.params.userId)
    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Lỗi khi lấy comments của user' })
  }
}

exports.getMyComments = async (req, res) => {
  try {
    const result = await userService.getCommentsByUser(req.user.id)
    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Lỗi khi lấy comments của user' })
  }
}
