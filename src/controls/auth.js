const User = require("../model/user")
const {StatusCodes}  = require('http-status-codes')
const emailConfirmation = require("../utils/sendEmail")
const Token = require("../model/token")
const ResetToken = require("../model/reset")
const  crypto  = require("crypto")
const bcrypt = require("bcrypt")





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
   const saltRounds = await bcrypt.genSalt(10)
   const hashedPassword = await bcrypt.hash(password, saltRounds)

   const user = await User.create({name, email, password:hashedPassword})

   const _token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex")
   }).save()
   const url = `${process.env.BASE_URL}verify/${user._id}/user/${_token.token}`
   const mail = `<p>Verify your email address to complete signup and login to your account. <br>
   This link expires in <b>1</b> hour <br> Click <a href=${url}>here</a> to proceed</p>`
   await emailConfirmation(email, "Verify Email", mail)
   res.status(StatusCodes.CREATED).json(
      { user: {name:user.name, email:user.email, bio:user.bio, profileImg:user.profileImg}, msg:` A verification link was sent to ${email}` })
 
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
  const matchedPass = user.comparePassword(password)
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

      const {displayName, bio, } = req.body
      if(!displayName && !bio){
            res.status(StatusCodes.BAD_REQUEST).json({msg: "Please provide values to carryout this operation"})
      }

     try {
        const  user = await User.findOne({_id: req.user.userId})  
          user.displayName = displayName
          user.bio = bio
          await user.save()
          const token = await user.createJwt()
          res.status(StatusCodes.OK).json({user, token, bio: user.bio})    
     } catch (error) {
        res.status(StatusCodes.EXPECTATION_FAILED).json({msg:error})
     }


}

const updateProfilePhoto = async (req, res) =>{
   const { profileImg } = req.body

   try {
      const user = await User.findOne({_id: req.user.userId})
      //  await User.updateOne({_id: req.user.userId}, {profileImg: profileImg})
      user.profileImg = profileImg
      await user.save()
      const token = await user.createJwt()
   return res.status(StatusCodes.OK).json({user, token, bio:user.bio, msg:"photo upload complete"})
   } catch (error) {
      res.status(StatusCodes.BAD_REQUEST)
   }
}

const sendPaswordResetLink = async (req, res) => {
   const { email } = req.body
  try {
   if(!email) return res.status(StatusCodes.BAD_REQUEST).json({msg: "Email cannot be blank"})

   const user = await User.findOne({email})
   if(!user) return res.status(StatusCodes.BAD_REQUEST).json({msg: "There is no user with this email"})
   const availableToken = await ResetToken.findOne({userId: user._id})
   if(availableToken) return res.status(StatusCodes.BAD_REQUEST).json({msg: "Please check your email a reset was already sent."})
   const resetToken = await new ResetToken({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex")
   }).save()
   const url = `${process.env.BASE_URL}resetpassword/${user._id}/${resetToken.token}`
   const mail = `<p>Password reset link. <br>
   This link expires in <b>10 minutes </b> <br> Click <a href=${url}>here</a> to reset your linkpath password <br>
   if you didn't forget your password please ignore this email
   </p>`
   await emailConfirmation(email, "Reset Password", mail)

   res.status(200).json({msg: `A password reset link was sent to ${email}`})
   
  } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({msg: "There was an error"})
  }

}

const resetPassword = async (req, res) => {
      const { password } = req.body
  try {
     const user = await User.findOne({_id:req.params.id}).select('+password')
     if(!user) {
       res.status(StatusCodes.NOT_FOUND).json({msg: "invalid link request a new one"})
     }
     const resetToken = await ResetToken.findOne({
      userId: user._id,
      token:req.params.token
     })
     if(!resetToken) {
      res.status(StatusCodes.BAD_REQUEST).json({msg: "invalid link, timed out request a new link"})
     }
     if(password?.length < 6){
      res.status(StatusCodes.BAD_REQUEST).json({msg: "Password length must be greater than 6 characters."})
      }
     const matchedPrevPassword = await bcrypt.compare(password, user.password).then((status)=>{return status})
     if(matchedPrevPassword){
      return res.status(StatusCodes.BAD_REQUEST).json({msg: "Must be a new password"})
     }
     const saltRounds = await bcrypt.genSalt(10)
     const hashedPassword = await bcrypt.hash(password, saltRounds)
     await User.updateOne({_id:user._id}, {password: hashedPassword})
     await resetToken.remove()
     return  res.status(StatusCodes.OK).json({msg: "password reset complete"})
  } catch (error) {
   res.status(StatusCodes.BAD_REQUEST).json({msg: "There was an error"})
  }

}


const changePassword =  async (req, res) => {
   const { currentPassword, newPassword} = req.body
    
  try {
   const user = await User.findOne({_id: req.user.userId}).select('+password')
  

   const isMatchedPassword = await bcrypt.compare(currentPassword, user.password).then((status)=>{return status})
   if(!isMatchedPassword){
      return res.status(StatusCodes.BAD_REQUEST).json({msg: "inCorrect password entered"})
   }

   const newPassMatchOld = await bcrypt.compare(newPassword, user.password).then((status)=>{return status})
   if(newPassMatchOld){
     return  res.status(StatusCodes.BAD_REQUEST).json({msg: "new password must be different from old"})
   }
     const saltRounds = await bcrypt.genSalt(10)
     const hashedPassword = await bcrypt.hash(newPassword, saltRounds)
    user.password = hashedPassword
    await user.save()
     const mail = `<p>Password Change. <br>
     This email is to notify you of a password change to your linkpath account<br>
     </p>`
     const email = user.email
     await emailConfirmation(email, "Reset Password", mail)
      return res.status(StatusCodes.OK).json({msg:"Password change successful"})
  } catch (error) {
     res.status(StatusCodes.BAD_REQUEST).json({msg:"something went wrong"})
  }

   
   
}

module.exports = {
   register, 
   login, 
   updateUser, 
   verifyEmail, 
   sendPaswordResetLink, 
   resetPassword, 
   changePassword, 
   updateProfilePhoto}