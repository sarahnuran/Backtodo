const mongoose = require('mongoose');

let listSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    userid:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

module.exports = mongoose.model('Lists', listSchema);
