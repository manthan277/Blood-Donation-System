const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');
mongoose.set('useFindAndModify', false);

const donateSchema = new Schema({
    donar: {
        type: Schema.Types.ObjectId,
        ref: User
    },
    donar_name: {
        type: String
    },
    bank_name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: 0
    },
    blood_group: {
        type: String
    },
    donation_date: {
        type: Date,
        default: Date("<YYYY-mm-dd>")
    }
});

const Donate = mongoose.model('donate', donateSchema);

module.exports = Donate;