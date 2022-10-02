const {StatusCodes} = require('http-status-codes')
const CustomApiErr = require('./customApiErr')



class BadRequestErr extends CustomApiErr {
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.BAD_REQUEST
    }
}

module.exports = BadRequestErr