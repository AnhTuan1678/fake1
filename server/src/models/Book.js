const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Book = sequelize.define(
  'Book',
  {
    title: { type: DataTypes.STRING(255), allowNull: false },
    author: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT },
    status: { type: DataTypes.STRING(50), defaultValue: 'Đang ra' },
    chapter_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    word_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    like: { type: DataTypes.INTEGER, defaultValue: 0 },
    views: { type: DataTypes.INTEGER, defaultValue: 0 },
    followers: { type: DataTypes.INTEGER, defaultValue: 0 },
    // ⭐
    review_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    total_rating: { type: DataTypes.INTEGER, defaultValue: 0 },
    url_avatar: {
      type: DataTypes.STRING,
      defaultValue:
        'https://p6-novel.byteimg.com/novel-pic/p2o37825e1ebc684e7b9d28ef1ad077c9b9~tplv-shrink:640:0.image',
    },
    genres: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },

    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: 'books',
    timestamps: false,
  },
)

module.exports = Book
