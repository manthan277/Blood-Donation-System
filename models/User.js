const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name :{
        type: String,
        required: true
    },
    contact :{
        type: Number,
        required: true
    },
    blood_group : {
        type : String,
        enum : ['A+', 'A-','B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        required : [ true, 'Please enter a valid blood group ']
    },
    password :{
        type: String,
        required: true
    }
});

const User = mongoose.model('user', userSchema);

module.exports = User;