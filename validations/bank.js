const Validator = require('validator');
const isEmpty = require('./is_empty');

module.exports = function validatebankInput(data){

    let errors = {};

    data.bank_name = !isEmpty(data.bank_name) ? data.bank_name : "";
    data.amount = !isEmpty(data.amount) ? data.amount : "";

    if(Validator.isEmpty(data.bank_name)){
        errors.name = 'Bank Name is required';
    }

    if(Validator.isEmpty(data.amount)){
        errors.amount = 'Amount is required';
    }

    return {
        errors,
        isValid : isEmpty(errors)
    }

}