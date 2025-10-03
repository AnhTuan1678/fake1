import { createContext, useContext } from 'react'

export const SnackbarContext = createContext()

export const useSnackbar = () => useContext(SnackbarContext)
