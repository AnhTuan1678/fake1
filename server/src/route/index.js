const router = require('express').Router()
const fs = require('fs')
const path = require('path')

// Tự động import tất cả các routes trong thư mục hiện tại
;(() => {
  fs.readdirSync(__dirname).forEach((file) => {
    if (file !== 'index.js') {
      const route = require(path.join(__dirname, file))
      router.use(`/${file.replace('.route.js', '').toLowerCase()}`, route)
    }
  })
})()

module.exports = router
