const crypto = require("crypto")
const cloudinary = require("cloudinary")
const User = require('../models/user')
const ErrorHander = require('../utils/errorhander')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const sendToken = require("../utils/jwtToken")

exports.registerUser  = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "Sample ID",
            url: "profileURL"
        }
    })
    sendToken(user, 201, res)
})

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        return next(new ErrorHander("Vui lòng nhập đầy đủ thông tin", 400));
    }
    const user = await User.findOne({ email }).select("+password")
    if (!user) {
        return next(new ErrorHander("Email hoặc mật khẩu không đúng", 401))
    }
    const isPasswordMatched = await user.comparePassword(password)
    if (!isPasswordMatched) {
        return next(new ErrorHander("Sai mật khẩu", 401))
    }
    sendToken(user, 200, res)
})

exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    })
    res.status(200).json({
        success: true,
        message: "Thoát tài khoản thành công!",
      });
})