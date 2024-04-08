const jwt = require("jsonwebtoken");
const config = require("config");
const { User, validateUser } = require('../models/users')

//Middleware Function
function auth(req, res, next) {
  try {
    console.log(req.headers)
    const jpToken = req.headers['x-auth-token']
    // const token = req.header("x-auth-token"); //Loads token from the header
    if (!jpToken) {
      return res.status(401).send("Access Denied! No token provided");
    }
    
    console.log("Token:", jpToken);
    
    const decoded = jwt.verify(jpToken, "psmR3Hu0ihHKfqZymolm"); //Decodes the token
    console.log("decoded Token:", decoded)
    
    //line 14 config.get("node_crud_private_key")
    
    req.user = decoded; //Loads the decoded token into req.user so that it can be used by
    console.log(req.user)
    // the next bit of middleware or the controller
    // res.render('index', {
    //   token: token, title: "Login User", users: User})
    next(); //Calls next bit of middleware
  } catch (error) {
    console.log("authentication Error:", error)
    res.status(400).send("Invalid token.");
  }
}
module.exports = auth;

//authorisation bearer token