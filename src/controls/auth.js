const User = require("../model/user")
const {StatusCodes}  = require('http-status-codes')
const fs = require('fs')
const path = require('path')
const cloudinary = require('cloudinary')
const dotenv = require('dotenv').config()


cloudinary.config({ 
      cloud_name: process.env.CLOUD_NAME, 
      api_key:  process.env.API_KEY,
      api_secret: process.env.API_SECRET_KEY
    });



const register = async (req, res)=>{
      
      const {name, email, password} = req.body

  //check for all values
      if(!name || !email || !password){
      res.status(StatusCodes.BAD_REQUEST).json({msg: "Please provide value for each field"})
      }

  //check password length
      if(password.length < 6){
      res.status(StatusCodes.BAD_REQUEST).json({msg: "Password length must be greater than 6 characters."})
      }
  //check if username exist
      const usernameAlreadyExist = await User.findOne({name})
      if(usernameAlreadyExist){
      res.status(StatusCodes.BAD_REQUEST).json({msg: "User with username already exist"})
      }

  //check if email already exits in database
      const emailAlreadyExist = await User.findOne({email})
      if(emailAlreadyExist){
      res.status(StatusCodes.BAD_REQUEST).json({msg: "User with email already exist"})
      }

      const user = await User.create({name, email, password})
      const token = await user.createJwt()
      res.status(StatusCodes.CREATED).json({user: {name:user.name, email:user.email, bio:user.bio, profileImg:user.profileImg}, token, bio:user.bio })
    
}

const login = async (req, res)=>{
     const { email, password} = req.body

  // check for inputs
     if(!email || !password){
      res.status(StatusCodes.BAD_REQUEST).json({msg: "Please enter email and password" })
     }
     
  //checks if user exits in db
     const user = await User.findOne({email}).select('+password')
     if(!user){
      res.status(StatusCodes.BAD_REQUEST).json({msg: "Invalid user credentials"})
     }

  //check if password matched
     const matchedPass = await user.comparePassword(password)
     if(!matchedPass){
      res.status(StatusCodes.BAD_REQUEST).json({msg: "Invalid email or password"})
     }

     const token = await user.createJwt()
     user.password = undefined
     res.status(StatusCodes.OK).json({user, token, bio: user.bio })
}

const updateUser = async (req, res)=>{

      const {name, email, bio} = req.body
      if(!name || !email){
            res.status(StatusCodes.BAD_REQUEST).json({msg: "Please provide values username and email"})
      }
      const filePath = req.file ? req.file.path : null
      const  user = await User.findOne({_id: req.user.userId})
    //   const emailAlreadyExist = await User.find({email:email})
    //   if(emailAlreadyExist){
    //     res.status(StatusCodes.BAD_REQUEST).json({msg:"this email is already in use"})
    //   }
      console.log(user)
      if(!filePath){
      try {
           user.name = name
           user.email = email
           user.bio = bio
            
           await user.save()
           const token = await user.createJwt()
            
           res.status(StatusCodes.OK).json({user, token, bio: user.bio})
          } catch (error) {
                  console.log(error)
          }
      }

      cloudinary.v2.uploader.upload(filePath).then(async (result)=>{   
      
           user.name = name
           user.email = email
           user.bio = bio
           user.profileImg = result.secure_url
            
           await user.save()
           const token = await user.createJwt()
            
           res.status(StatusCodes.OK).json({user, token, bio: user.bio})
         
       }).catch(err=>{
            console.log(err)
       })
      
    

}

module.exports = {register, login, updateUser}