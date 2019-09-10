'use strict';

// User model goes here

const mongoose = require('mongoose');
const schema = new mongoose.Schema ({
    username: {
        type:String,
        required: true,
        trim:true,//is going to delete all the spaces between the characters
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('use', schema);// i have to call the schema