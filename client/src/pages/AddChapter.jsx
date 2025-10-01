import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './AddChapter.css'

const AddChapter = () => {
  const [formData, setFormData] = useState({
    index: '',
    title: '',
    author_note: '',
    content: '',
    word_count: 0,
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    // Nếu là content thì tính số từ
    if (name === 'content') {
      const wordCount =
        value.trim() === '' ? 0 : value.trim().split(/\s+/).length
      setFormData({ ...formData, content: value, word_count: wordCount })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(formData)
    // Gửi dữ liệu lên server tại đây
  }

  return (
    <div className='container mt-5'>
      <div className='card shadow-sm p-4'>
        <h3 className='mb-4 text-center text-primary'>Thêm chương mới</h3>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label className='form-label fw-semibold'>Tiêu đề chương *</label>
            <input
              type='text'
              className='form-control'
              name='title'
              value={formData.title}
              onChange={handleChange}
              placeholder='Nhập tiêu đề chương'
              required
            />
          </div>

          <div className='mb-3'>
            <label className='form-label fw-semibold'>Ghi chú tác giả</label>
            <textarea
              className='form-control'
              name='author_note'
              rows='3'
              value={formData.author_note}
              onChange={handleChange}
              placeholder='Nhập ghi chú tác giả'></textarea>
          </div>

          <div className='mb-3'>
            <label className='form-label fw-semibold'>Nội dung chương *</label>
            <textarea
              className='form-control'
              name='content'
              rows='8'
              value={formData.content}
              onChange={handleChange}
              placeholder='Nhập nội dung chương'
              required></textarea>
            <small className='text-muted'>Số từ: {formData.word_count}</small>
          </div>

          <div className='d-flex justify-content-center mt-4'>
            <button type='submit' className='btn btn-primary me-3 px-4'>
              Thêm chương
            </button>
            <button type='button' className='btn btn-outline-secondary px-4'>
              Quay lại
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddChapter
