const db = require('../models')
const { Sequelize } = require('sequelize')

exports.getProgress = async (userId, bookId) => {
  return await db.UserProgress.findOne({
    where: { user_id: userId, book_id: bookId },
  })
}

exports.saveProgress = async (
  userId,
  bookId,
  lastChapterIndex,
  progressPercent,
) => {
  if (!bookId) {
    const err = new Error('Thiếu book_id')
    err.status = 400
    throw err
  }

  // upsert = insert nếu chưa có, update nếu đã tồn tại
  const [progress, created] = await db.UserProgress.upsert(
    {
      user_id: userId,
      book_id: bookId,
      last_chapter_index: lastChapterIndex,
      progress_percent: progressPercent,
      updated_at: new Date(),
    },
    { returning: true },
  )

  return {
    message: created ? 'Tạo mới tiến trình' : 'Cập nhật tiến trình',
    progress,
  }
}

exports.getAllProgressByUser = async (userId, { limit = 30, offset = 0 }) => {
  // Lấy tổng số tiến trình để phục vụ phân trang
  const total = await db.UserProgress.count({
    where: { user_id: userId },
  })

  // Lấy danh sách tiến trình kèm thông tin Book + Chapter
  const progressList = await db.UserProgress.findAll({
    where: { user_id: userId },
    order: [['updated_at', 'DESC']],
    limit,
    offset,
    include: [
      {
        model: db.Book,
        include: [
          {
            model: db.Chapter,
            attributes: ['id', 'title', 'index'],
            where: Sequelize.and(
              Sequelize.where(
                Sequelize.col('Book.id'),
                Sequelize.col('UserProgress.book_id'),
              ),
              Sequelize.where(
                Sequelize.col('Book->Chapters.index'),
                Sequelize.col('UserProgress.last_chapter_index'),
              ),
            ),
            required: false, // nếu chương bị xóa thì vẫn trả sách
          },
        ],
      },
    ],
  })

  return {
    total,
    data: progressList.map((p) => p.toJSON()),
  }
}
