/**
 * modles/users.js
 *
 * Define and validate a user object.
 *
 */

const mongoose = require('mongoose');
const Joi = require('joi');
const PasswordComplexity = require('joi-password-complexity');
const PhoneNumber = Joi.extend(require('joi-phone-number'));
const jwt = require('jsonwebtoken');
// const config = require('config');
// const logger = require('../middleware/logger');

// joi-password-complexity options
const passwordComplexityOptions = {
    min: 5,
    max: 255,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 4
}; //Password$1

// schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        label: 'Email',
        required: true,
        min: 5,
        max: 255,
        unique: true
    },
    password: {
        type: String,
        label: 'Password',
        required: true,
        min: 5,
        max: 1024
    },
    firstName: {
        type: String,
        label: 'First name',
        required: true,
        min: 2,
        max: 50
    },
    lastName: {
        type: String,
        label: 'Last name',
        required: true,
        min: 2,
        max: 50
    },
    telephone: {
        type: String,
        label: 'Telephone number',
        required: false,
        min: 10,
        max: 18
    },
    organizationName: {
        type: String,
        label: 'Organization Name',
        required: false,
        min: 2,
        max: 100
    },
    // userRole: {
    //     type: rolesSchema,
        // label: 'User Role',
    //     required: true
    // },
    dateAdded: {
        type: Date,
        label: 'Date Added',
        required: true,
        default: Date.now
    },
    dateUpdated: {
        type: Date,
        label: 'Date Updated',
        required: false
    }
});

// generate auth token
userSchema.methods.generateAuthToken = function() {

    // logger.info('generateAuthToken called');

    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, process.env.JWT_PRIVATE_KEY);
    return token;

}

// schema/model
const Users = mongoose.model('Users', userSchema);

// validation
function validateUsers(user) {

    const schema = {
        email: Joi.string().min(5).max(255).email().required(),
        password: new PasswordComplexity(passwordComplexityOptions).required(),
        firstName: Joi.string().min(2).max(50).required(),
        // lastName: Joi.string().min(2).max(50).required(),
        lastName: Joi.string().min(2).max(50).required().label('Last name')
            .error(errors => {
                // console.log(errors[0]);

                switch(errors[0].type) {

                    case 'string.min':
                        return { message: `${errors[0].context.label} requires at least ${errors[0].context.limit} characters.` };
                        break;

                    case 'string.max':
                        return { message: `${errors[0].context.label} may have a maximum of 50 characters.` };
                        break;

                    default: // catches required()
                        return { message: `${errors[0].context.label} is required.`}

                }
            }),
        telephone: PhoneNumber.string().min(10).max(18).phoneNumber(),
        organizationName: Joi.string().min(2).max(100),
        dateAdded: Joi.date(),
        dateUpdated: Joi.date()
    };

    return Joi.validate(user, schema);

}

exports.Users = Users;
exports.validate = validateUsers;
