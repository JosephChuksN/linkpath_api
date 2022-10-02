const mongoose = require('mongoose')

const LinksSchema = new mongoose.Schema({
    siteLink:{
        type: String,
        required:[true, 'provide link']
    },
    siteName:{
        type: String,
        required:[true, 'provide name']
    },
    createdBy:{
        type: mongoose.Types.ObjectId
    },
}, {timestamps: true})

module.exports = mongoose.model("Links", LinksSchema)