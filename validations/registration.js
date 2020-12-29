const Validator = require('validator')
const isEmpty = require('./is_empty')

module.exports = function validateRegisterInput(data) {
        let errors = {};

        data.name = !isEmpty(data.name) ? data.name : ''
        data.contact = !isEmpty(data.contact) ? data.contact : ''
        data.blood_group = !isEmpty(data.blood_group) ? data.blood_group : ''
        data.password = !isEmpty(data.password) ? data.password : ''
    
        if(!Validator.isLength(data.name, {min : 2, max: 30})){
            errors.name = 'Name must be between 2 and 30 characters'
        }

        if(Validator.isEmpty(data.name)){
            errors.name = 'Name field is required'
        }

        // if(!Validator.isLength(data.contact, {min : 10, max: 10})){
        //     errors.name = 'Contact number must be of 10 digits'
        // }

        if(Validator.isEmpty(data.contact)){
            errors.contact = 'Contact field is required'
        }
        
        if(Validator.isEmpty(data.blood_group)){
            errors.blood_group = 'Blood Group is required'
        }

        if(Validator.isEmpty(data.password)){
            errors.password = 'Password field is required'
        }

        if(!Validator.isLength(data.password, {min : 6, max : 30})){
            errors.password = 'Password must be atleast 6 characters'
        }
        
        return {
            errors,
            isValid : isEmpty(errors)
        }
}