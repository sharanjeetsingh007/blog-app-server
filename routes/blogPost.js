const express = require('express');
const verifyTokenCookie = require('../middleware/verifyTokenCookie');
const router = express.Router()
const mongoose = require('mongoose');
const Posts = require("../modals/Posts");
const Comments = require("../modals/Comments")
const { db } = require('../modals/Posts');
const ObjectId = require('mongodb').ObjectId;



// getting all the blogs
router.get('/', (req, res) => {
    const postCollection = db.collection("posts")
    // console.log(postCollection, 'postCollectio')
    postCollection.find({}).toArray((err, result) => {
        if (err) {
            res.status(400).json({ "error": err })
        } else {
            res.status(200).json({ "message": "Success fetching data", "Result": result })
        }
    })
})

// Posting blog to database
router.post('/blogtopost', verifyTokenCookie, async (req, res) => {
    const { title, category, backgroundImage, body, email } = req.body;
    const { username } = req.user;
    // console.log(email, title, "post")
    try {
        const post = new Posts({
            title: title,
            category: category,
            backgroundImage: backgroundImage,
            body: body,
            email: email,
            username: username,
        })
        await post.save()
        res.status(200).json({ "message": "Post Submitted" })
    }
    catch (err) {
        res.status(400).json({ "error": err })
    }
})


// Getting blog per id
router.get("/currentBlog/:id", async (req, res) => {
    const id = req.params.id;
    // console.log(id, 'id')
    try {
        const postCollection = db.collection("posts")
        const currentBlogIs = await postCollection.findOne({ "_id": new ObjectId(id) })
        res.status(200).json({ message: "Success finding blog", data: currentBlogIs })
    }
    catch (err) {
        res.status(404).json({ error: err })
    }
})

// updating the blog per id
router.put("/updateCurrentBlog/:id", verifyTokenCookie, async (req, res) => {
    const id = req.params.id;
    console.log(req.user, "user in update request")





    // console.log(req.body.title, 'req.body')
    const { title, category, body, backgroundImage, emailUserCurrentBlog } = req.body;

    console.log(emailUserCurrentBlog, 'emailUserCurrentBlog')
    const data = {
        title: title,
        category: category,
        body: body,
        backgroundImage: backgroundImage,
    }

    if (req.user.email == emailUserCurrentBlog) {

        const blogCollection = db.collection("posts");
        blogCollection.findOneAndUpdate({ "_id": new ObjectId(id) }, { $set: data }, { new: true }, (err, result) => {

            if (err) {
                return res.json({ error: err })
            }
            return res.json({ message: "Succesfully update data", data: data })
        })

    } else {
        res.status(400).json({ error: "User is not allowed to edit for other users" })
    }





})





// Deleteing the blog by id
router.delete("/delete/:id", verifyTokenCookie, async (req, res) => {
    const id = req.params.id;
    const user = req.user;
    const { userEmailBlog } = req.body;

    // console.log(user, 'user in delete')
    // console.log(userEmailBlog, 'userEmailBlog in delete')
    // console.log(req, 'req.body in delete')


    // res.json({ message: 'reached' })

    if (user.email == userEmailBlog) {


        const blogCollection = db.collection("posts");
        const commentsCollection = db.collection("comments");

        try {
            const deleted = await blogCollection.findOneAndDelete({ "_id": new ObjectId(id) })
            const commentsDelete = commentsCollection.deleteMany({ "postId": id })
            res.json({ message: "Delete successfully" })

        } catch (err) {
            console.log(err, 'err deleting data')
            res.status(400).json({ error: err })

        }

    } else {
        res.status(401).json({ error: "User is not allowed to do for other users" })
    }

})

module.exports = router;