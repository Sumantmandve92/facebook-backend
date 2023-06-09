const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../modals/User")
// API-update user============================================================================
router.put("/update/:id", async (req, resp) => {
    // id=>userId and admin can also update anyones account
    try {
        if (req.body.userId === req.params.id || req.body.isAdmin) {
            if (req.body.password) {
                try {
                    const salt = await bcrypt.genSalt(10);
                    req.body.password = await bcrypt.hash(req.body.password, salt);
                } catch (error) {
                    return resp.status(500).json(error);
                }
            }
            try {
                const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body });
                resp.status(200).json(user);
            } catch (error) {
                resp.status(500).json(error)

            }
        }
        else {
            return resp.status(403).json("you can update only your account")
        }
    } catch (error) {
        resp.status(500).json(error)
    }
})
// API-delete user============================================================================
router.delete("/:id", async (req, resp) => {
    // id=>userId and admin can also delete anyones account

    if (req.body.userId === req.params.id || req.body.isAdmin) {

        try {
            const user = await User.findByIdAndDelete({ _id: req.params.id });
            resp.status(200).json("account has been deleted");
        } catch (error) {
            resp.status(500).json(error)

        }
    }
    else {
        return resp.status(403).json("you can delete only your account")
    }

})
// API-get user============================================================================
router.get("/:id", async (req, resp) => {
    // here we have to send data of user according to who is sending request i.e. follower,random user,self,admin
    try {
        const user = await User.findOne({ _id: req.params.id });
        // secure user password
        const { password, updatedAt, ...other } = user._doc
        resp.status(200).json(other);
    } catch (error) {
        resp.status(500).json(error);
    }
})
// API-get searched friends==================================================================
router.get("/searchFriends/:friendName", async (req, resp) => {
    // here we have to send data of user according to who is sending request i.e. follower,random user,self,admin
    try {
        const friends = await User.find({ username: {$regex:`${req.params.friendName}`,$options:'i'} },{username:1});
        // secure user password
       
        resp.status(200).json(friends);
    } catch (error) {
        resp.status(500).json(error);
    }
})
// API-follow/unfollow user============================================================================
router.put("/:id/follow", async (req, resp) => {
    // id is the id of "user" which going to be followed by "current" user
    if (req.body.userId !== req.params.id) {

        try {
            // user=>my friend
            const user = await User.findById({ _id: req.params.id })
            // currentUser=>me
            const currentUser = await User.findById({ _id: req.body.userId })
            // check user has already followed by currentuser
            if (!currentUser.followings.includes(req.params.id)) {
                // if not followed then
                await user.updateOne({ $push: { followers: req.body.userId } })
                await currentUser.updateOne({ $push: { followings: req.params.id } })
                resp.status(200).json("user has been followed");
            }
            else {
                await user.updateOne({ $pull: { followers: req.body.userId } })
                  await currentUser.updateOne({ $pull: { followings: req.params.id } })
                resp.status(200).json("user has been unfollowed");
            }
        } catch (error) {
            resp.status(500).json(error);
        }
    }
    else {
        resp.status(403).json("you can not follow yourself");
    }
})
// API-get my following users============================================================================
router.get("/followingUsers/:userId", async (req, resp) => {
    // here we have to send data of user according to who is sending request i.e. follower,random user,self,admin
    try {
        const user = await User.findOne({ _id: req.params.userId });


        const followingUsers = await Promise.all(
            user.followings.map((followingUserId) => {
                return User.findById({ _id: followingUserId }, { username: 1, profilePic: 1 })
            })
        )
        resp.status(200).json(followingUsers);
    } catch (error) {
        resp.status(500).json(error);
    }
})
// API-get =================================================




module.exports = router;