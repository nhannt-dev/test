const Product = require('../models/product')
const ErrorHandler = require('../utils/errorhander')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ApiFeatures = require('../utils/apifeatures')

exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.create(req.body)

    res.status(201).json({
        success: true,
        product,
    })
})

exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 3
    const productsCount = await Product.countDocuments()
    const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage)
    let products = await apiFeature.query

    res.status(200).json({
        success: true,
        products,
        productsCount
    })
})

exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id)
    if (!product) {
        return next(new ErrorHandler('Không tìm thấy sản phẩm', 404))
    }
    res.status(200).json({
        success: true,
        product,
    })
})

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id)
    if (!product) {
        return next(new ErrorHandler('Không tìm thấy sản phẩm', 404))
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })
    res.status(200).json({
        success: true,
        product,
    })
})

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id)
    if (!product) {
        return next(new ErrorHandler('Không tìm thấy sản phẩm', 404))
    }
    await product.remove()
    res.status(200).json({
        success: true,
        message: "Xóa sản phẩm thành công!",
    })
})











