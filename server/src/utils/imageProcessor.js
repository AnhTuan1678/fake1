const sharp = require('sharp')
const fs = require('fs')

async function resizeImage(filePath, width = 60, height = 60) {
  const outputPath = filePath.replace(/(\.[\w]+)$/, `_resized$1`)

  const buffer = await fs.promises.readFile(filePath)

  await sharp(buffer).resize(width, height, { fit: 'cover' }).toFile(outputPath)

  try {
    await fs.promises.unlink(filePath)
  } catch (err) {
    console.error('Không xoá được file gốc:', err)
  }

  return outputPath
}

module.exports = resizeImage
