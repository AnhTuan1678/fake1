const multer = require('multer')
const fs = require('fs')
const path = require('path')

// Tạo thư mục temp nếu chưa có
const tempDir = path.join(__dirname, '../../temp')
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)

// Cấu hình multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, tempDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const filename = `avatar_${Date.now()}${ext}`
    cb(null, filename)
  },
})

const upload = multer({ storage })

module.exports = upload
