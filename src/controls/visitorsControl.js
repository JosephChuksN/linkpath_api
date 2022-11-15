const User = require('../model/user')
const Links = require('../model/links')
const {StatusCodes} = require('http-status-codes')

const getLinks =  async(req, res)=>{
    const {params: {name: userName}} = req
    const user =  await User.findOne({name:userName}).select('-password')
   
    if(!user){
        res.status(StatusCodes.NOT_FOUND).json({msg: "User not found"})
    }
    const id = user._id.toString()
    const link = await Links.find({createdBy:id}).sort("createdAt")

    res.status(StatusCodes.OK).json({user, link})
}

module.exports = {getLinks}