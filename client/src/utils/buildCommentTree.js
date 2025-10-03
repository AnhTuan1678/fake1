export const buildCommentTree = (comments) => {
  const map = {}
  const roots = []

  comments.forEach((c) => {
    map[c.id] = { ...c, replies: [] }
  })

  comments.forEach((c) => {
    if (c.parent_id) {
      map[c.parent_id]?.replies.unshift(map[c.id])
    } else {
      roots.push(map[c.id])
    }
  })

  return roots
}
