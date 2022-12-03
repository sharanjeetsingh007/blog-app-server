const express = require('express');
const app = express();
const cors = require('cors')
const mongoose = require("mongoose");
const db = require("./modals")
const cookieParser = require("cookie-parser");
require('dotenv').config();
app.use(cookieParser())



const PASSWORD = "123qweasdzxc"
const URL = `mongodb+srv://sharan:${PASSWORD}@cluster0.csjiyh6.mongodb.net/?retryWrites=true&w=majority`;

// Cors setup
app.use(cors({ credentials: true, origin: "http://localhost:3000" }))
// Using format json()
app.use(express.json());


// Routes
const defaultRoute = require('./routes/default')
app.use("/default", defaultRoute);
// Auth routes
const authRoute = require("./routes/auth");
app.use("/auth", authRoute);
// Posting blog to database
const blogPostRoute = require('./routes/blogPost')
app.use("/blogPost", blogPostRoute)
// Comments route
const commentsRoute = require("./routes/comments");
app.use("/comments", commentsRoute)



// Mongodb connnect
const connect = async () => {

    try {
        await mongoose.connect(URL);
        let db = mongoose.connection;

        db.on("error", (err) => {
            console.log(err, 'Err in db')
        })

        console.log("Connect to MongoDB");
    } catch (err) {
        console.error(err, 'errrrrrrrr');
    }


}


connect()


const PORT = 9000 || 6000;

app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`)
})