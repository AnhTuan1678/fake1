const bookshelfService = require('../services/bookshelf.service')

exports.getBookshelf = async (req, res) => {
  try {
    const userId = req.user.id
    const limit = parseInt(req.query.limit) || 30 // mặc định 30
    const offset = parseInt(req.query.offset) || 0 // mặc định 0

    const result = await bookshelfService.getBookshelf(userId, {
      limit,
      offset,
    })

    res.json({ data: result.rows, total: result.count })
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
}

exports.addBook = async (req, res) => {
  try {
    const book = await bookshelfService.addBook(req.user.id, req.body.book_id)
    res.status(201).json(book)
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
}

exports.removeBook = async (req, res) => {
  try {
    await bookshelfService.removeBook(req.user.id, req.params.bookId)
    res.json({ message: 'Đã xóa sách khỏi tủ' })
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
}

exports.toggleBookshelf = async (req, res) => {
  try {
    const { book_id } = req.body
    if (!book_id) return res.status(400).json({ error: 'Thiếu book_id' })

    const result = await bookshelfService.toggleBookInBookshelf(
      req.user.id,
      book_id,
    )
    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Lỗi server' })
  }
}
