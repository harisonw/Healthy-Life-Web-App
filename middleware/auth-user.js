const jwt = require("jsonwebtoken");

const JWT_SECRET = "gb32hj4rgyT^%^%R^ygahjgdfajsh7*^&*^&*T'#'@~@ddfeqgwrlkjnwefr";

const auth = (req, res, next) => {
    try {

        const token = req.headers.authorization.split(" ")[1];
        if (!token) return res.status(401).json({ msg: "No authentication token, authorization denied." });
    
        const verified = jwt.verify(token, JWT_SECRET);
        if (!verified) return res.status(401).json({ msg: "Token verification failed, authorization denied." });
    
        req.user = verified.id;
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = auth;