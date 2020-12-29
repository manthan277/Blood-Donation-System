const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('useFindAndModify', false);

const bankSchema = new Schema({
    name :{
        type: String,
        required: true,
        unique: true
    },
    AP: {
        type: Number,
        default: 0
    },
    AN: {
        type: Number,
        default: 0
    },
    BP: {
        type: Number,
        default: 0
    },
    BN: {
        type: Number,
        default: 0
    },
    ABP: {
        type: Number,
        default: 0
    },
    ABN: {
        type: Number,
        default: 0
    },
    OP: {
        type: Number,
        default: 0
    },
    ON: {
        type: Number,
        default: 0
    },
    contact :{
        type: Number,
        required: true
    },
    email :{
        type: String
    },
    address :{
        type: String
    }
});

const Bank = mongoose.model('bank', bankSchema);

module.exports = Bank;