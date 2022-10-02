const { StatusCodes }  = require('http-status-codes')
const CustomApiErr = require('./customApiErr')

class UnauthorizeErr extends CustomApiErr {
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.UNAUTHORIZED
    }
}

module.exports = UnauthorizeErr