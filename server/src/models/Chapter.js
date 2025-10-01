const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const Book = require('./Book')

const Chapter = sequelize.define(
  'Chapter',
  {
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'books', key: 'id' },
    },
    index: {type:DataTypes.INTEGER},
    title: { type: DataTypes.STRING(255), allowNull: false },
    author_note: { type: DataTypes.TEXT },
    content: { type: DataTypes.TEXT, allowNull: false },
    word_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: 'chapters',
    timestamps: false,
  },
)

// Quan hệ
Chapter.belongsTo(Book, { foreignKey: 'book_id', onDelete: 'CASCADE', })
Book.hasMany(Chapter, {
  foreignKey: 'book_id',
  onDelete: 'CASCADE',
  hooks: true,
})

// Hook tự động cập nhật Book
Chapter.beforeCreate(async (chapter, options) => {
  try {
    const book = await Book.findByPk(chapter.book_id)
    if (!book) throw new Error('Book không tồn tại')

    if (!chapter.index) {
      chapter.index = book.chapter_count + 1
    }

    if (chapter.content) {
      chapter.word_count = chapter.content.trim().split(/\s+/).length
    } else {
      chapter.word_count = 0
    }

    book.chapter_count += 1
    book.word_count += chapter.word_count
    await book.save()
  } catch (error) {
    console.error('Lỗi trước khi tạo Chapter:', error)
    throw error // ngăn Chapter tạo ra nếu có lỗi
  }
})


module.exports = Chapter
