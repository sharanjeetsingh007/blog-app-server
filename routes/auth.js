const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Users = require("../modals/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyTokenCookie = require('../middleware/verifyTokenCookie');



router.post("/register", async (req, res) => {
    try {
        const hasPassword = await bcrypt.hash(req.body.password, 10);
        // console.log(hasPassword, 'hasPassword')

        const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const validEmail = regexEmail.test(req.body.email)

        console.log(validEmail, 'validEmail')

        if (!validEmail) {
            return res.status(400).json({ "error": "Please use a valid email style" })
        }

        const user = new Users({
            username: req.body.username,
            email: req.body.email,
            password: hasPassword,
        })
        const savedUser = await user.save()
        res.json({ "message": "User Registered" })

    } catch (err) {
        const error = err.message.split(" ");
        const duplicateError = error[0]
        // console.log(duplicateError)
        if (duplicateError == "E11000") {
            res.status(400).json({ "error": "Email already exist" })
        } else {
            res.status(400).json({ "error": err.message })
        }

    }

})


router.post("/login", async (req, res) => {
    const { password, email } = req.body;

    const user = await Users.findOne({ email: email })
    // console.log(user, 'user')

    if (!user) {
        return res.status(409).json({ error: "User does'nt Exist" })
    }

    bcrypt.compare(password, user.password)
        .then((match) => {


            if (!match) {
                return res.status(401).json({ error: "Password/Username does'nt match" })
            }

            //  Create and sign token
            const token = jwt.sign({ _id: user._id, email: user.email, username: user.username }, process.env.JWT__SECRET);
            // const refreshToken = jwt.sign(user, process.env.REFRESHTOKEN__SECRET, { expiresIn: 86400 })



            return res.cookie("accessToken", token, {
                httpOnly: true,
                sameSite: false,
                secure: true,
            }).status(200).json({ message: "LoggedIn" })


            // return res.header("auth-token", token).status(200).json({ message: "LoggedIn" })
            // console.log(process.env.JWT__SECRET, "jwt")


            // return res.status(200).json({ message: "LoggedIn" })
        })
})


router.get('/redirecthome', verifyTokenCookie, (req, res) => {
    console.log(req.user, 'req redirecthome')
    res.status(200).json({ message: "Success", data: req.user })
    // req
})


router.get('/logout', verifyTokenCookie, (req, res) => {
    // console.log(req.user, 'req delete logout cookie')
    res.status(202).clearCookie('accessToken').json({ message: "Logout Successfully" })
})

module.exports = router;