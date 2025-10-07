const db = require('../models')
const { Op } = require('sequelize')

exports.getCommentsByChapter = async (chapterId) => {
  return db.Comment.findAll({
    where: { chapter_id: chapterId },
    include: [{ model: db.User, attributes: ['id', 'username', 'avatar_url'] }],
    order: [['created_at', 'DESC']],
  })
}

exports.createComment = async (userId, { chapter_id, parent_id, content }) => {
  const chapter = await db.Chapter.findByPk(chapter_id)
  if (!chapter) throw new Error('CHAPTER_NOT_FOUND')

  if (parent_id) {
    const parent = await db.Comment.findByPk(parent_id)
    if (!parent) throw new Error('PARENT_NOT_FOUND')
  }

  return db.Comment.create({
    user_id: userId,
    chapter_id,
    parent_id: parent_id || null,
    content,
  })
}

exports.deleteComment = async (userId, id) => {
  const comment = await db.Comment.findByPk(id)
  if (!comment) throw new Error('COMMENT_NOT_FOUND')
  if (comment.user_id !== userId) throw new Error('FORBIDDEN')

  return db.Comment.destroy({
    where: { [Op.or]: [{ id }, { parent_id: id }] },
  })
}

exports.getChapterById = async (id) => {
  return db.Chapter.findByPk(id)
}
