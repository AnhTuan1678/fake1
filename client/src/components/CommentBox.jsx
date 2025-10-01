import { useRef, useEffect, useState } from 'react'

export const CommentBox = ({
  defaultContent = ' ',
  onCancel,
  onSend,
  focus = true,
}) => {
  const textareaRef = useRef(null)
  const [mess, setMess] = useState(defaultContent)

  useEffect(() => {
    if (textareaRef.current && focus) {
      textareaRef.current.focus()
      // Đặt con trỏ ở cuối nội dung
      const length = textareaRef.current.value.length
      textareaRef.current.setSelectionRange(length, length)
    }
  }, [focus])

  return (
    <div className='mt-2'>
      <textarea
        ref={textareaRef}
        className='form-control mb-2'
        rows={2}
        value={mess}
        onChange={(e) => setMess(e.target.value)}
        placeholder='Nhập phản hồi...'
      />
      {onSend && (
        <button
          className='btn btn-primary btn-sm me-2'
          onClick={() => {
            onSend(mess)
            setMess('')
          }}>
          Gửi
        </button>
      )}
      {onCancel && (
        <button className='btn btn-secondary btn-sm' onClick={onCancel}>
          Hủy
        </button>
      )}
    </div>
  )
}
