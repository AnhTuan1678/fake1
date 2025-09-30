const router = require('express').Router()
const db = require('../models/index')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const upload = require('../utlis/multer')
const uploadToImgBB = require('../utlis/imgbb')
const fs = require('fs')
// const authenticateToken = require('../middleware/authenticateToken')

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'

// ============================
// Middleware xác thực JWT
// ============================
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer <token>

  if (!token) return res.status(401).json({ error: 'Token không tồn tại' })

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token không hợp lệ' })
    req.user = user
    next()
  })
}

// ============================
// Đăng ký
// ============================
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Vui lòng nhập đầy đủ thông tin' })
    }

    const existingUser = await db.User.findOne({
      where: {
        [db.Sequelize.Op.or]: [{ username }, { email }],
      },
    })
    if (existingUser) {
      return res.status(409).json({ error: 'Username hoặc email đã tồn tại' })
    }

    const password_hash = await bcrypt.hash(password, 10)

    // Tạo user mới
    const newUser = await db.User.create({
      username,
      email,
      password_hash,
    })

    // Tạo JWT
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      JWT_SECRET,
      { expiresIn: '7d' }, // token hết hạn sau 7 ngày
    )

    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      personal_settings: newUser.personal_settings,
      url_avar: newUser.url_aver,
      created_at: newUser.created_at,
      updated_at: newUser.updated_at,
      token,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ============================
// Đăng nhập
// ============================
router.post('/login', async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body

    if (!usernameOrEmail || !password) {
      return res.status(400).json({ error: 'Vui lòng nhập đầy đủ thông tin' })
    }

    // Tìm user theo username hoặc email
    const user = await db.User.findOne({
      where: {
        [db.Sequelize.Op.or]: [
          { username: usernameOrEmail },
          { email: usernameOrEmail },
        ],
      },
    })

    if (!user) {
      return res.status(401).json({ error: 'Sai username/email hoặc mật khẩu' })
    }

    // Kiểm tra password
    const isMatch = await bcrypt.compare(password, user.password_hash)
    if (!isMatch) {
      return res.status(401).json({ error: 'Sai username/email hoặc mật khẩu' })
    }

    // Tạo JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' },
    )

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      personalSettings: user.personal_settings,
      avatarUrl: user.avatar_url,
      personalSettings: user.personal_settings,
      token,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ============================
// Lấy thông tin user
// ============================
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.id, {
      attributes: [
        'id',
        'username',
        'email',
        'avatar_url',
        'personal_settings',
        'created_at',
        'updated_at',
      ],
    })

    if (!user)
      return res.status(404).json({ error: 'Người dùng không tồn tại' })

    res.status(200).json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ============================
