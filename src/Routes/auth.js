const express = require('express')
const router = express.Router()
const authenticateUser = require('../middleware/authentication')



const {register, login, updateUser, verifyEmail} = require('../controls/auth')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/verify/:id/:token').get(verifyEmail)
router.route('/updateuser').patch(authenticateUser, updateUser)


module.exports = router