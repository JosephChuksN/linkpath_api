const express = require('express')
const router = express.Router()
const authenticateUser = require('../middleware/authentication')

const {
    register, 
    login, 
    updateUser, 
    verifyEmail, 
    sendPaswordResetLink, 
    resetPassword,
    changePassword,
    updateProfilePhoto} = require('../controls/auth')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/verify/:id/:token').get(verifyEmail)
router.route('/resetlink').post(sendPaswordResetLink)
router.route('/reset/:id/:token').post(resetPassword)
router.route('/updateuser').patch(authenticateUser, updateUser)
router.route('/addphoto').patch(authenticateUser, updateProfilePhoto)
router.route('/changepassword').patch(authenticateUser, changePassword)


module.exports = router