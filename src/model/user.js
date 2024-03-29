const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "please provide a name"],
        minlength: 3,
        maxlength: 20,
        unique: true,
        trim: true

    }, displayName:{
        type: String,
        required: false,
        minlength: 3,
        maxlength: 20,

    },
    email:{
        type: String,
        required: [true, 'please provide an email'],
        validate: {
            validator: validator.isEmail,
            message: 'Please provide a valid email',
          },
        unique: true
    },
    password:{
        type: String,
        required: [true, "please provide password"],
        minlength: 6,
        select: false
        
    },
    bio:{
        type: String,
        default: ''
    }, 
    profileImg:{
        type:String,
        default:'',
        required: false
    },
    verified:{
        type: Boolean,
        default: false
    }
})


userSchema.pre('save', async function(){
   if(!this.isModified('password'))return 
   const salt = await bcrypt.genSalt(10)
   this.password =  bcrypt.hash(this.password, salt)

    
})

userSchema.methods.createJwt = function (){
   return (jwt.sign({userId:this._id, name:this.name}, process.env.JWT_SECRET_KEY, {expiresIn: process.env.JWT_TIME_ELAPSE}))
}
userSchema.methods.comparePassword = async function(userPass){
    const match = await bcrypt.compare(userPass, this.password)
    return match
}

module.exports = mongoose.model('User', userSchema)