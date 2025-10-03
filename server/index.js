const express = require('express')
const cors = require('cors')
const db = require('./src/models/index')
const route = require('./src/route/index')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || 'localhost'
const ENV = process.env.NODE_ENV || 'development'

app.use(express.json())
app.use(cors())
app.use('/api', route)
app.use(express.urlencoded({ extended: true }))

const tempPath = path.join(__dirname, 'src/temp')
app.use('/temp', express.static(tempPath))

const publicPath = path.join(__dirname, 'public')
app.use('/public', express.static(publicPath))

// =====================
// PHỤC VỤ FRONTEND VITE BUILD
// =====================
const clientBuildPath = path.join(__dirname, './dist');
app.use(express.static(clientBuildPath));

// Bắt tất cả route còn lại trả về index.html để React Router xử lý
app.get(/^\/.*$/, (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'))
})


app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/ in ${ENV} mode`)
})
