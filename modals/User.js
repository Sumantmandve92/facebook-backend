const mongoose = require("mongoose");
const Profile = require("./Profile");

const userSchema=new mongoose.Schema({
username:{
    type:String,
    require:true,
    min:3,
    max:20,
    unique:true
},
email:{
    type:String,
    require:true,
    max:50,
    unique:true
},
password:{
     type:String,
    require:true,
    min:6
   
},
profilePic:{
    type:String,
    default:""
},
coverPic:{
    type:String,
    default:""
},
followers:{
    type:Array,
    default:[]
},
followings:{
    type:Array,
    default:[]
},
isAdmin:{
    type:Boolean,
    default:false
},
desc:{
    type:String,
    max:50,
},
accountType:{
    type:String,
default:"public"
},






// 1 for public and 0 for private
// if acount type is "private" then user has to permit followers request which are present in "followersRequest" container
// if it is "public" then other can directly follow him in "followers"
},
{timestamps:true}
)
module.exports=mongoose.model("user",userSchema);