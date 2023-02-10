const ErrorHandler = require("../utils/errorhander")

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Lỗi máy chủ"

    if (err.name === "CastError") {
        const message = `ID này không hợp lệ: ${err.path}`
        err = new ErrorHandler(message, 400)
    }

    if (err.code === 11000) {
        const message = `Dữ liệu đã được nhập trươc đó ${Object.keys(err.keyValue)} `
        err = new ErrorHandler(message, 400)
    }

    if (err.name === "JsonWebTokenError") {
        const message = `Token truyền vào khồng hợp lệ`
        err = new ErrorHandler(message, 400)
    }

    if (err.name === "TokenExpiredError") {
        const message = `Token truyền vào hết hạn`
        err = new ErrorHandler(message, 400)
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    })
}