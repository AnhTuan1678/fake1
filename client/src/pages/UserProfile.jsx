import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { userAPI, progressAPI } from '../services/api'
import { formatterProfile, formatterStoryDetail } from '../utils/formatter'
import StoryCard from '../components/StoryCard'

const UserProfile = () => {
  const [searchParams] = useSearchParams()
  const [profile, setProfile] = useState()
  const [progress, setProgress] = useState()
  // const navigate = useNavigate()

  console.log(profile)
  useEffect(() => {
    async function fetchData() {
      const id = searchParams.get('id')
      try {
        const data = await userAPI.getUserById(id)
        setProfile(formatterProfile(data))
        console.log(data)
        const res = await progressAPI.getUserProgress(id, { limit: 12 })
        setProgress(res.data)
        console.log(res)
      } catch (err) {
        console.error('Lấy thông tin user thất bại', err)
      }
    }
    fetchData()
  }, [searchParams])

  if (!profile) {
    return (
      <div className='d-flex justify-content-center align-items-center vh-100'>
        <p className='text-muted'>Đang tải thông tin...</p>
      </div>
    )
  }

  if (profile.error || !profile.id) {
    return (
      <div className='d-flex justify-content-center align-items-center vh-100'>
        <p className='text-muted'>User không tồn tại.</p>
      </div>
    )
  }
  return (
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
            className='position-relative rounded-circle border border-dark overflow-hidden'
            style={{ width: '100px', height: '100px' }}>
            <img
              src={profile?.avatarUrl || './avatar.png'}
              alt='avatar'
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <h4 className='mt-2'>{profile.username}</h4>
        </div>
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
                Truyện đọc gần đây ({progress?.length})
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
                  <div className='text-center'></div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile
