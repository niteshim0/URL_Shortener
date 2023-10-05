const express = require("express");
const path = require("path");
const urlRoute  = require("./routes/url");
const { connectToMongoDB } = require("./connection");
const staticRouter = require("./routes/staticRouter");
const URL = require("./models/url");

const app = express();
const PORT = 8001;

connectToMongoDB('mongodb://127.0.0.1:27017/short-url')
.then(()=>{console.log('MongoDB connected!')});

app.use(express.json());
app.use(express.urlencoded({extended:false}));//middleware to parse the incoming bodies
app.set("view engine","ejs");//middleware for setting the view engine 
app.set("views",path.resolve("./views"))//path of views
app.use("/",staticRouter);
app.use("/url",urlRoute);
app.get("/url/:shortId",async(req,res)=>{
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
    shortId
    },
    {
    $push:{
      visitHistory:{
        timestamp : Date.now(),
      }
    },
    }
  );
  return res.redirect(entry.redirectURL);
});

app.listen(PORT,()=> console.log(`Server started at PORT : ${PORT}`));