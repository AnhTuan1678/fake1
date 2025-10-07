const router = require('express').Router()
const db = require('../models')
const authenticateToken = require('../middleware/authenticateToken')

// Lấy comment theo userId
router.get('/user/:userId', async (req, res) => {
  /* ... */
})

// Lấy comment bản thân
router.get('/me', authenticateToken, async (req, res) => {
  /* ... */
})

module.exports = router
