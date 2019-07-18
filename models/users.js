/**
 * modles/users.js
 *
 * Define and validate a user object.
 *
 */

const mongoose = require('mongoose');
const Joi = require('joi');
const PasswordComplexity = require('joi-password-complexity');
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
}; // Password$1

// schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        min: 5,
        max: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 5,
        max: 1024
    },
    firstName: {
        type: String,
        required: true,
        min: 2,
        max: 50
    },
    lastName: {
        type: String,
        required: true,
        min: 2,
        max: 50
    },
    telephone: {
        type: String,
        required: false,
        min: 10,
        max: 18
    },
    organizationName: {
        type: String,
        required: false,
        min: 2,
        max: 100
    },
    // userRole: {
    //     type: rolesSchema,
    //     required: true
    // },
    dateAdded: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateUpdated: {
        type: Date,
        required: false
    }
});

// generate auth token
userSchema.methods.generateAuthToken = function() {

    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, process.env.JWT_PRIVATE_KEY);
    return token;

}

// schema/model
const Users = mongoose.model('Users', userSchema);

// validation
function validateUsers(user) {

  const schema = {

    email: Joi.string().trim().min(5).max(255).email({ minDomainAtoms: 2 }).required().label('Email')
      .error(errors => {
        switch(errors[0].type) {
          case 'string.min':
            return { message: `${errors[0].context.label} requires at least ${errors[0].context.limit} characters.` };
            break;
          case 'string.max':
            return { message: `${errors[0].context.label} may have a maximum of 50 characters.` };
            break;
          case 'string.email':
            return { message: 'Please enter a valid email address.' };
          default: // catches required()
            return { message: `${errors[0].context.label} is required.`}
        }
      }),

    password: new PasswordComplexity(passwordComplexityOptions).required().label('Password')
      .error(errors => {
        switch(errors[0].type) {
          case 'passwordComplexity.base':
            return { message: `The ${errors[0].context.label} requires at least one uppercase, lowercase, number and symbol.` };
            break;          default: // catches required()
            return { message: `${errors[0].context.label} is required.`}
        }
      }),

    firstName: Joi.string().trim().min(2).max(50).required().label('First name')
      .error(errors => {
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

    lastName: Joi.string().trim().min(2).max(50).required().label('Last name')
      .error(errors => {
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

    telephone: Joi.string().trim().regex(/^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/).min(10).max(18).label('Telephone number')
      .error(errors => {
        switch(errors[0].type) {
          case 'string.min':
            return { message: `${errors[0].context.label} requires at least ${errors[0].context.limit} characters.` };
            break;
          case 'string.max':
            return { message: `${errors[0].context.label} may have a maximum of 50 characters.` };
            break;
          case 'string.regex.base':
            return { message: `Please enter a valid ${errors[0].context.label}.` };
          default: // catches required()
            return { message: `${errors[0].context.label} is required.`}
        }
      }),

    organizationName: Joi.string().trim().min(2).max(100).label('Organization name')
      .error(errors => {
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

    dateAdded: Joi.date(),

    dateUpdated: Joi.date()

  };

  return Joi.validate(user, schema);

}

exports.Users = Users;
exports.validate = validateUsers;
