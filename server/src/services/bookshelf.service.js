const db = require('../models')

exports.getBookshelf = async (userId, { limit = 30, offset = 0 } = {}) => {
  return await db.UserBookshelf.findAndCountAll({
    where: { user_id: userId },
    include: [{ model: db.Book }],
    order: [['saved_at', 'DESC']],
    limit,
    offset,
  })
}

exports.addBook = async (userId, bookId) => {
  const exists = await db.UserBookshelf.findOne({
    where: { user_id: userId, book_id: bookId },
  })
  if (exists) {
    const err = new Error('Sách đã có trong tủ')
    err.status = 400
    throw err
  }
  return await db.UserBookshelf.create({ user_id: userId, book_id: bookId })
}

exports.removeBook = async (userId, bookId) => {
  const result = await db.UserBookshelf.destroy({
    where: { user_id: userId, book_id: bookId },
  })
  if (!result) {
    const err = new Error('Sách không tồn tại trong tủ')
    err.status = 404
    throw err
  }
}

exports.toggleBookInBookshelf = async (userId, bookId) => {
  if (!bookId) throw new Error('Thiếu book_id')

  // Kiểm tra sách đã có trong tủ chưa
  const existingEntry = await db.UserBookshelf.findOne({
    where: { user_id: userId, book_id: bookId },
  })

  let action, message, status

  if (existingEntry) {
    // Xoá sách khỏi tủ
    await db.UserBookshelf.destroy({
      where: { user_id: userId, book_id: bookId },
    })
    await db.Book.decrement('followers', { by: 1, where: { id: bookId } })

    action = 'removed'
    message = 'Đã xoá khỏi tủ sách'
    status = 'warning'
  } else {
    // Thêm sách vào tủ
    await db.UserBookshelf.create({
      user_id: userId,
      book_id: bookId,
      saved_at: new Date(),
    })
    await db.Book.increment('followers', { by: 1, where: { id: bookId } })

    action = 'added'
    message = 'Đã thêm vào tủ sách'
    status = 'success'
  }

  const book = await db.Book.findByPk(bookId)
  return { action, message, status, book }
}
