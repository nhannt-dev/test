const ErrorHander = require('../utils/errorhander')
const catchAsyncErrors = require('./catchAsyncErrors')
const User = require('../models/user')
const jwt = require("jsonwebtoken")

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies
    if (!token) {
        return next(new ErrorHander("Bạn chưa đăng nhập", 401))
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decodedData.id)
    next()
})

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHander(`Role ${req.user.role} không được phép truy cập vào nguồn tài nguyên này!`, 403))
        }  
        next()
    }
}