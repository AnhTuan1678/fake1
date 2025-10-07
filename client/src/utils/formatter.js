export const formatterStoryDetail = (book) => {
  if (!book) return null

  return {
    id: book.id,
    title: book.title,
    author: book.author,
    description: book.description,
    status: book.status,
    chapterCount: book.chapter_count,
    wordCount: book.word_count,
    like: book.like,
    views: book.views,
    followers: book.followers,
    urlAvatar: book.url_avatar,
    genres: (book.Genres || []).map((g) => g.name),
    publishedDate: book.created_at,
    updateAt: book.updated_at,
    reviewCount: book.review_count,
    totalRating: book.total_rating,
    chapters: book.Chapters || [],
  }
}

export const formatterProfile = (profile) => {
  if (!profile) return null

  return {
    id: profile.id,
    username: profile.username,
    email: profile.email,
    avatarUrl:
      profile.avatar_url ||
      'https://scontent-sin2-2.xx.fbcdn.net/v/t1.30497-1/453178253_471506465671661_2781666950760530985_n.png?stp=dst-png_s200x200&_nc_cat=1&ccb=1-7&_nc_sid=136b72&_nc_eui2=AeGY5-ZpsNOey_c7-29U9g91Wt9TLzuBU1Ba31MvO4FTUOlq_2GlO-T68hCT4Ni_iLwpIsH52d3rp2wUR1p-rnV1&_nc_ohc=2CKwNU0IXg0Q7kNvwHBREsT&_nc_oc=AdnvjRKArtcxP6w3Dc9DyiCWgOY2rQtOxIwX2qE9HpiHp6-Ot6bILOsC4vhTGpRfQsAB-eFTQVRB2Kldj-RuZabP&_nc_zt=24&_nc_ht=scontent-sin2-2.xx&oh=00_AfZ_BT4Z8W-fThCJOAZQoTdZFDXNo72qpU1vo_V3WC0HuA&oe=68FE523A',
    personalSettings: profile.personal_settings || {},
    createdDate: profile.created_at
      ? new Date(profile.created_at).toISOString().split('T')[0]
      : null,
    updatedDate: profile.updated_at
      ? new Date(profile.updated_at).toISOString().split('T')[0]
      : null,
  }
}
