
const mongoose = require("mongoose");
const messageSchema =new mongoose.Schema({

    messageType: String,
    message: String,
    senderId: String,

    
},
{timestamps:true})
module.exports = mongoose.model("message", messageSchema);