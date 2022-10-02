const Links = require('../model/links')
const {StatusCodes} = require('http-status-codes')

const createLink = async (req, res)=>{
   req.body.createdBy = req.user.userId
   const link = await Links.create(req.body)
   res.status(StatusCodes.CREATED).json({link})
}

const getAllLinks = async (req, res) =>{
    res.send('getall links')
}
const updateLink = async (req, res) =>{
    res.send('update links')
}
const deleteLink = async (req, res) =>{
    res.send('delete links')
}

module.exports={ getAllLinks, createLink, updateLink, deleteLink}