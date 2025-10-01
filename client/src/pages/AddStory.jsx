import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './AddStory.css' // import file css tùy chỉnh

const AddStory = () => {
  const [formData, setFormData] = useState({
    title: '',
    altName: '',
    sensitive: false,
    author: '',
    illustrator: '',
    storyType: 'Truyện sáng tác',
    genres: [],
    summary: '',
    notes: '',
    status: 'Đang tiến hành',
  })

  const genresList = ['Action', 'Comedy', 'Web Novel']

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleGenresChange = (e) => {
    const options = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    )
    setFormData({ ...formData, genres: options })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(formData)
  }

  return (
    <div className='container mt-5'>
      <div className='card shadow-sm p-4'>
        <h3 className='mb-4 text-center text-primary'>Thêm truyện mới</h3>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label className='form-label fw-semibold'>Tiêu đề *</label>
            <input
              type='text'
              className='form-control'
              name='title'
              value={formData.title}
              onChange={handleChange}
              placeholder='Nhập tiêu đề truyện'
              required
            />
          </div>

          <div className='mb-3 form-check'>
            <input
              type='checkbox'
              className='form-check-input'
              name='sensitive'
              checked={formData.sensitive}
              onChange={handleChange}
              id='sensitiveCheck'
            />
            <label className='form-check-label' htmlFor='sensitiveCheck'>
              Nội dung nhạy cảm?
            </label>
          </div>

          <div className='mb-3'>
            <label className='form-label fw-semibold'>Tác giả *</label>
            <input
              type='text'
              className='form-control'
              name='author'
              value={formData.author}
              onChange={handleChange}
              placeholder='Nhập tên tác giả'
              required
            />
          </div>

          <div className='mb-3'>
            <label className='form-label fw-semibold'>Loại truyện *</label>
            <select
              className='form-select'
              name='storyType'
              value={formData.storyType}
              onChange={handleChange}>
              <option>Truyện đăng</option>
              <option>Truyện sáng tác</option>
              <option>Truyện dịch</option>
            </select>
          </div>

          <div className='mb-3'>
            <label className='form-label fw-semibold'>Thể loại *</label>
            <select
              className='form-select'
              multiple
              value={formData.genres}
              onChange={handleGenresChange}>
              {genresList.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
            <small className='text-muted'>
              Nhấn Ctrl để chọn nhiều thể loại
            </small>
          </div>

          <div className='mb-3'>
            <label className='form-label fw-semibold'>Tóm tắt *</label>
            <textarea
              className='form-control'
              name='summary'
              rows='4'
              value={formData.summary}
              onChange={handleChange}
              placeholder='Nhập tóm tắt truyện'
              required></textarea>
          </div>

          <div className='mb-3'>
            <label className='form-label fw-semibold'>Tình trạng dịch *</label>
            <select
              className='form-select'
              name='status'
              value={formData.status}
              onChange={handleChange}>
              <option>Đang tiến hành</option>
              <option>Hoàn thành</option>
              <option>Tạm ngưng</option>
            </select>
          </div>

          <div className='d-flex justify-content-center mt-4'>
            <button type='submit' className='btn btn-primary me-3 px-4'>
              Thêm truyện
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

export default AddStory
