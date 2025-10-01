const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const User = require('./User')
const Chapter = require('./Chapter')

const Comment = sequelize.define(
  'Comment',
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    chapter_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'chapters', key: 'id' },
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'comments', key: 'id' }, // tự tham chiếu
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'comments',
    timestamps: false,
  },
)

// Quan hệ với User
Comment.belongsTo(User, { foreignKey: 'user_id' })
User.hasMany(Comment, { foreignKey: 'user_id' })

// Quan hệ với Chapter
Comment.belongsTo(Chapter, { foreignKey: 'chapter_id', onDelete: 'CASCADE' })
Chapter.hasMany(Comment, { foreignKey: 'chapter_id' })

// Quan hệ tự tham chiếu (comment lồng nhau)
Comment.belongsTo(Comment, { as: 'Parent', foreignKey: 'parent_id' })
Comment.hasMany(Comment, { as: 'Replies', foreignKey: 'parent_id' })

module.exports = Comment
