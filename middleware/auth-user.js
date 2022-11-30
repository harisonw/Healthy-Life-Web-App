const jwt = require("jsonwebtoken");

const JWT_SECRET =
  "gb32hj4rgyT^%^%R^ygahjgdfajsh7*^&*^&*T'#'@~@ddfeqgwrlkjnwefr";

const auth = (req, res, next) => {
  try {
    console.log("auth.js: auth() called");
    const token = req.cookies.token;
    const verified = jwt.verify(token, JWT_SECRET);
    console.log("verified: ", verified);
    req.user = verified;
    next();
  } catch (err) {
    //res.status(401).json({ error: "Not authorized" });
    return res.redirect("/login.html?error=NotAuthorized");
    //return res.status(301).location('/login.html?error=NotAuthorized').end();
  }
};

module.exports = { auth };
