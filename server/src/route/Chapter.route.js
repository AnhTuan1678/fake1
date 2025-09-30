const router = require('express').Router()
const db = require('../models/index')

// ============================
// LẤY 1 CHƯƠNG THEO ID
// ============================
router.get('/:id', async (req, res) => {
  try {
    const chapter = await db.Chapter.findByPk(req.params.id);
    if (chapter) res.status(200).json(chapter);
    else res.status(404).json({ error: 'Chapter not found' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;