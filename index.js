const express = require("express");

const urlRoute  = require("./routes/url");
const { connectToMongoDB } = require("./connection");
const URL = require("./models/url");

const app = express();
const PORT = 8001;

connectToMongoDB('mongodb://127.0.0.1:27017/short-url')
.then(()=>{console.log('MongoDB connected!')});

app.use(express.json());//middleware to parse the incoming bodies

app.get("/:shortId",async(req,res)=>{
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
})
app.use("/url",urlRoute);
app.listen(PORT,()=> console.log(`Server started at PORT : ${PORT}`));