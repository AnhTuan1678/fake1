import Dexie from 'dexie'

// Tạo database tên CacheDB
export const db = new Dexie('CacheDB')

// Tạo bảng "cache" với key là string
db.version(1).stores({
  cache: 'key, expiry', // key = unique, expiry để query dọn dẹp
})

window.db=db