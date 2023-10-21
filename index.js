const express = require('express');
const port = process.env.PORT || 4000;
const app = express();
const mongoose = require('mongoose'); 

require('dotenv').config()



const taskRoute = require('./routes/shopItems');
const authRoute = require('./routes/auth');

const connect = mongoose.connect(process.env.mongoDBURL)

connect.then(() => {
   console.log('Connected Sucessfully to mongo db')
}).catch((err) => {
   console.error('Could not connect to the database, reason', err)
})

app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: false })); //

app.use("/item", taskRoute); 
app.use("/auth", authRoute);


app.listen(port, () => {
   console.log(' listening on port', port)
})