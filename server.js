const express = require("express");
const connectDB=require("./config/dbConnect")
const dotenv=require("dotenv").config()
const errorHandler = require("./middleware/errorHandler");
const app=express()
const port=process.env.PORT||5000;

connectDB()
// used to parse the data which server recieves from the client
// inbuilt middleware for parsing json objects
app.use(express.json())
app.use("/api/contacts",require("./routes/contactRoutes"));
app.use("/api/users",require("./routes/userRoutes"));
app.use(errorHandler)

app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
})