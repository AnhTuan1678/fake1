export const CommentItem = ({ comment }) => {
  return (
    <div className='d-flex mb-1 position-relative'>
      <img
        src={comment?.User?.avatar_url || '/default-avatar.png'}
        alt={comment?.User?.username || 'Người dùng'}
        className='rounded-circle me-3'
        width={40}
        height={40}
      />

      <div
        className='rounded p-2 w-100 position-relative'
        style={{ backgroundColor: 'var(--color-cus-1)' }}>
        {/* Rating góc trên bên phải */}
        {comment.rating != null && (
          <div
            style={{
              position: 'absolute',
              top: '5px',
              right: '10px',
              fontSize: '0.85rem',
              color: '#ffc107', // vàng sao
              fontWeight: 'bold',
            }}>
            {Array.from({ length: comment.rating }).map((_, i) => (
              <span key={i}>★</span>
            ))}
            {Array.from({ length: 5 - comment.rating }).map((_, i) => (
              <span key={i} style={{ color: '#ffffffff' }}>
                ★
              </span>
            ))}
          </div>
        )}

        <p className='mb-1 ms-1 fw-bold'>{comment?.User?.username}</p>
        <p className='mb-0 ms-1'>{comment.content}</p>
      </div>
    </div>
  )
}
