// ;;(() => {
//     const fs = require('fs')
//     const path = require('path')
//     const { addBook, addChapter } = require('./insertData')
//     const db = require('../src/models/index')

//   const url = 'D:/Truyện/Huyền huyễn Mang theo nha hoàn du lịch giang hồ'

//   fs.readdir(url, async (err, files) => {
//     if (err) {
//       console.error('Không đọc được folder:', err)
//       return
//     }

//     try {
//       // Thêm sách
//       const book = await addBook(
//         'Huyền huyễn Mang theo nha hoàn du lịch giang hồ',
//         'Đa gia lạt tiêu',
//         `Từ rõ ràng nhiên xuyên qua đến dị giới cổ đại, thu được bói toán hệ thống.
// Nhưng mà nóng lòng hưởng thụ thế giới từ rõ ràng nhiên, trừ ra tình huống đặc biệt bên ngoài, mỗi ngày lại chỉ bốc một quẻ.
// Thời gian còn lại nhưng là mang theo nha hoàn đi khắp đại giang nam bắc, du lịch giang hồ, cảm thụ các nơi phong thổ.
// Khoa cử nhiều lần không trúng thư sinh, bị tà sát nhập thể thương nhân nhà thiếu gia, gánh vác sao tai họa bêu danh mười mấy năm nha hoàn thanh tước, vĩnh viễn mua không nổi thuộc về mình xe ngựa xa mã hành gã sai vặt mã tường tử......
// Mỗi cái chỗ, mỗi cái tiểu nhân vật, đều có hắn việc khó, đều có hắn quan tâm nào đó nào đó nào đó.
// Quần hùng cát cứ, đại chiến buông xuống, từ rõ ràng nhiên nghĩ trí thân sự ngoại, lại phát hiện mình đã sớm bị cuốn vào trong vòng xoáy........`,
//         new Date().toISOString().slice(0, 10),
//       )
//       console.log('Book:', book.toJSON())

//       // Sắp xếp files theo số chương
//       const sortedFiles = files
//         .map((file) => {
//           const match = file.match(/Thứ (\d+) chương/)
//           const index = match ? parseInt(match[1], 10) : 0
//           return { file, index }
//         })
//         .sort((a, b) => a.index - b.index)

//       for (const { file, index } of sortedFiles) {
//         const filePath = path.join(url, file)
//         const content = fs.readFileSync(filePath, 'utf8')

//         // Cắt "Thứ X chương" ra khỏi title
//         const title = file
//           .replace(/Thứ \d+ chương\s*/i, '')
//           .replace(/\.[^/.]+$/, '')

//         // Thêm chương
//         await addChapter(book.id, index, title, content, 'Tuan')
//         console.log(`Chương ${index}: ${title}`)
//       }
//     } catch (err) {
//       console.error('Lỗi khi thêm truyện/chương:', err)
//     }
//   })
// })()

;(() => {
  const fs = require('fs')
  const path = require('path')
  const { addBook, addChapter } = require('./insertData')
  const db = require('../src/models/index')

  const url = 'D:/Truyện/Arifureta Shokugyou de Sekai Saikyou'

  fs.readdir(url, async (err, files) => {
    if (err) {
      console.error('Không đọc được folder:', err)
      return
    }

    try {
      // Thêm sách
      const book = await addBook(
        'Arifureta Shokugyou de Sekai Saikyou',
        'Shirakome Ryou (Chuuni Suki)',
        `Một nhân vật được xem là vô dụng như Nagumo Hajime sẽ không thể ngờ rằng có một ngày cùng cả lớp được triệu hồi sang một thế giới khác, mang trong mình "Thiên chức" nhất định nhằm giải cứu Loài người thoát khỏi họa diệt vong. Điều gì đang chờ đợi cậu ở thế giới mới ấy? Liệu Hajime có thể lột xác trở thành con người mới được không?`,
        new Date().toISOString().slice(0, 10),
      )
      console.log('Book:', book.toJSON())

      // Sắp xếp files theo thời gian tạo
      const sortedFiles = files
        .map((file) => {
          const filePath = path.join(url, file)
          const stat = fs.statSync(filePath)
          return {
            file,
            time: stat.birthtimeMs || stat.mtimeMs, // birthtime ưu tiên, fallback mtime
          }
        })
        .sort((a, b) => a.time - b.time)

      let index = 1
      for (const { file } of sortedFiles) {
        const filePath = path.join(url, file)
        const content = fs.readFileSync(filePath, 'utf8')

        // Lấy title bỏ "Chương xx", "Thứ xx chương"
        const title = file
          // Xoá số đầu tiên kèm dấu chấm và khoảng trắng (ví dụ: "01. ", "475. ")
          .replace(/^\d+\.\s*/, '')
          // Xoá "Chương xx", "Thứ xx chương" nếu còn sót
          .replace(/^(Chương\s+\d+\s*|Thứ\s+\d+\s+chương\s*)/i, '')
          // Xoá phần mở rộng file
          .replace(/\.[^/.]+$/, '')
          .trim()
        // bỏ đuôi .txt, .docx, ...

        // Thêm chương
        await addChapter(book.id, title.trim(), content, 'Tuan')
        console.log(`Chương ${index}: ${title}`)
        index++
      }
    } catch (err) {
      console.error('Lỗi khi thêm truyện/chương:', err)
    }
  })
})()
