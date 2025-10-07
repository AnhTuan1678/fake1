import { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { userAPI, progressAPI } from '../services/api'
import { formatterProfile } from '../utils/formatter'
import styles from './Profile.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleNotch,
  faFolder,
  faKey,
} from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from 'react-redux'
import { updateAvatar as updateAvatarAction } from '../redux/userSlice'
import StoryCard from '../components/StoryCard'
import { formatterStoryDetail } from '../utils/formatter'
import GuestNotice from '../components/GuestNotice'

const Profile = () => {
  const [profile, setProfile] = useState()
  const [progress, setProgress] = useState()
  const fileInputRef = useRef(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  const user = useSelector((state) => state.user)

  const navigate = useNavigate()
  const location = useLocation()

  const dispatch = useDispatch()

  useEffect(() => {
    async function fetchData() {
      const token = user.token
      if (!token) return
      const data = await userAPI.getProfile(token)
      setProfile(formatterProfile(data))
      const res = await progressAPI.getMyProgress(token, { limit: 12 })
      setProgress(res.data)
    }
    fetchData()
  }, [user.token])

  if (!user.isLoggedIn) {
    return <GuestNotice />
  }

  const handleAvatarClick = () => {
    fileInputRef.current.click() // mở file explorer
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('avatar', file)

    setIsUploadingAvatar(true)

    try {
      const token = localStorage.getItem('token')
      const updatedProfile = await userAPI.updateAvatar(token, formData)
      dispatch(updateAvatarAction(updatedProfile.avatarUrl))
      setProfile(updatedProfile)
    } catch (err) {
      console.error('Cập nhật avatar thất bại', err)
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  return (
    profile && (
      <div className='container my-4 flex-grow-1'>
        {isUploadingAvatar && (
          <div className='cus-overlay' style={{ zIndex: 100 }}>
            <FontAwesomeIcon
              className='start-50'
              icon={faCircleNotch}
              spin
              size='5x'
              color='#fff'
            />
          </div>
        )}
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
                src={profile?.avatarUrl || './avatar.png'}
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

        <div className='d-flex justify-content-end mb-4 mt-5'>
          <button
            className='btn btn-warning'
            onClick={() => {
              navigate('/auth?action=cp', {
                state: { from: location.pathname },
              })
            }}>
            <FontAwesomeIcon icon={faKey} className='me-2' />
            Đổi mật khẩu
          </button>
        </div>

        <div className='row'>
          {/* Left: Progress & info */}
          <div className='col-md-4 m-0'>
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
                  <strong>Id:</strong> {profile.id}
                </li>
                <li className='list-group-item'>
                  <strong>Username:</strong> {profile.username}
                </li>
                <li className='list-group-item'>
                  <strong>Email:</strong> {profile.email}
                </li>
                <li className='list-group-item'>
                  <strong>Ngày tạo:</strong>{' '}
                  {new Date(profile.createdDate).toLocaleDateString()}
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Story info */}
          <div className='col-md-8 m-0 p-0'>
            <div className='mb-3 border shadow p-2 m-0 rounded cus-container'>
              <h5 className='border-bottom pb-2 m-3 fs-3 fw-normal text-blue'>
                Truyện đã đăng ({profile.storiesPosted})
              </h5>
              {profile.storiesPosted === 0 && <p>Không có truyện nào</p>}
            </div>
            {progress && (
              <div className='mb-3 border shadow p-2 m-0 rounded cus-container'>
                <h5 className='border-bottom pb-2 m-3 fs-3 fw-normal text-blue'>
                  Truyện đã đọc ({progress?.length})
                </h5>
                {progress?.length === 0 ? (
                  <p>Không có truyện nào</p>
                ) : (
                  <>
                    <div className='row mx-0'>
                      {progress.map((book) => (
                        <StoryCard
                          key={book.id}
                          story={formatterStoryDetail(book.Book)}
                          className='col-4 col-md-4 col-lg-3 p-1'
                        />
                      ))}
                    </div>

                    <div className='text-center'>
                      <button
                        className='btn btn-outline-primary'
                        onClick={() => navigate('/history')}>
                        Xem tất cả
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  )
}

export default Profile
