const progressService = require('../services/progress.service')

exports.getProgress = async (req, res) => {
  try {
    const progress = await progressService.getProgress(
      req.user.id,
      req.params.bookId,
    )
    res.json(progress)
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
}

exports.saveProgress = async (req, res) => {
  try {
    const { book_id, last_chapter_index, progress_percent } = req.body
    const userId = req.user.id

    const result = await progressService.saveProgress(
      userId,
      book_id,
      last_chapter_index,
      progress_percent,
    )

    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(err.status || 500).json({ error: err.message })
  }
}

exports.getAllMyProgress = async (req, res) => {
  try {
    const { limit = 30, offset = 0 } = req.query
    const result = await progressService.getAllProgressByUser(req.user.id, {
      limit: parseInt(limit),
      offset: parseInt(offset),
    })
    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(err.status || 500).json({ error: err.message })
  }
}

exports.getAllProgress = async (req, res) => {
  try {
    const { limit = 30, offset = 0, id } = req.query
    const result = await progressService.getAllProgressByUser(id, {
      limit: parseInt(limit),
      offset: parseInt(offset),
    })
    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(err.status || 500).json({ error: err.message })
  }
}
