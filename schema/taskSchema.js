const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    taskTitle: {
        type: String,
        required: true
    },
    taskBody: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
}, {timestamps: true});

const taskCollection = mongoose.model("task_4", taskSchema); 

module.exports = {
    taskCollection 
}