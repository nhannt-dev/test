const { registerUser, loginUser, logout } = require('../controllers/user')

const router = require('express').Router()

router.route('/register').post(registerUser)

router.route('/login').post(loginUser)

router.route("/logout").get(logout)




module.exports = router