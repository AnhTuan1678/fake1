import { useEffect, useState, useRef } from 'react'
import { getProfile, updateAvatar } from '../services/api'
import { formatterProfile } from '../utils/formatter'
import styles from './Profile.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder } from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from 'react-redux'
import { updateAvatar as updateAvatarAction } from '../redux/userSlice'

const Profile = () => {
  const [profile, setProfile] = useState()
  const fileInputRef = useRef(null)

  const dispatch = useDispatch()

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('token')
      const data = await getProfile(token)
      setProfile(formatterProfile(data))
    }
    fetchData()
  }, [])

  if (!localStorage.getItem('token')) {
    return (
      <div className='d-flex justify-content-center align-items-center vh-100'>
        <p className='text-muted'>Bạn chưa đăng nhập</p>
      </div>
    )
  }

  const handleAvatarClick = () => {
    fileInputRef.current.click() // mở file explorer
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('avatar', file)

    try {
      const token = localStorage.getItem('token')
      const updatedProfile = await updateAvatar(token, formData)
      dispatch(updateAvatarAction(updatedProfile.avatarUrl))
      setProfile(updatedProfile)
    } catch (err) {
      console.error('Cập nhật avatar thất bại', err)
    }
  }

  return (
    profile && (
      <div className='container my-4 flex-grow-1'>
        <div className='position-relative mb-5'>
          <div
            className='w-100 bg-secondary d-flex align-items-center justify-content-center text-white fw-bold'
            style={{ height: '200px', fontSize: '2rem' }}>
            Background
          </div>
          <div
            className='position-absolute start-0 ms-3 d-flex flex-column align-items-center'
            style={{ bottom: '-90px' }}>
            <div
              className={`position-relative rounded-circle border border-dark overflow-hidden ${styles.avatar}`}>
              <img
                src={profile?.avatarUrl}
                alt='avatar'
                style={{ width: '100px', height: '100px' }}
              />
              <div
                className={`btn position-absolute bottom-0 start-0 w-100 ${styles.cusBtn}`}
                onClick={handleAvatarClick}>
                <FontAwesomeIcon icon={faFolder} />
              </div>
              {/* input file */}
              <input
                type='file'
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept='image/*'
                onChange={handleFileChange}
              />
            </div>
            <h4 className='mt-2'>{profile.username}</h4>
          </div>
        </div>

        {/* Contact button */}
        <div className='d-flex justify-content-end mb-4 mt-5'>
          <button className='btn btn-success'>
            <i className='bi bi-send-fill'></i> Liên hệ
          </button>
        </div>

        <div className='row'>
          {/* Left: Progress & info */}
          <div className='col-md-4 mb-4'>
            <div className='card p-3'>
              <h5>{profile.level}</h5>
              <div className='progress mb-2' style={{ height: '20px' }}>
                <div
                  className='progress-bar'
                  role='progressbar'
                  style={{ width: `${profile.progressPercent}%` }}
                  aria-valuenow={profile.progressPercent}
                  aria-valuemin='0'
                  aria-valuemax='100'>
                  Bước 1
                </div>
              </div>
              <p>{profile.status}</p>
              <ul className='list-group list-group-flush'>
                <li className='list-group-item'>
                  <strong>Tên đăng nhập:</strong> {profile.username}
                </li>
                <li className='list-group-item'>
                  <strong>Email:</strong> {profile.email}
                </li>
                <li className='list-group-item'>
                  <strong>Sinh thần:</strong> {profile.id}
                </li>
                <li className='list-group-item'>
                  <strong>Ngày tạo:</strong>{' '}
                  {new Date(profile.createdDate).toLocaleString()}
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Story info */}
          <div className='col-md-8'>
            <div className='mb-3'>
              <h5 className='border-bottom pb-2'>
                Truyện đã đăng ({profile.storiesPosted})
              </h5>
              {profile.storiesPosted === 0 && <p>Không có truyện nào</p>}
            </div>
            <div className='mb-3'>
              <h5 className='border-bottom pb-2'>
                Truyện đang tham gia ({profile.storiesJoined})
              </h5>
              {profile.storiesJoined === 0 && <p>Không có truyện nào</p>}
            </div>
          </div>
        </div>
      </div>
    )
  )
}

export default Profile
