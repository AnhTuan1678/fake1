// services.js
const User = require('../src/models/User')
const Book = require('../src/models/Book')
const Chapter = require('../src/models/Chapter')
const UserBookshelf = require('../src/models/UserBookshelf')

// Thêm user
async function addUser(username, email, passwordHash) {
  return await User.create({ username, email, password_hash: passwordHash })
}

// Thêm sách
async function addBook(title, author, description, publishDate) {
  return await Book.create({
    title,
    author,
    description,
    publish_date: publishDate,
  })
}

// Thêm chương (tự tính index và word_count)
async function addChapter(bookId, title, content, authorNote = null) {
  return Chapter.create({
    book_id: bookId,
    index: null,
    title,
    content,
    author_note: authorNote,
  })
}

// Thêm sách vào tủ sách user
async function addBookToShelf(userId, bookId) {
  return await UserBookshelf.findOrCreate({
    where: { user_id: userId, book_id: bookId },
    defaults: { user_id: userId, book_id: bookId },
  }).then(([record]) => record)
}

module.exports = {
  addUser,
  addBook,
  addChapter,
  addBookToShelf,
}
