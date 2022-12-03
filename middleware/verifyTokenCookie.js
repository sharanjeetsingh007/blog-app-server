const jwt = require("jsonwebtoken");

const verifyTokenCookie = (req, res, next) => {
    const token = req.cookies.accessToken;

    // console.log(req, 'token form cookie server')

    try {
        const user = jwt.verify(token, process.env.JWT__SECRET);

        req.user = user;

        console.log(user, 'user in middleware')
        next();

    }
    catch (err) {
        // res.clearCookie("accessToken");
        console.log(err, 'err ')
        res.status(400).json({ error: "User not authorised" })
    }
}

module.exports = verifyTokenCookie;