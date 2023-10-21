const express = require('express');
const route = express.Router();
const { taskCollection } = require('../schema/shopItemsSchema');
const jwt = require("jsonwebtoken");
const { isUserLoggedIn, adminOnly } = require('./middlewares')
require('dotenv').config()




route.use(isUserLoggedIn)

// get all tasks
route.get('/', async (req, res) => {
    // get all task
    const task = await taskCollection.find()
    res.json(task)

    //// get task for only users
    // const task = await taskCollection.find({ user: req.decode.userId })
    // res.json(task)
})

//create a new task
route.post('/', adminOnly, async (req, res) => {
    try {
        const newItem = await taskCollection.create({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            isInStock: req.body.isInStock,
            user: req.decode.userId
        })
        res.json({
            isRequestSuccesful: true,
            newItem
        })
    } catch (err) {
        console.log('ftrtyrtyt', err)
        res.status(500).json({
            isRequestSuccessful: false,
            error: "An error occurred while creating a new task."
        });
    }
})

// get a single task by id
route.get('/:id', async (req, res) => {
    const task = await taskCollection.findById(req.params.id);
    res.send(task)
});

//get task by title
route.get('/get-task-by-name/:title', async (req, res) => {
    const items = await taskCollection.findOne({ name: req.params.name });
    if (!items) {
        return res.status(404).send('Task not found')
    }
    res.send(items)
});

//update a task
route.patch('/:id', adminOnly, async (req, res) => {
    const updatedTask = await taskCollection.findByIdAndUpdate(req.params.id, { description: req.body.description }, { new: true });
    res.json({
        message: 'Task updated successfully',
        updatedTask
    })
})

//delete a task
route.delete('/:id', adminOnly, async (req, res) => {
    const note = await taskCollection.findById(req.params.id);
    if (req.decode.userId !== note.user) {
        res.status(401).send('action-not-allowed”')
        return
    }
    await taskCollection.findByIdAndDelete(req.params.id);

    res.send('Deleted successfuly')
})


// get all tasks
route.get('/admin/item', adminOnly, async (req, res) => {
    const task = await taskCollection.find()
    res.json(task)
})

module.exports.isUserLoggedIn = isUserLoggedIn
module.exports = route;