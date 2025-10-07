const authService = require('../services/auth.service')

exports.register = async (req, res) => {
  try {
    const result = await authService.register(req.body)
    res.status(201).json(result)
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
}

exports.login = async (req, res) => {
  try {
    const result = await authService.login(req.body)
    res.status(200).json(result)
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
}

exports.changePassword = async (req, res) => {
  try {
    await authService.changePassword(req.user.id, req.body)
    res.json({ message: 'Đổi mật khẩu thành công' })
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
}
