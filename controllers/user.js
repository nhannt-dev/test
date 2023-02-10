const crypto = require('crypto')
const cloudinary = require('cloudinary')
const User = require('../models/user')
const ErrorHander = require('../utils/errorhander')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const sendToken = require('../utils/jwtToken')
const sendEmail = require('../utils/sendEmail')

exports.registerUser  = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: 'Sample ID',
            url: 'profileURL'
        }
    })
    sendToken(user, 201, res)
})

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        return next(new ErrorHander('Vui lòng nhập đầy đủ thông tin', 400))
    }
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
        return next(new ErrorHander('Email hoặc mật khẩu không đúng', 401))
    }
    const isPasswordMatched = await user.comparePassword(password)
    if (!isPasswordMatched) {
        return next(new ErrorHander('Sai mật khẩu', 401))
    }
    sendToken(user, 200, res)
})

exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    })
    res.status(200).json({
        success: true,
        message: 'Thoát tài khoản thành công!',
      })
})

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return next(new ErrorHander('Không tìm thấy người dùng có email này!', 404))
    }
    const resetToken = user.getResetPasswordToken()
    await user.save({ validateBeforeSave: false })
    const resetPasswordUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`
    const message = `Địa chỉ khôi phục tài khoản của bạn là:- \n\n ${resetPasswordUrl} \n\nNếu yêu cầu này không phải của bạn. Vui lòng bỏ qua nó.`
    try {
        await sendEmail({
            email: user.email,
            subject: `Khôi phục mật khẩu người dùng`,
            message,
        })
        res.status(200).json({
            success: true,
            message: `Email được gửi đến ${user.email} thành công!`,
        })
    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save({ validateBeforeSave: false })
        return next(new ErrorHander(error.message, 500))
    }
})

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    })
    if (!user) {
        return next(new ErrorHander("Token truyền vào không hợp lệ hoặc đã hết hạn", 400))
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHander("Mật khẩu không khớp!", 400))
    }
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()
    sendToken(user, 200, res)
})

exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success: true,
        user
    })
})

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password")
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword)
    if (!isPasswordMatched) {
      return next(new ErrorHander("Mật khẩu cũ không đúng", 400))
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(new ErrorHander("Mật khẩu của 2 trường không khớp", 400))
    }
    user.password = req.body.newPassword
    await user.save()
    sendToken(user, 200, res)
})

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    sendToken(user, 200, res)
})

exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find()
    const usersCount = await User.countDocuments()
    res.status(200).json({
      success: true,
      users,
      usersCount
    })
})

exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        return next(new ErrorHander(`Người dùng không tồn tại với ID này: ${req.params.id}`))
    }
    res.status(200).json({
        success: true,
        user
    })
})

exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    sendToken(user, 200, res)
})

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    if (!user) {
      return next(new ErrorHander(`Người dùng không tồn tại với ID này: ${req.params.id}`, 400))
    }
    await user.remove()
    res.status(200).json({
      success: true,
      message: "Xóa người dùng thành công!"
    })
})