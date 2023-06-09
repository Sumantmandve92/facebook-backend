const { json } = require("express");
const Profile = require("../modals/Profile");
const User = require("../modals/User");

const router = require("express").Router();

router.post("/:friendId", async (req, resp) => {
    // if friendId is same /different
    // if same send profile directly to user
    // if different then check this friend account is private or not ,if private do not send personal data
    const user = await User.findById({ _id: req.params.friendId });
    try {

        let profile = await Profile.findOne({ userId: req.params.friendId });
        const { _id, email, password, followers, isAdmin, ...other } = user._doc;


        const {...profileContent} = profile._doc;
        // profile.username = user.username;
        // profile.profilePic = user.profilePic;
        // profile.coverPic = user.coverPic;
        // profile.followings = user.followings;
        // profile.desc = user.desc;
        // profile.accountType = user.accountType;
        profile = { ...profile._doc, ...other };
        if (req.params.friendId === req.body.userId) {

            resp.status(200).json({ profile, permissionKey: 1 });
            // permissionKey:1 means self acc
        }
        else {
            console.log(user);
            if (user.accountType === "public") {

                resp.status(200).json({ profile, permissionKey: 2 });
                // permissionKey:1 means friend public  acc
            }
            else {
                resp.status(200).json({ profile: null, permissionKey: 3 })
                // permissionKey:1 means friend private  acc
            }

        }
    } catch (error) {
        console.log(error);
        resp.status(200).json({ error, permissionKey: 4 });
    }

})

module.exports = router;