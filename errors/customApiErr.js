

class CustomApiErr extends Error {
    constructor(message){
        super(message)
        
    }
}

module.exports = CustomApiErr