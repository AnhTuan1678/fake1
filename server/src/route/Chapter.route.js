const router = require('express').Router()
const db = require('../models/index')
const authenticateToken = require('../middleware/authenticateToken')
const { Op } = require('sequelize')

// ========================
// Lấy comment theo chapter
// ========================
router.get('/:chapterId/comment', async (req, res) => {
  try {
    const { chapterId } = req.params

    const comments = await db.Comment.findAll({
      where: { chapter_id: chapterId },
      include: [
        { model: db.User, attributes: ['id', 'username', 'avatar_url'] },
      ],
      order: [['created_at', 'DESC']],
    })

    res.json(comments)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Lỗi khi lấy comments' })
  }
})

// ========================
// Tạo comment mới
// ========================
router.post('/comment', authenticateToken, async (req, res) => {
  try {
    const { chapter_id, parent_id, content } = req.body
    if (!content)
      return res.status(400).json({ message: 'Nội dung không được rỗng' })

    const chapter = await db.Chapter.findByPk(chapter_id)
    if (!chapter)
      return res.status(404).json({ message: 'Chapter không tồn tại' })

    if (parent_id) {
      const parentComment = await db.Comment.findByPk(parent_id)
      if (!parentComment)
        return res.status(404).json({ message: 'Comment cha không tồn tại' })
    }

    const newComment = await db.Comment.create({
      user_id: req.user.id,
      chapter_id,
      parent_id: parent_id || null,
      content,
    })

    res.status(201).json(newComment)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Lỗi khi tạo comment' })
  }
})

// ========================
// Xoá comment (và replies)
// ========================
router.delete('/comment/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    console.log(id)

    const comment = await db.Comment.findByPk(id)
    if (!comment)
      return res.status(404).json({ message: 'Comment không tồn tại' })

    if (comment.user_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: 'Bạn không có quyền xoá comment này' })
    }

    await db.Comment.destroy({
      where: { [Op.or]: [{ id }, { parent_id: id }] },
    })

    res.json({ message: 'Xoá thành công' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Lỗi khi xoá comment' })
  }
})

// ============================
// LẤY 1 CHƯƠNG THEO ID
// ============================
router.get('/:id', async (req, res) => {
  try {
    const chapter = await db.Chapter.findByPk(req.params.id)
    if (chapter) res.status(200).json(chapter)
    else res.status(404).json({ error: 'Chapter not found' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
