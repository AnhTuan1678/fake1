import { useState, useCallback } from 'react'
import Snackbar from '../components/SnackBar'
import { SnackbarContext } from './SnackbarContext'

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    status: 'success',
  })

  const showSnackbar = useCallback(({ message, status = 'success' }) => {
    setSnackbar({ open: true, message, status })
  }, [])

  const handleClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {snackbar.open && (
        <Snackbar
          message={snackbar.message}
          status={snackbar.status}
          onClose={handleClose}
        />
      )}
    </SnackbarContext.Provider>
  )
}
