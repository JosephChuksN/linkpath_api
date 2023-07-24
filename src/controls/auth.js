const User = require("../model/user")
const {StatusCodes}  = require('http-status-codes')
const emailConfirmation = require("../utils/sendEmail")
const Token = require("../model/token")
const  crypto  = require("crypto")
const token = require("../model/token")




const register = async (req, res)=>{
      
      const {name, email, password} = req.body
try {
  //check for all values
  if(!name || !email || !password){
   res.status(StatusCodes.BAD_REQUEST).json({msg: "Please provide value for each field"})
   }

//check password length
   if(password?.length < 6){
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

   const _token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex")
   }).save()
   const url = `${process.env.BASE_URL}verify/${user._id}/user/${_token.token}`
   const mail = `<p>Verify your email address to complete signup and login to your account. <br>
   This link expires in <b>1</b> hour <br> Click <a href=${url}>here</a> to proceed</p>`
   await emailConfirmation(email, "Verify Email", mail)
   res.status(StatusCodes.CREATED).json(
      { user: {name:user.name, email:user.email, bio:user.bio, profileImg:user.profileImg}, bio:user.bio, msg:` A verification link was sent to ${email}` })
 
} catch (error) {
    
   res.status(StatusCodes.BAD_REQUEST).json({msg: "server error try again"})
}
}

const verifyEmail = async (req, res) =>{
 
   

   try {
      const user = await User.findOne({_id:req.params.id})

      if(!user) return res.status(StatusCodes.NOT_FOUND).json({msg: "invalid link"})
      const _token = await Token.findOne({
         userId: user._id,
         token: req.params.token
      })

      if(!_token) return res.status(StatusCodes.NOT_FOUND).json({msg: "invalid link"})

      await User.updateOne({_id:user._id},{verified: true})
      await _token.remove()
      const token = await user.createJwt()
      res.status(StatusCodes.OK).json({ user: {name:user.name, email:user.email, bio:user.bio, profileImg:user.profileImg}, token, bio:user.bio, msg: "email confirmed"})

   } catch (error) {
      res.status(StatusCodes.EXPECTATION_FAILED).json({msg: "invalid link"})
   }
   
}

const login = async (req, res)=>{
     const { email, password} = req.body
  try {
   
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
  if(!user.verified){
   const _token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex")
   }).save()
   const url = `${process.env.BASE_URL}/verify/${user._id}/user/${_token.token}`
   const mail = `<p>Verify your email address to complete signup and login to your account. <br>
   This link expires in <b>1</b> hour <br> Click <a href=${url}>here</a> to proceed</p>`
   await emailConfirmation(email, "Verify Email", mail)
   return res.status(StatusCodes.UNAUTHORIZED).json({ msg:` A verification link was sent to ${email}` })
  }

  const token = await user.createJwt()
  user.password = undefined
  res.status(StatusCodes.OK).json({user, token, bio: user.bio })
   
   } catch (error) {
   
   }
}

const updateUser = async (req, res)=>{

      const {name, email, bio, profileImg} = req.body
      if(!name || !email){
            res.status(StatusCodes.BAD_REQUEST).json({msg: "Please provide values username and email"})
      }

    //   const nameAlreadyExist = await User.find({name:name})

    //   if(nameAlreadyExist){
    //     res.status(StatusCodes.BAD_REQUEST).json({msg: "username already in use by you or another user"})
    //   }

    //   const  emailAlreadyExist = await User.find({email:email}) 
    //   if(emailAlreadyExist){
    //         res.status(StatusCodes.BAD_REQUEST).json({msg: "Email already in use by you or another user"})
    //   }
     try {
        const  user = await User.findOne({_id: req.user.userId})

        if(!profileImg){       
          user.name = name
          user.email = email
          user.bio = bio
          
          await user.save()
          const token = await user.createJwt()
           
          res.status(StatusCodes.OK).json({user, token, bio: user.bio})
        }else{ 
          user.name = name
          user.email = email
          user.bio = bio
          user.profileImg = profileImg
         
          await user.save()
          const token = await user.createJwt()
         
          res.status(StatusCodes.OK).json({user, token, bio: user.bio})
        }
     } catch (error) {
        res.status(StatusCodes.EXPECTATION_FAILED).json({msg:error})
     }


}

module.exports = {register, login, updateUser, verifyEmail}