const User = require("../model/user")
const {StatusCodes}  = require('http-status-codes')






const register = async (req, res)=>{
      
const {name, email, password} = req.body

//check for all values
      if(!name || !email || !password){
      res.status(StatusCodes.BAD_REQUEST).json({msg: "Please provide value for each field"})
      }

//check password length
      if(password.length !== 6){
      res.status(StatusCodes.BAD_REQUEST).json({msg: "Password length must be greater than 8 characters."})
      }
//check if username exist
const usernameAlreadyExist = User.findOne({name})
      if(usernameAlreadyExist){
      res.status(StatusCodes.BAD_REQUEST).json({msg: "User username already exist"})
      }

//check if email already exits in database
const emailAlreadyExist = await User.findOne({email})
      if(emailAlreadyExist){
      res.status(StatusCodes.BAD_REQUEST).json({msg: "User with email already exist"})
      }

const user = await User.create({name, email, password})
const token = user.createJwt()
      res.status(StatusCodes.CREATED).json({user: {name:user.name, email:user.email}, token })
    
}

const login = async (req, res)=>{
     const { email, password} = req.body

     // check for inputs
     if(!email || !password){
      res.status(StatusCodes.BAD_REQUEST).json({msg: "Please enter email and password" })
     }
     
     //checks if user exits in db
     const user = await User.findOne({email})
     if(!user){
      res.status(StatusCodes.BAD_REQUEST).json({msg: "Invalid email or password"})
     }

     //check if password matched
     const matchedPass = await user.comparePassword(password)
     if(!matchedPass){
      res.status(StatusCodes.BAD_REQUEST).json({msg: "Invalid email or password"})
     }

     const token =  user.createJwt()
     res.status(StatusCodes.OK).json({user:{name:user.name, email:user.email}, token })
}

module.exports = {register, login}