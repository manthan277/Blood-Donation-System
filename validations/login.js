const Validator = require('validator');
const isEmpty = require('./is_empty');

module.exports = function validateloginUserInput(data){

    let errors = {};

    data.contact = !isEmpty(data.contact) ? data.contact : "";
    data.password = !isEmpty(data.password) ? data.password : "";

    if(Validator.isEmpty(data.contact)){
        errors.contact = 'Contact Number is required';
    }

    if(Validator.isEmpty(data.password)){
        errors.password = 'Password field is required';
    }

    return {
        errors,
        isValid : isEmpty(errors)
    }

}