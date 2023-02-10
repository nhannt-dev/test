const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema.Types

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Vui lòng nhập tên sản phẩm"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Vui lòng nhập mô tả"],
    },
    price: {
        type: Number,
        required: [true, "Vui lòng nhập giá tiền"],
        maxLength: [8, "Giá tiền không dược quá 8 chữ số"],
    },
    ratings: {
        type: Number,
        default: 0,
    },
    images: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            }
        }
    ],
    category: {
        type: String,
        required: [true, "Vui lòng nhập danh mục"],
    },
    Stock: {
        type: Number,
        required: [true, "Vui lòng nhập tồn kho"],
        maxLength: [4, "Vui long không nhập quá 4 chữ số"],
        default: 1,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user: {
                type: ObjectId,
                ref: "User",
                required: true
            },
            name: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            },
        },
    ],
    user: {
        type: ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
})


module.exports = mongoose.model("Product", productSchema)