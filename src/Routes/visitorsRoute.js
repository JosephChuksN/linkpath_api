const express = require('express')
const router = express.Router()
const {getLinks} = require('../controls/visitorsControl')



router.route('/:name').get(getLinks)

module.exports = router

