const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    name: {
        type: 'string',
        required: 'You need to specifie a name'
    },
    email: {
        type: 'string',
        required: 'You need to specifie a email',
        unique: true
    },
    password: {
        type: 'string',
        required: 'You need to specifie a password'
    },
    listid: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lists'
    }]
});

module.exports = mongoose.model('User', userSchema);
