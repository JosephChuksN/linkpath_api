const { StatusCodes } = require('http-status-codes')
const jwt  = require('jsonwebtoken')



const auth = async (req, res, next) =>{
    //check headern\
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith("Bearer")){
       res.status(StatusCodes.UNAUTHORIZED).json({msg: "authorization invalid"})
    }
    const token = authHeader.split(' ')[1]
    try {
        const payLoad = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = {userId:payLoad.userId}
        next()
    } catch (error) {
        console.log(error)
    }
}

module.exports = auth