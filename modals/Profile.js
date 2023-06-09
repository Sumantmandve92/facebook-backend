const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    userId:{
        type:String,
        require:true
    },
    city: {
        type: String,
        max: 50,
    },
    from: {
        type: String,
        max: 50,
    },
    relationships: {
        type: String,
        enum: [1, 2, 3]
    },
    dateOfBirth: {
        type: Date,

    },
    followersRequests: {
        type: Array,
        default: []

    },
    education: {
        type: String
    },
    profession: {
        type: String,
        max: 50
    }
},
    { timestamps: true }

);


module.exports = mongoose.model("profile", profileSchema);