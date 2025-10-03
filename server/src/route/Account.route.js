const router = require('express').Router()
const db = require('../models/index')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const upload = require('../utlis/multer')
const uploadToImgBB = require('../utlis/imgbb')
const fs = require('fs')
const authenticateToken = require('../middleware/authenticateToken')
const { Sequelize } = require('sequelize')

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'

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
      avatar_url:
        'https://scontent-sin2-2.xx.fbcdn.net/v/t1.30497-1/453178253_471506465671661_2781666950760530985_n.png?stp=dst-png_s200x200&_nc_cat=1&ccb=1-7&_nc_sid=136b72&_nc_eui2=AeGY5-ZpsNOey_c7-29U9g91Wt9TLzuBU1Ba31MvO4FTUOlq_2GlO-T68hCT4Ni_iLwpIsH52d3rp2wUR1p-rnV1&_nc_ohc=2CKwNU0IXg0Q7kNvwHBREsT&_nc_oc=AdnvjRKArtcxP6w3Dc9DyiCWgOY2rQtOxIwX2qE9HpiHp6-Ot6bILOsC4vhTGpRfQsAB-eFTQVRB2Kldj-RuZabP&_nc_zt=24&_nc_ht=scontent-sin2-2.xx&oh=00_AfZ_BT4Z8W-fThCJOAZQoTdZFDXNo72qpU1vo_V3WC0HuA&oe=68FE523A',
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
// Đổi mật khẩu
// ============================
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Vui lòng nhập đầy đủ thông tin' })
    }

    const user = await db.User.findByPk(req.user.id)
    if (!user) {
      return res.status(404).json({ error: 'Người dùng không tồn tại' })
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password_hash)
    if (!isMatch) {
      return res.status(401).json({ error: 'Mật khẩu cũ không đúng' })
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10)
    user.password_hash = newPasswordHash
    await user.save()

    res.status(200).json({ message: 'Đổi mật khẩu thành công' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Lỗi server' })
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
      include: [
        {
          model: db.Book,
          include: [
            {
              model: db.Chapter,
              attributes: ['id', 'title', 'index'],
              where: Sequelize.and(
                Sequelize.where(
                  Sequelize.col('Book.id'),
                  Sequelize.col('UserProgress.book_id'),
                ),
                Sequelize.where(
                  Sequelize.col('Book->Chapters.index'),
                  Sequelize.col('UserProgress.last_chapter_index'),
                ),
              ),
              required: false,
            },
          ],
        },
      ],
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

// ========================
// Lấy comment theo user
// ========================
router.get('/user/:userId/comment', async (req, res) => {
  try {
    const { userId } = req.params
    const comments = await db.Comment.findAll({
      where: { user_id: userId },
      include: [
        { model: Chapter, attributes: ['id', 'title'] },
        { model: User, attributes: ['id', 'username', 'avatar_url'] },
      ],
      order: [['created_at', 'DESC']],
    })
    res.json(comments)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Lỗi khi lấy comments của user' })
  }
})

// ========================
// Lấy comment bản thân
// ========================
router.get('/comment', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user.id
    const comments = await db.Comment.findAll({
      where: { user_id: userId },
      include: [
        { model: Chapter, attributes: ['id', 'title'] },
        { model: User, attributes: ['id', 'username', 'avatar_url'] },
      ],
      order: [['created_at', 'DESC']],
    })
    res.json(comments)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Lỗi khi lấy comments của user' })
  }
})

module.exports = router
