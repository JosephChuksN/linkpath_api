const express = require('express')
const router = express.Router()


const {getAllLinks,  createLink, deleteLink, updateLink} = require('../controls/links')


router.route('/').post(createLink).get(getAllLinks)
router.route('/:id').delete(deleteLink).patch(updateLink)

module.exports = router