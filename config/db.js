const mongoose = require("mongoose")

const connectDatabase = () => {
  mongoose.connect(process.env.DB_URI)
    .then(() => console.log('Kết nối DB thành công!'))
}

module.exports = connectDatabase