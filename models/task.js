const mongoose = require('mongoose');

let taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    
    done: {
        type: Boolean,
        default: false
    },

    listid: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lists'
    }]
});

module.exports = mongoose.model('Tasks', taskSchema);
