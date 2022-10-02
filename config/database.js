const mongoose = require('mongoose')

const connectDb = (url)=>{
     try {
        mongoose.connect(url)
     } catch (error) {
        console.log(error)
     }
}
module.exports = connectDb