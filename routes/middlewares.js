const jwt = require("jsonwebtoken");
require('dotenv').config()

function isUserLoggedIn(req, res, next) {
    const authorizedHeader = req.headers.authorization;

    if (!authorizedHeader) {
        res.status(401).send("no authorization header");
        return
    }
    const val = authorizedHeader.split(" ")

    const tokenType = val[0];
    const tokenValue = val[1];
    // console.log('val', val)
    if (tokenType === 'Bearer') {
        const decode = jwt.verify(tokenValue, process.env.secretKey)
        req.decode = decode;
        console.log('decode', req)
        next()
        return
    }
    res.status(403).send("Not authorized")
}

function adminOnly(req, res, next) {
    if(req.decode.role === 'admin') {
        next()
    }else {
        res.status(401).send("You are not an admin")
    }
 
}

module.exports = {isUserLoggedIn, adminOnly }