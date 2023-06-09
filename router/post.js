const multer = require("multer");
const Post = require("../modals/Post");
const User = require("../modals/User");

const router = require("express").Router();

// API-create post================================================================
router.post("/uploadPost", async (req, resp) => {
    const newpost = new Post(req.body);
    try {
        const savedPost = await newpost.save();
        resp.status(200).json(savedPost);
    } catch (error) {
        resp.status(500).json(error);
    }
})
// API-update post================================================================
router.put("/:id", async (req, resp) => {
    // id is post id
    try {
        const post = await Post.findById({ _id: req.params.id })
        if (post.userId === req.body.userId) {
           const updatedPost= await post.updateOne({ $set: req.body })
            resp.status(200).json(updatedPost)
        }
        else {
            resp.status(403).json("You can only update only your post")
        }
    } catch (error) {
        resp.status(500).json(error);
    }

})
// API-delete post================================================================
router.post("/deletePost/:id", async(req, resp) => {
    try {
        const post = await Post.findById({ _id: req.params.id })
        console.log(req.body,post.userId)
        if (post.userId === req.body.userId) {
            await Post.findOneAndDelete({_id:req.params.id});
            resp.status(200).json("post has been deleted");
        }
        else {
            resp.status(403).json("You can delete only your post")
        }
    } catch (error) {
        console.log(error)
        resp.status(500).json(error);
    }
})
// API-like/unlike post================================================================
router.put("/:id/like", async(req, resp) => {
try {
    const post =await Post.findById({_id:req.params.id});
    if(post.likes.includes(req.body.userId)){
       const newlikes= post.likes.filter(like=>like!==req.body.userId)
       post.likes=newlikes;
        await post.save();
        resp.status(200).json(-1)
    }
    else{
        post.likes=[...post.likes,req.body.userId];
        await post.save();
        resp.status(200).json(1)
    }
} catch (error) {
    resp.status(500).json(error);
}
})
// API get a post================================================================
router.get("/:id", async(req, resp) => {
    try {
        const post =await Post.findById({_id:req.params.id});
        resp.status(200).json(post);
    } catch (error) {
        resp.status(500).json(error);
    }

})
// API get timeline posts================================================================
router.post("/", async (req, resp) => {
    try {
        
    
        const currentUser=await User.findById({_id:req.body.userId});
        const myposts=await Post.find({userId:req.body.userId});
        const friendsPosts=await Promise.all(
            currentUser.followings.map((friendId)=>{
return  Post.find({userId:friendId});
            })
        )
        resp.status(200).json(myposts.concat(...friendsPosts));
    } catch (error) {
        resp.status(500).json(error)
    }

})
// API get specific user posts ================================================================
router.post("/getMyPosts", async (req, resp) => {
    try {
        
    
        const currentUser=await User.findById({_id:req.body.userId});
        const myposts=await Post.find({userId:req.body.userId});
       
        resp.status(200).json(myposts);
    } catch (error) {
        resp.status(500).json(error)
    }

})


const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"public/images")
    },
    filename:(req,file,cb)=>{
        cb(null,req.body.name)
    },
});
const upload=multer({storage});
// 
router.post("/saveFile",upload.single("file"),(req,resp)=>{
    try {
     
        resp.status(200).json("post uploded successfully1");
    } catch (error) {
      
       return resp.status(500).json(error);
    }
})


module.exports = router;