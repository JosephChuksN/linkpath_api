const User = require("../model/user")
const {StatusCodes}  = require('http-status-codes')
const {BadRequestErr} = require("../errors/errIndex")
const {UnauthorizeErr} = require('../errors/errIndex')




const register = async (req, res)=>{

try {
const user = await User.create({...req.body})
const token = user.createJwt()
      res.status(StatusCodes.CREATED).json({user: {name:user.name, email:user.email}, token })

} catch (error) {
       console.log(error)
       res.status(400)
    }
}

const login = async (req, res)=>{
     const { email, password} = req.body
     // check for inputs
     if(!email || !password){
      throw new BadRequestErr("please enter email and password")
     }
     //checks if user exits in db
     const user = await User.findOne({email})
     if(!user){
      throw new UnauthorizeErr("invalid email")
     }
     //check if password matched
     const matchedPass = await user.comparePassword(password)
     if(!matchedPass){
      throw UnauthorizeErr('invalid password')
     }
     const token =  user.createJwt()
     res.status(StatusCodes.OK).json({user:{name:user.name, email:user.email}, token })
}

module.exports = {register, login}