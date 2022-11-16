const express = require('express')
const router = express.Router()
const authenticateUser = require('../middleware/authentication')



const {register, login, updateUser} = require('../controls/auth')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/updateuser').patch(authenticateUser, updateUser)

module.exports = router