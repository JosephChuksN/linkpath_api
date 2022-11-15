const express = require('express')
const router = express.Router()
const authenticateUser = require('../middleware/authentication')
const {upload}  = require('../middleware/multer')


const {register, login, updateUser} = require('../controls/auth')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/updateuser').patch(authenticateUser, upload, updateUser)

module.exports = router