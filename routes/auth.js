const express = require("express");
const router = express.Router();
const { userCollection } = require("../schema/userSchema")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken"); 
const {isUserLoggedIn} = require('./middlewares')


require('dotenv').config()


router.post('/register', async (req, res) => {
    const salt = bcrypt.genSaltSync(10);

    const hashPassword = bcrypt.hashSync(req.body.password, salt);
    await userCollection.create({
        fullName: req.body.fullName,
        username: req.body.username,
        password: hashPassword,
        role: req.body.role

    })
    res.status(201).send('Successfully registered')
})


router.post('/login', async (req, res) => {
    const userDetails = await userCollection.findOne({ username: req.body.username })

    if (!userDetails) return res.status(404).send('Not found')

    const checkPasswordMatch = bcrypt.compareSync(req.body.password, userDetails.password);

    if (!checkPasswordMatch) return res.status(400).send('invalid credentials')
    const token = jwt.sign({
        username: userDetails,
        userId: userDetails._id,
        role: userDetails.role
    }, process.env.secretKey)

    res.send({ message: 'Sign in successfully', token })
})

router.get('/profile', isUserLoggedIn, async (req, res) => {
    try{
        const user = await userCollection.findById(req.decode.userId, '-password');
        res.send(user)
    }catch(err) {
        console.log(err)
        res.status  (500). send ("internal-server-error");
    }
})


module.exports = router;