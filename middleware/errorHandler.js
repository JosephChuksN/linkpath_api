const {CustomApiErr} = require('../errors/errIndex')
const {StatusCodes} = require('http-status-codes')

const errorHandler = (err, req, res, next) =>{
    if(err instanceof CustomApiErr){
        return res.status(err.statusCode).json({msg: err.message})
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err})
}
 
module.exports = errorHandler