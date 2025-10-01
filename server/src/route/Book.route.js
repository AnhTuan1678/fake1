const router = require('express').Router()
const db = require('../models/index')
const { Op } = require('sequelize')
const authenticateToken = require('../middleware/authenticateToken')

// ============================
// LẤY TẤT CẢ SÁCH
// ============================
router.get('/', async (req, res) => {
  try {
    const books = await db.Book.findAll()
    res.status(200).json(books)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ============================
// Tìm sách
// ============================
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query
    if (!query || query.trim() === '') {
      return res.status(400).json({ message: 'Query không được để trống' })
    }

    const books = await db.Book.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${query}%` } },
          { author: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } },
        ],
      },
      limit: 5, // giới hạn số kết quả trả về
    })

    res.json(books)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

// ============================
// LẤY SÁCH THEO ID
// ============================
router.get('/:id', async (req, res) => {
  try {
    const book = await db.Book.findByPk(req.params.id)
    if (book) res.status(200).json(book)
    else res.status(404).json({ error: 'Book not found' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ============================
// LẤY TẤT CẢ CHƯƠNG CỦA 1 SÁCH
// ============================
router.get('/:id/chapters', async (req, res) => {
  try {
    const chapters = await db.Chapter.findAll({
      where: { book_id: req.params.id },
      order: [['id', 'ASC']],
    })
    res.status(200).json(chapters)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ============================
// LẤY 1 CHƯƠNG THEO Index
// ============================
router.get('/:id/chapter/:index', async (req, res) => {
  try {
    const bookId = req.params.id
    const index = parseInt(req.params.index, 10)
    if (isNaN(index) || index < 1) {
      return res.status(400).json({ error: 'Index không hợp lệ' })
    }

    const chapter = await db.Chapter.findOne({
      where: { book_id: bookId },
      order: [['id', 'ASC']], // sắp xếp theo thứ tự thêm chương
      offset: index - 1, // index - 1 nếu bạn muốn index bắt đầu từ 1
      limit: 1,
    })

    if (!chapter) return res.status(404).json({ error: 'Chapter not found' })

    res.status(200).json(chapter)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ========================
// Tạo review
// ========================
router.post('/review', authenticateToken, async (req, res) => {
  try {
    const { book_id, content, rating } = req.body
    const user_id = req.user.id

    // Kiểm tra sách có tồn tại
    const book = await db.Book.findByPk(book_id)
    if (!book) return res.status(404).json({ message: 'Không tìm thấy sách' })

    // Kiểm tra user đã review sách chưa
    const existingReview = await db.Review.findOne({
      where: { book_id, user_id },
    })
    if (existingReview) {
      return res.status(400).json({ message: 'Đã review' })
    }

    // Tạo review
    const review = await db.Review.create({ user_id, book_id, content, rating })
    res.status(201).json(review)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// ==============================
// Lấy review của một sách
// ==============================
router.get('/:bookId/reviews', async (req, res) => {
  try {
    const { bookId } = req.params
    const reviews = await db.Review.findAll({
      where: { book_id: bookId },
      include: [
        { model: db.User, attributes: ['id', 'username', 'avatar_url'] },
      ],
      order: [['created_at', 'DESC']],
    })
    res.json(reviews)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// ================================
// Sửa review
// ================================
router.put('/review/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { content, rating } = req.body
    const user_id = req.user.id

    const review = await db.Review.findByPk(id)
    if (!review) return res.status(404).json({ message: 'Review not found' })

    if (review.user_id !== user_id)
      return res.status(403).json({ message: 'Forbidden' })

    review.content = content || review.content
    review.rating = rating || review.rating
    review.updated_at = new Date()

    await review.save()
    res.json(review)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// ================================
// Xóa review
// DELETE /review/:id
// ================================
router.delete('/review/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const user_id = req.user.id

    const review = await db.Review.findByPk(id)
    if (!review) return res.status(404).json({ message: 'Review not found' })

    // Chỉ người tạo mới xóa được
    if (review.user_id !== user_id)
      return res.status(403).json({ message: 'Forbidden' })

    await review.destroy()
    res.json({ message: 'Review deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
