const router = require('express').Router()
const db = require('../models/index')
const { Op } = require('sequelize')

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

module.exports = router
