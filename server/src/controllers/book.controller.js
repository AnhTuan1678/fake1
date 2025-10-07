const bookService = require('../services/book.service')

exports.getAllBooks = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 30
    const offset = parseInt(req.query.offset) || 0

    const result = await bookService.getAllBooks({ limit, offset })

    res.json(result)
  } catch (err) {
    console.error('Lỗi khi lấy danh sách truyện:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

exports.searchBooks = async (req, res) => {
  try {
    const { query, genres, minChapter, maxChapter, limit } = req.query

    // Chuyển genres từ string sang array số nếu có
    let genresArray = []
    if (genres) {
      genresArray = genres
        .split(',')
        .map((id) => parseInt(id))
        .filter((id) => !isNaN(id))
    }

    // Chuyển min/maxChapter sang số, mặc định min=0, max=1e6
    const minCh = minChapter ? parseInt(minChapter) : 0
    const maxCh = maxChapter ? parseInt(maxChapter) : 1e6
    const lim = limit ? parseInt(limit) : 8

    const books = await bookService.searchBooks(
      query,
      lim,
      genresArray,
      minCh,
      maxCh,
    )
    res.json(books)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

exports.getBook = async (req, res) => {
  try {
    const book = await bookService.getBookById(req.params.id)
    if (!book) return res.status(404).json({ error: 'Book not found' })
    res.json(book)
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

exports.getChapters = async (req, res) => {
  try {
    const chapters = await bookService.getChaptersByBookId(req.params.id)
    res.json(chapters)
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

exports.getChapterByIndex = async (req, res) => {
  try {
    const index = parseInt(req.params.index, 10)
    if (isNaN(index) || index < 1) {
      return res.status(400).json({ error: 'Index không hợp lệ' })
    }
    const chapter = await bookService.getChapterByIndex(req.params.id, index)
    if (!chapter) return res.status(404).json({ error: 'Chapter not found' })
    res.json(chapter)
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

exports.createReview = async (req, res) => {
  try {
    const review = await bookService.createReview(req.user.id, req.body)
    res.status(201).json(review)
  } catch (err) {
    if (err.message === 'BOOK_NOT_FOUND')
      return res.status(404).json({ message: 'Không tìm thấy sách' })
    if (err.message === 'ALREADY_REVIEWED')
      return res.status(400).json({ message: 'Đã review' })
    res.status(500).json({ message: 'Server error' })
  }
}

exports.getReviews = async (req, res) => {
  try {
    const reviews = await bookService.getReviews(req.params.bookId)
    res.json(reviews)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

exports.updateReview = async (req, res) => {
  try {
    const updated = await bookService.updateReview(
      req.user.id,
      req.params.id,
      req.body,
    )
    res.json(updated)
  } catch (err) {
    if (err.message === 'REVIEW_NOT_FOUND')
      return res.status(404).json({ message: 'Review not found' })
    if (err.message === 'FORBIDDEN')
      return res.status(403).json({ message: 'Forbidden' })
    res.status(500).json({ message: 'Server error' })
  }
}

exports.deleteReview = async (req, res) => {
  try {
    await bookService.deleteReview(req.user.id, req.params.id)
    res.json({ message: 'Review deleted successfully' })
  } catch (err) {
    if (err.message === 'REVIEW_NOT_FOUND')
      return res.status(404).json({ message: 'Review not found' })
    if (err.message === 'FORBIDDEN')
      return res.status(403).json({ message: 'Forbidden' })
    res.status(500).json({ message: 'Server error' })
  }
}
