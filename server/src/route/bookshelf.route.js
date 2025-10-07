const router = require('express').Router()
const bookshelfController = require('../controllers/bookshelf.controller')
const authenticateToken = require('../middleware/authenticateToken')

router.post('/', authenticateToken, bookshelfController.toggleBookshelf)
router.get('/', authenticateToken, bookshelfController.getBookshelf)
// router.post('/', authenticateToken, bookshelfController.addBook)
router.delete('/:bookId', authenticateToken, bookshelfController.removeBook)

module.exports = router
