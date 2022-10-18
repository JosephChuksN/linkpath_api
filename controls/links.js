const Links = require('../model/links')
const {BadRequestErr} = require('../errors/errIndex')
const {StatusCodes} = require('http-status-codes')

const createLink = async (req, res)=>{
    
 const {siteLink, siteName} = req.body
   req.body.createdBy = req.user.userId
   const link = await Links.create(req.body)
   res.status(StatusCodes.CREATED).json({link})
}

const getAllLinks = async (req, res) =>{
    const links = await Links.find({createdBy: req.user.userId}).sort("createdAt")
    res.status(StatusCodes.OK).json({links})
}
const updateLink = async (req, res) =>{
   const {
    body:{siteLink, siteName},
    user: {userId},
    params: {id: linkId}
   } = req

   if(siteLink === "" || siteName ===""){
    throw new BadRequestErr('siteLink or sitename fields cannot be blank')
   }
   const link = await Links.findByIdAndUpdate({_id:linkId, createdBy:userId}, req.body, {new:true, runValidators:true} )
   res.status(StatusCodes.OK).json({link})
}
const deleteLink = async (req, res) =>{
    const {
        user: {userId},
        params: {id: linkId}
       } = req

       const link = await Links.findByIdAndRemove({_id: linkId, createdBy: userId})
       res.status(StatusCodes.OK).json({link})
}

module.exports={ getAllLinks, createLink, updateLink, deleteLink}