const User = require("../model/user")
const {StatusCodes}  = require('http-status-codes')
const {BadRequestErr} = require("../errors/errIndex")
const {UnauthorizeErr} = require('../errors/errIndex')




const register = async (req, res)=>{
      
const {name, email, password} = req.body

//check for all values
if(!name || !email || !password){throw new BadRequestErr('Please provide values for all feilds')}

//check if email already exits in database
const emailAlreadyExist = await User.findOne({email})
if(emailAlreadyExist){throw new BadRequestErr('user with email address already exists')}

const user = await User.create({name, email, password})
const token = user.createJwt()
      res.status(StatusCodes.CREATED).json({user: {name:user.name, email:user.email}, token })
    
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