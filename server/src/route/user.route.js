const router = require('express').Router()
const userController = require('../controllers/user.controller')
const authenticateToken = require('../middleware/authenticateToken')
const upload = require('../utils/multer')

// user profile
router.get('/me', authenticateToken, userController.getMe)
router.put('/settings', authenticateToken, userController.updateSettings)
router.get('/:id', userController.getUserById)
router.post(
  '/avatar',
  authenticateToken,
  upload.single('avatar'),
  userController.uploadAvatar,
)
router.put('/profile', authenticateToken, userController.updateProfile)

// Comments
router.get('/:userId/comment', userController.getCommentsByUser)
router.get('/comment', authenticateToken, userController.getMyComments)

module.exports = router
