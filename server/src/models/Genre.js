const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const Book = require('./Book')

const Genre = sequelize.define(
  'Genre',
  {
    name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    description: { type: DataTypes.TEXT },
  },
  { tableName: 'genre', timestamps: false },
)

Book.belongsToMany(Genre, { through: 'book_genres', foreignKey: 'bookId' })
Genre.belongsToMany(Book, { through: 'book_genres', foreignKey: 'genreId' })

module.exports = Genre
