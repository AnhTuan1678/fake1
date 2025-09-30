const fs = require('fs')

// upload ảnh
async function uploadToImgBB(imagePath, apiKey = process.env.IMGBB_KEY) {
  try {
    const imageBuffer = fs.readFileSync(imagePath)
    const base64Image = imageBuffer.toString('base64')

    const formData = new URLSearchParams()
    formData.append('key', apiKey)
    formData.append('image', base64Image)

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    })

    const result = await response.json()

    if (result.success) {
      return result.data.url
    } else {
      throw new Error(result.error.message)
    }
  } catch (err) {
    console.error('Upload failed:', err)
    throw err
  }
}

module.exports = uploadToImgBB
