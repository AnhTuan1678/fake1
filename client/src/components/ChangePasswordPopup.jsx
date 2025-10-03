import { useState, useEffect } from 'react'
import styles from './LoginPopup.module.css'
import { changePassword } from '../services/api'
import { useSnackbar } from '../context/SnackbarContext'

const ChangePasswordPopup = ({ isOpen, onClose, token }) => {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { showSnackbar } = useSnackbar()

  useEffect(() => {
    if (isOpen) {
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setError('')
      setSuccess('')
    }
  }, [isOpen])

  if (!isOpen) return <></>

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới và xác nhận không khớp')
      return
    }

    if (newPassword === oldPassword) {
      setError('Không thay đôi')
      return
    }

    try {
      const data = await changePassword(token, oldPassword, newPassword)
      if (data.error) {
        showSnackbar({ status: 'error', message: data.error })
      } else {
        showSnackbar(data) // "Đổi mật khẩu thành công"
        onClose()
      }
    } catch (err) {
      console.error(err)
      setError('Đổi mật khẩu thất bại')
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>Đổi mật khẩu</h3>
        <form onSubmit={handleChangePassword} className={styles.form}>
          <input
            type='password'
            placeholder='Mật khẩu cũ'
            value={oldPassword}
            onChange={(e) => {
              setOldPassword(e.target.value)
              setError('')
            }}
          />
          <input
            type='password'
            placeholder='Mật khẩu mới'
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value)
              setError('')
            }}
          />
          <input
            type='password'
            placeholder='Xác nhận mật khẩu mới'
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              setError('')
            }}
          />

          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}

          <button type='submit'>Đổi mật khẩu</button>
        </form>

        <button className={styles.closeButton} onClick={onClose}>
          X
        </button>
      </div>
    </div>
  )
}

export default ChangePasswordPopup
