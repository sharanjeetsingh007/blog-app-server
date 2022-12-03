const express = require('express');
const verifyTokenCookie = require("../middleware/verifyTokenCookie");
const router = express.Router();
const mongoose = require('mongoose');
const Posts = require("../modals/Posts");
const Comments = require("../modals/Comments")
// const { db } = require('../modals/Posts');
const { db } = require('../modals/Comments');
const ObjectId = require('mongodb').ObjectId;



router.get("/:id", async (req, res) => {
    const id = req.params.id;
    console.log(id, "this is id send comment ")
    const commentCollection = db.collection("comments");


    try {
        const allComments = commentCollection.find({ "postId": id }).toArray((err, result) => {
            if (err) {
                res.status(400).json({ "error": err })
            } else {
                res.status(200).json({ "message": "Success comments data", data: result })
            }
        });
    }
    catch (err) {
        res.status(400).json({ error: err })
    }
})

router.post("/postComment", verifyTokenCookie, async (req, res) => {
    const { profilePic, body, postId } = req.body
    const { email, _id, username } = req.user;
    // console.log(email, _id, username, 'this is req')

    console.log(postId, "postId")
    try {

        const comment = new Comments({
            CommnetUserUsername: username,
            commentUserProfilePic: profilePic,
            commentUserEmail: email,
            body: body,
            postId: postId,
        })

        const commentSaved = await comment.save();
        res.status(200).json({ message: "Success psoting comment in db", data: commentSaved })

    }
    catch (err) {
        res.status(400).json({ error: err })
    }
})


// updating the comments per id
router.put("/updateCurrentCommment/:id", verifyTokenCookie, async (req, res) => {
    const id = req.params.id;
    console.log(id, 'id in update comment')

    const user = req.user;
    const { CommentUserEmail, body } = req.body;

    console.log(body, "what is the body")



    console.log(user, 'user')
    console.log(CommentUserEmail, 'commentUsereMIAL')




    if (user.email == CommentUserEmail) {
        const commentCollection = db.collection("comments");


        const data = {
            body: body,
        }



        commentCollection.findOneAndUpdate({ "_id": new ObjectId(id) }, { $set: data }, { new: true }, (err, result) => {

            if (err) {
                return res.json({ error: err })
            }
            return res.json({ message: "Succesfully update data", data: data, result: result })

        })




        // res.status(200).json({ message: "user is same" })
    } else {
        res.status(400).json({ error: "user is not asame as the login user" })
    }

    // console.log(req.body.title, 'comments id')

    // res.json({ message: "reacthed" })


    // const data = {
    //     title: title,
    //     category: category,
    //     body: body,
    //     backgroundImage: backgroundImage,
    // }

    // const blogCollection = db.collection("comments");

    // blogCollection.findOneAndUpdate({ "_id": new ObjectId(id) }, { $set: data }, { new: true }, (err, result) => {

    //     if (err) {
    //         return res.json({ error: err })
    //     }
    //     return res.json({ message: "Succesfully update data", data: data })

    // })



})

module.exports = router;