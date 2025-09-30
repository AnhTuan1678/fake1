import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  build: {
    outDir: resolve(__dirname, '../server/dist'), // build trực tiếp sang server/dist
    emptyOutDir: true, // xóa trước khi build mới
  },
})
