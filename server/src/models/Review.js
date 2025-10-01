const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const User = require('./User')
const Book = require('./Book')

const Review = sequelize.define(
  'Review',
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'books', key: 'id' },
    },
    content: { type: DataTypes.TEXT, allowNull: false },
    rating: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 5 },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: 'reviews',
    timestamps: false,
  },
)

Review.belongsTo(User, { foreignKey: 'user_id' })
User.hasMany(Review, { foreignKey: 'user_id' })

Review.belongsTo(Book, { foreignKey: 'book_id', onDelete: 'CASCADE' })
Book.hasMany(Review, { foreignKey: 'book_id', onDelete: 'CASCADE' })

// ========================
// Hooks cập nhật Book
// ========================

// Khi thêm review
Review.afterCreate(async (review, options) => {
  const book = await Book.findByPk(review.book_id)
  if (book) {
    book.review_count += 1
    book.total_rating += review.rating
    await book.save()
  }
})

// Khi xoá review
Review.afterDestroy(async (review, options) => {
  const book = await Book.findByPk(review.book_id)
  if (book) {
    book.review_count = Math.max(0, book.review_count - 1)
    book.total_rating = Math.max(0, book.total_rating - review.rating)
    await book.save()
  }
})

// Khi cập nhật review (nếu sửa rating)
Review.beforeUpdate(async (review, options) => {
  if (review.changed('rating')) {
    const book = await Book.findByPk(review.book_id)
    if (book) {
      const prevRating = review._previousDataValues.rating
      const newRating = review.rating
      book.total_rating = book.total_rating - prevRating + newRating
      await book.save()
    }
  }
})

module.exports = Review
