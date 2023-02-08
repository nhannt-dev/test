const express = require("express")
const app = express()
const productRouter = require('./routes/product')
const userRouter = require('./routes/user')
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const fileUpload = require("express-fileupload")
const path = require("path")
const errorMiddleware = require('./middlewares/error')

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload())

app.use('/api/v1', productRouter)
app.use('/api/v1', userRouter)

app.use(errorMiddleware)

module.exports = app