// Lưu tiến trình đọc
// ============================
router.post('/progress', authenticateToken, async (req, res) => {
  try {
    const { book_id, last_chapter_index, progress_percent } = req.body
    if (!book_id) return res.status(400).json({ error: 'Thiếu book_id' })

    const [progress, created] = await db.UserProgress.upsert(
      {
        user_id: req.user.id,
        book_id,
        last_chapter_index,
        progress_percent,
        updated_at: new Date(),
      },
      { returning: true },
    )

    res.json({
      message: created ? 'Tạo mới tiến trình' : 'Cập nhật tiến trình',
      progress,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Lỗi server' })
  }
})

// ============================
// Lấy tiến trình đọc của user
// ============================

// Lấy toàn bộ tiến trình của user
router.get('/progress', authenticateToken, async (req, res) => {
  try {
    const progressList = await db.UserProgress.findAll({
      where: { user_id: req.user.id },
      order: [['updated_at', 'DESC']],
    })

    if (!progressList || progressList.length === 0) {
      return res
        .status(404)
        .json({ error: 'Người dùng chưa có tiến trình đọc nào' })
    }

    res.json(progressList.map((p) => p.toJSON()))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Lỗi server' })
  }
})

// Lấy tiến trình đọc theo book_id
router.get('/progress/:book_id', authenticateToken, async (req, res) => {
  try {
    const { book_id } = req.params
    const progress = await db.UserProgress.findOne({
      where: { user_id: req.user.id, book_id },
    })

    if (!progress)
      return res
        .status(200)
        .json({ message: 'Chưa có tiến trình đọc', progress: null })
    res.json(progress.toJSON())
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Lỗi server' })
  }
})

// ============================
// Lưu setting người dùng
// ============================
router.put('/settings', authenticateToken, async (req, res) => {
  try {
    const { settings } = req.body
    if (typeof settings !== 'object') {
      return res.status(400).json({ error: 'Dữ liệu settings không hợp lệ' })
    }

    await db.User.update(
      { personal_settings: settings, updated_at: new Date() },
      { where: { id: req.user.id } },
    )

    res.json({ message: 'Cập nhật setting thành công', settings })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Lỗi server' })
  }
})

// ============================
// Đổi thông tin tài khoản
// ============================
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { username, email, password } = req.body
    const updateData = { updated_at: new Date() }

    if (username) updateData.username = username
    if (email) updateData.email = email
    if (password) {
      updateData.password_hash = await bcrypt.hash(password, 10)
    }

    await db.User.update(updateData, { where: { id: req.user.id } })
    res.json({ message: 'Cập nhật thông tin thành công' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Lỗi server' })
  }
})

// ============================
// Đổi avatar
// ============================
router.post(
  '/avatar',
  authenticateToken,
  upload.single('avatar'),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ message: 'Chưa chọn file' })

      const user = await db.User.findByPk(req.user.id)
      if (!user) return res.status(404).json({ message: 'User không tồn tại' })

      // Upload lên ImgBB
      const apiKey = process.env.IMGBB_API_KEY
      const imagePath = req.file.path
      const avatarUrl = await uploadToImgBB(imagePath, apiKey)

      // Cập nhật user
      user.avatar_url = avatarUrl
      user.updated_at = new Date()
      await user.save()

      fs.unlinkSync(req.file.path)

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
  },
)

// ============================
// Thêm / Xoá sách
// ============================
router.post('/bookshelf', authenticateToken, async (req, res) => {
  try {
    const { book_id } = req.body
    if (!book_id) return res.status(400).json({ error: 'Thiếu book_id' })

    // Kiểm tra xem sách đã có trong tủ chưa
    const existingEntry = await db.UserBookshelf.findOne({
      where: { user_id: req.user.id, book_id },
    })

    if (existingEntry) {
      // Nếu đã có => xoá
      await db.UserBookshelf.destroy({
        where: { user_id: req.user.id, book_id },
      })
      await db.Book.decrement('followers', { by: 1, where: { id: book_id } })

      const book = await db.Book.findByPk(book_id)
      return res.json({
        message: 'Đã xoá khỏi tủ sách',
        status: 'warning',
        action: 'removed',
        book,
      })
    }

    // Nếu chưa có => thêm
    await db.UserBookshelf.create({
      user_id: req.user.id,
      book_id,
      saved_at: new Date(),
    })
    await db.Book.increment('followers', { by: 1, where: { id: book_id } })

    const book = await db.Book.findByPk(book_id)
    return res.json({
      message: 'Đã thêm vào tủ sách',
      status: 'success',
      action: 'added',
      book,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Lỗi server' })
  }
})

// ============================
// Lấy tủ sách của user
// ============================
router.get('/bookshelf', authenticateToken, async (req, res) => {
  try {
    const books = await db.UserBookshelf.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: db.Book,
          attributes: [
            'id',
            'title',
            'author',
            'status',
            'chapter_count',
            'word_count',
            'like',
            'views',
            'followers',
            'url_avatar',
          ],
        },
      ],
      order: [['saved_at', 'DESC']],
    })

    res.json({ books })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Lỗi server' })
  }
})

module.exports = router
