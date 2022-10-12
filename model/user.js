const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "please provide a name"],
        minlength: 3,
        maxlength: 50,
        trim: true

    },
    email:{
        type: String,
        required: [true, 'please provide an email'],
        match:[/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, "please provide a valid email"],
        unique: true
    },
    password:{
        type: String,
        required: [true, "please provide password"],
        minlength: 6
        
    }
})


userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)

    next()
})

userSchema.methods.createJwt = function (){
   return (jwt.sign({userId:this._id, name:this.name}, process.env.JWT_SECRET_KEY, {expiresIn: process.env.JWT_TIME_ELAPSE}))
}
userSchema.methods.comparePassword = async function(userPass){
    const match = await bcrypt.compare(userPass, this.password)
    return match
}

module.exports = mongoose.model('User', userSchema)