const express = require('express');
const route = express.Router();
const { taskCollection } = require('../schema/taskSchema');
const jwt = require("jsonwebtoken");
const { isUserLoggedIn, adminOnly } = require('./middlewares')
require('dotenv').config()




route.use(isUserLoggedIn)

// get all tasks
route.get('/', async (req, res) => {
    const task = await taskCollection.find({ user: req.decode.userId })
    res.json(task)
})

//create a new task
route.post('/', async (req, res) => {
    try {
        const newTask = await taskCollection.create({
            taskTitle: req.body.taskTitle,
            taskBody: req.body.taskBody,
            user: req.decode.userId
        })
        console.log('newTask', newTask)
        res.json({
            isRequestSuccesful: true,
            newTask
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
    const task = await taskCollection.findOne({ taskTitle: req.params.title });
    if (!task) {
        return res.status(404).send('Task not found')
    }
    res.send(task)
});

//update a task
route.patch('/:id', async (req, res) => {
    const updatedTask = await taskCollection.findByIdAndUpdate(req.params.id, { taskBody: req.body.taskBody }, { new: true });
    res.json({
        message:  'Task updated successfully',
        updatedTask
    })
})

//delete a task
route.delete('/:id', async (req, res) => {
    const note = await taskCollection.findById(req.params.id);
    if(req.decode.userId !== note.user){
        res.status(401 ).send('You are not allowed to delete this note')
        return 
    }
    await taskCollection.findByIdAndDelete(req.params.id);

    res.send('Deleted successfuly')
})




// get all tasks
route.get('/admin/task', adminOnly, async (req, res) => {
    const task = await taskCollection.find()
    res.json(task)
})

module.exports.isUserLoggedIn = isUserLoggedIn
module.exports = route;