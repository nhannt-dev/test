require('dotenv').config()
const app = require("./app")
const connectDatabase = require('./config/db')
const PORT = process.env.PORT

process.on("uncaughtException", (err) => {
    console.log(`Lỗi: ${err.message}`)
    console.log('Đã ngưng server do phát hiện có điều bất thường trong quá trình khởi chạy')
    process.exit(1)
})

connectDatabase()

const server = app.listen(PORT, () => {
    console.log(`Server đang hoạt động tại địa chỉ http://localhost:${PORT}`)
})

process.on('unhandledRejection', (err) => {
    console.log(`Lỗi: ${err.message}`)
    console.log('Đã ngưng server do phát hiện có vấn đề trong quá trình khởi chạy')
    server.close(() => process.exit(1))
})