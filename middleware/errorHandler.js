const {StatusCodes} = require('http-status-codes')

const errorHandler = (err, req, res, next) =>{
    const defaultErr = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'something went wrong, try again later'
    }
    if(err.name === "ValidationError"){
        defaultErr.statusCode = StatusCodes.BAD_REQUEST
        defaultErr.msg = Object.value(err.errors).map(item => item.message.join(','))
        
    }
    if(err.code && err.statusCode === 11000){
        defaultErr.statusCode = StatusCodes.BAD_REQUEST
        defaultErr.msg = `${Object.keys(err.keyValue)} fields should be unique`
    }
    res.status(defaultErr.statusCode).json({msg: defaultErr.msg})
}
 
module.exports = errorHandler