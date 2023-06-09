const User = require("../modals/User");
const bcrypt = require("bcrypt");
const Profile = require("../modals/Profile");
const router = require("express").Router();
// API-Register new User======================================================================
router.post("/registerUser", async (req, resp) => {


    try {

        const salt = await bcrypt.genSalt(10);
        const encryptedPass = await bcrypt.hash(req.body.password, salt);
        const newuser = new User({
            username: req.body.username,
            password: encryptedPass,
            email: req.body.email
        })


        const user = await newuser.save();
        // create new profile =====================================
        const profile = new Profile({ userId: user._id });
        await profile.save();
        // ========================================================
        resp.status(200).json(user);
    } catch (error) {
        resp.status(500).json(error);
    }

})

// API-Login user=============================================================================
router.post("/loginuser", async (req, resp) => {
    try {
        console.log(req.body);
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            // validate password
            const isvalidPassword = await bcrypt.compare(req.body.password, user.password);
            if (isvalidPassword) {
                resp.status(200).json(user);
            }
            else {
                resp.status(400).json("wrong password");

            }
        }
        else {
            resp.status(404).json("user not found");
        }

    } catch (error) {
        resp.status(500).json(error);
    }
})


module.exports = router;