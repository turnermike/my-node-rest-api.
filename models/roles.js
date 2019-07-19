/**
 * modles/roles.js
 *
 * Define and validate a user roles.
 *
 */

const mongoose = require('mongoose');
const Joi = require('joi');

// schema
const rolesSchema = new mongoose.Schema({
  label: {
    type: String,
    // required: true,
    // min: 2,
    // max: 50,
  }
  // level: {                // not in use at this time
  //   type: Number,
  //   required: true,
  //   min: 1,
  //   max: 5,
  // },
  // dateAdded: {
  //   type: Date,
  //   required: true,
  //   default: Date.now,
  // }
});

// model
const Roles = mongoose.model('Roles', rolesSchema);

// validation
function validateRoles(role) {

  const schema = {
    label: Joi.string().trim().min(5).max(50).required()
    // level: Joi.number().trim().min(1).max(5).required(),
    // dateAdded: Joi.date()
  };

  return Joi.validate(role, schema);
}

exports.rolesSchema = rolesSchema;
exports.Roles = Roles;
exports.validate = validateRoles;
