const fs = require('fs')
const path = require('path')
const sequelize = require('../config/database')
const db = {}
const Genre = require('./Genre')
const Book = require('./Book')

fs.readdirSync(__dirname).forEach((file) => {
  if (file !== 'index.js' && file.endsWith('.js')) {
    const model = require(path.join(__dirname, file))
    db[model.name] = model
  }
})
;(async () => {
  await sequelize.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm;`)
  await sequelize.sync({ alter: false })
  console.log('All tables are ready!')

  // async function syncBookGenres() {
  //   try {
  //     // đảm bảo bảng đã được tạo
  //     await sequelize.sync()

  //     // Lấy tất cả sách
  //     const books = await Book.findAll()

  //     for (const book of books) {
  //       if (!book.genres || book.genres.length === 0) continue // nếu không có genre thì bỏ qua

  //       for (const genreName of book.genres) {
  //         // Tìm hoặc tạo genre
  //         const [genre] = await Genre.findOrCreate({
  //           where: { name: genreName },
  //           defaults: { description: 'Tạo tự động' }, // nếu muốn có mô tả, có thể map từ JSON trước
  //         })

  //         // Thêm quan hệ nhiều-nhiều
  //         await book.addGenre(genre) // Sequelize tự động chèn vào bảng BookGenres
  //       }
  //       console.log(`Xong book: ${book.title}`)
  //     }

  //     console.log('Đã đồng bộ genres từ books vào BookGenres!')
  //   } catch (err) {
  //     console.error('Lỗi khi đồng bộ genres:', err)
  //   } finally {
  //     await sequelize.close()
  //   }
  // }

  // syncBookGenres()
  // console.log('Thêm dữ liệu thành công')
})()

db.sequelize = sequelize
db.Sequelize = require('sequelize')

module.exports = db
