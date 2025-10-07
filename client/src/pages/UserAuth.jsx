import { useEffect, useState } from 'react'
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom'
import styles from './UserAuth.module.css'
import { authAPI } from '../services/api'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../redux/userSlice'
import { useSnackbar } from '../context/SnackbarContext'

const UserAuth = () => {
  const [tab, setTab] = useState('l')
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()

  // trang trước đo
  const from = location.state?.from || '/'
  console.log(from)

  const handleSuccess = () => {
    navigate(from, { replace: true })
  }

  useEffect(() => {
    const action = searchParams.get('action')
    switch (action) {
      case 'l':
        setTab('l')
        break
      case 'cp':
        setTab('cp')
        break
      default:
        setTab('r')
    }
  }, [searchParams])

  return (
    <div className={styles.container}>
      <div className='AuthHeader_header'></div>
      {tab === 'l' && <Login onSuccess={handleSuccess} />}
      {tab === 'r' && <Register onSwitchTab={() => setTab('l')} />}
      {tab === 'cp' && (
        <ChangePassword isOpen={true} onSuccess={handleSuccess} />
      )}
    </div>
  )
}

const Login = ({ onSuccess = () => {} }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [disabled, setDisabled] = useState(true) // trạng thái nút
  const dispatch = useDispatch()
  const [, setSearchParams] = useSearchParams()

  // useEffect để kiểm tra lỗi liên tục
  useEffect(() => {
    if (!usernameOrEmail.trim()) {
      setError('Chưa nhập tên tài khoản hoặc email')
      setDisabled(true)
    } else if (!password.trim()) {
      setError('Chưa nhập mật khẩu')
      setDisabled(true)
    } else {
      setError('') // Xóa lỗi nếu đủ thông tin
      setDisabled(false) // bật nút
    }
  }, [usernameOrEmail, password])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const data = await authAPI.login(usernameOrEmail, password)
      if (data.token) {
        dispatch(login(data))
        localStorage.setItem('token', data.token)
        onSuccess()
      } else {
        setError(data.error)
      }
    } catch (err) {
      console.error(err)
      setError('Đăng nhập thất bại')
    }
  }

  return (
    <div className={styles.modal}>
      <h2 className={styles.title}>Đăng nhập</h2>

      <form onSubmit={handleLogin} className={styles.form}>
        <div className='w-100 floating-label'>
          <input
            type='text'
            placeholder=''
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
          />
          <label className={styles.label}>Tên tài khoản hoặc email *</label>
        </div>
        <div className='floating-label'>
          <input
            type='password'
            placeholder=''
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className={styles.label}>Mật khẩu *</label>
        </div>

        <a href='#' className={`${styles.btn} fw-bold`}>
          Quên mật khẩu?
        </a>

        <div
          className={styles.error}
          style={{ visibility: error ? 'visible' : 'hidden' }}>
          {error || 'Placeholder'}
        </div>

        <button type='submit' className={styles.submit} disabled={disabled}>
          Đăng nhập
        </button>
      </form>

      <p className={styles.footerText}>
        Chưa có tài khoản?{' '}
        <span
          className={`${styles.btn} fw-bold`}
          onClick={() => setSearchParams({ action: 'r' })}
          style={{ cursor: 'pointer' }}>
          Đăng ký ngay
        </span>
      </p>
    </div>
  )
}

const Register = ({ onSwitchTab }) => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [disabled, setDisabled] = useState(true)
  const [, setSearchParams] = useSearchParams()

  useEffect(() => {
    if (!username.trim()) {
      setError('Chưa nhập tên tài khoản')
      setDisabled(true)
    } else if (!email.trim()) {
      setError('Chưa nhập email')
      setDisabled(true)
    } else if (!password.trim()) {
      setError('Chưa nhập mật khẩu')
      setDisabled(true)
    } else {
      setError('')
      setDisabled(false)
    }
  }, [username, email, password])

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const data = await authAPI.register(username, email, password)
      if (!data.error) {
        onSwitchTab()
      } else {
        setError(data.error)
      }
    } catch (err) {
      console.error(err)
      setError('Đăng ký thất bại')
    }
  }

  return (
    <div className={styles.modal}>
      <h2 className={styles.title}>Đăng ký</h2>

      <form onSubmit={handleRegister} className={styles.form}>
        <div className='floating-label'>
          <input
            type='text'
            placeholder=''
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label className={styles.label}>Tên tài khoản *</label>
        </div>
        <div className='floating-label'>
          <input
            type='email'
            placeholder=''
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className={styles.label}>Email *</label>
        </div>
        <div className='floating-label'>
          <input
            type='password'
            placeholder=''
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className={styles.label}>Mật khẩu *</label>
        </div>

        <div
          className={styles.error}
          style={{ visibility: error ? 'visible' : 'hidden' }}>
          {error || 'Placeholder'}
        </div>

        <button type='submit' className={styles.submit} disabled={disabled}>
          Đăng ký
        </button>
      </form>

      <p className={styles.footerText}>
        Đã có tài khoản?{' '}
        <span
          className={`${styles.btn} fw-bold`}
          onClick={() => setSearchParams({ action: 'l' })}
          style={{ cursor: 'pointer' }}>
          Đăng nhập
        </span>
      </p>
    </div>
  )
}

const ChangePassword = ({ onSuccess = () => {} }) => {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [disabled, setDisabled] = useState(true)

  const token = useSelector((state) => state.user.token)
  const { showSnackbar } = useSnackbar()

  // useEffect để kiểm tra lỗi liên tục
  useEffect(() => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin')
      setDisabled(true)
    } else if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới và xác nhận không khớp')
      setDisabled(true)
    } else if (newPassword === oldPassword) {
      setError('Mật khẩu mới phải khác mật khẩu cũ')
      setDisabled(true)
    } else {
      setError('')
      setDisabled(false)
    }
  }, [oldPassword, newPassword, confirmPassword])

  const handleChangePassword = async (e) => {
    e.preventDefault()
    try {
      const data = await authAPI.changePassword(token, oldPassword, newPassword)

      if (data.error) {
        showSnackbar({ status: 'error', message: data.error })
      } else {
        showSnackbar({ status: 'success', message: 'Đổi mật khẩu thành công' })
        onSuccess()
        // Reset form sau khi đổi thành công
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch (err) {
      console.error(err)
      setError('Đổi mật khẩu thất bại')
    }
  }

  return (
    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
      <h3>Đổi mật khẩu</h3>
      <form onSubmit={handleChangePassword} className={styles.form}>
        <div className='floating-label'>
          <input
            type='password'
            placeholder=''
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <label className={styles.label}>Mật khẩu cũ</label>
        </div>

        <div className='floating-label'>
          <input
            type='password'
            placeholder=''
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <label className={styles.label}>Mật khẩu mới</label>
        </div>

        <div className='floating-label'>
          <input
            type='password'
            placeholder=''
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <label className={styles.label}>Xác nhận mật khẩu mới</label>
        </div>

        <div
          className={styles.error}
          style={{ visibility: error ? 'visible' : 'hidden' }}>
          {error || 'Placeholder'}
        </div>

        <button type='submit' className={styles.submit} disabled={disabled}>
          Đổi mật khẩu
        </button>
      </form>
    </div>
  )
}

export default UserAuth
