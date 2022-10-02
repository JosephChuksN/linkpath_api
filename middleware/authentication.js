const User = require('../model/user')
const jwt  = require('jsonwebtoken')

const {UnauthorizeErr} = require('../errors/errIndex')


const auth = async (req, res, next) =>{
    //check headern\
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer')){
        throw new UnauthorizeErr('authorization invalid')
    }
    const token = authHeader.split(' ')[1]
    try {
        const payLoad = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = {userId:payLoad.userId, name:payLoad.name}
        next()
    } catch (error) {
        console.log(error)
    }
}

module.exports = auth