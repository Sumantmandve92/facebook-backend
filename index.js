const express=require("express");
const dotenv=require("dotenv");
const helmet  = require("helmet");
const morgan = require("morgan");
const cors=require("cors");
const mongoose  = require("mongoose");
const multer=require("multer");
const path=require("path");

dotenv.config()
const app=express();
// ========================middleware======================
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"))
app.use(express.json());
app.use(cors());
// ===========================DB connection=======================
mongoose.connect(process.env.MONGO_URL)
.then((res)=>{
    console.log("mongoDB connected");
})
.catch((error)=>{
    console.log(error);
})


// =========================APIs==========================
const userRoutes=require("./router/user");
const authRoutes=require("./router/auth")
const postRoutes=require("./router/post")
const profileRoutes=require("./router/profile")
const chatRoutes=require("./router/chat")

app.use("/api/users",userRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/post",postRoutes);
app.use("/api/profile",profileRoutes);
app.use("/api/chat",chatRoutes);
app.use("/images/",express.static(path.join(__dirname,"public/images")))

// ===============================To upload post with media=================================






app.listen(process.env.PORT,()=>{
    console.log("This app is running on port ",process.env.PORT)
})



