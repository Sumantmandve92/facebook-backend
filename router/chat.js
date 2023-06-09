
// const Channel = require("../modals/Channel");
// const Message = require("../models/Message");

const { json } = require("express");
const Channel = require("../modals/Channel");
const User = require("../modals/User");
const Message = require("../modals/Message");

const router = require("express").Router();

//     // all API are here




//     // API-4=>=========================================================================

router.post("/createChannel/:friendId", async (req, resp) => {
    try {
        const channel = await Channel.findOne({ "channelUsers._id": { $all: [req.params.friendId, req.body.userId] }, channelUsers: { $size: 2 } }).populate("messages");
        console.log(channel)
        if (channel) {
            // this channel has chatted already so existing channel
            resp.status(200).json(channel);
        }
        else {
            // create new channel
            console.log("creating new channel",req.params.friendId)
            // friendId can  bring  id or email of user
            const getFriend = await User.findOne({$or:[{ _id:req.params.friendId },{email:req.params.friendId}]});
            console.log(getFriend)
            const currentUser = await User.findById({ _id: req.body.userId }, { username: 1, profilePic: 1 });
            console.log(getFriend, currentUser)
            const newChannel = new Channel({
                channelUsers: [
                    {
                        _id: getFriend._id,
                        name: getFriend.username,
                        profilePic: getFriend.profilePic
                    },
                    {
                        _id: currentUser._id,
                        name: currentUser.username,
                        profilePic: currentUser.profilePic
                    }
                ]
            });
            console.log(newChannel);
            const savedChannel = await newChannel.save();
            resp.status(200).json(savedChannel);
        }
    } catch (error) {
        resp.status(500).json(error);
    }
})
//     // API-5=>=========================================================================


//     // API-6=>=========================================================================

router.post("/myChannelList", async (req, resp) => {
    try {
        const channels = await Channel.find({ "channelUsers._id": req.body.userId });
        resp.status(200).json(channels);
    } catch (error) {
        resp.status(500).json(error);
    }

})
//     // API-7=>=========================================================================

router.post("/sendMessage/:channelId", async (req, resp) => {

    try {

        const msg = new Message(req.body);
        const savedmsg = await msg.save();
        console.log(savedmsg)
        const channel = await Channel.findById({ _id: req.params.channelId });
        await channel.updateOne({ $push: { messages: savedmsg._id } })
        resp.status(200).json(savedmsg);

    } catch (error) {
        resp.status(500).json(error);
    }







})
//     // API-8=>=========================================================================
//     router.post("/saveContact", async (req, resp) => {
//         try {
//             const isUserExist = await User.findOne({ phoneNumber: req.body.phoneNumber });
//             if (isUserExist) {

//                 const user = await User.findByIdAndUpdate(
//                     { _id: req.body.userId },
//                     { $push: { myContacts: { phoneNumber: req.body.phoneNumber, name: req.body.contactName } } }
//                 )
//                 // this phone number is exist in db /registered phone number
//                 const updatedUser = await User.findById({ _id: req.body.userId });
//                 resp.send({ user: updatedUser, message: 1 });
//             }
//             else {
//                 // this phone number does not exist in db 
//                 resp.send({ message: 2 })
//             }
//         } catch (error) {
//             // error 
//             resp.send({ error, message: 3 })
//         }

//     })

//     // API-9=>=========================================================================
router.post("/getMessages", async (req, resp) => {
    try {
        const channel = await Channel.findById({ _id: req.body.channelId }).populate("messages");
        resp.status(200).json(channel);
    } catch (error) {
        resp.status(500).json(error);
    }

})





module.exports = router;