const { Sequelize } = require('sequelize')

// Khởi tạo kết nối
const sequelize = new Sequelize(
  process.env.DB_NAME || 'NaDark',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '1',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    // dialectOptions: {
    //   ssl: {
    //     require: true,
    //     rejectUnauthorized: false, // nếu dùng chứng chỉ self-signed
    //   },
    // },
    logging: false,
  },
)

// Kiểm tra kết nối
sequelize
  .authenticate()
  .then(() => console.log('DB connected!'))
  .catch((err) => console.error('DB connection error:', err))

module.exports = sequelize
