const jwt = require("jsonwebtoken");

const JWT_SECRET = "gb32hj4rgyT^%^%R^ygahjgdfajsh7*^&*^&*T'#'@~@ddfeqgwrlkjnwefr";

const auth = (req, res, next) => {
    try {
        console.log("auth.js: auth() called");
        const token = req.cookies.token;
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({ error: "Not authorized" });
        //return res.redirect("/login.html");
    }
};

module.exports = { auth };