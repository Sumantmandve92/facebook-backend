
const mongoose=require("mongoose");
const Message = require("./Message");
const channelSchema=new mongoose.Schema({

    channelUsers:[
        {
            _id:{type:String,default:''},
            name:{type:String,default:''},
            profilePic:{type:String,default:''}
        }
    ],
    messages:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:Message
        }
    ],
    
},
{timestamps:true})
module.exports=mongoose.model("channel",channelSchema)