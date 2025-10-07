const router = require('express').Router()
const chapterController = require('../controllers/chapter.controller')
const authenticateToken = require('../middleware/authenticateToken')

// comment
router.get('/:chapterId/comment', chapterController.getComments)
router.post('/comment', authenticateToken, chapterController.createComment)
router.delete(
  '/comment/:id',
  authenticateToken,
  chapterController.deleteComment,
)

// chapter
router.get('/:id', chapterController.getChapter)

module.exports = router
