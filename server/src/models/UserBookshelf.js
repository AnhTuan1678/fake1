const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const User = require('./User')
const Book = require('./Book')

const UserBookshelf = sequelize.define(
  'UserBookshelf',
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
    saved_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: 'user_bookshelf',
    timestamps: false,
    indexes: [{ unique: true, fields: ['user_id', 'book_id'] }],
  },
)

// Quan hệ
UserBookshelf.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' })
UserBookshelf.belongsTo(Book, { foreignKey: 'book_id', onDelete: 'CASCADE' })
User.hasMany(UserBookshelf, { foreignKey: 'user_id' })
Book.hasMany(UserBookshelf, { foreignKey: 'book_id' })

module.exports = UserBookshelf
