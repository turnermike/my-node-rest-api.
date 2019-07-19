/**
 * modles/roles.js
 *
 * Define and validate a user roles.
 *
 */

const mongoose = require('mongoose');
// const ObjectID = require('mongodb').ObjectID;
const Joi = require('joi');

// schema
const rolesSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    min: 2,
    max: 50,
  },
  level: {                // not in use at this time
    type: Number,
    required: true,
    min: 1,
    max: 5,
  }
});

// model
const Roles = mongoose.model('Roles', rolesSchema);

// validation
function validateRoles(role) {

  const schema = {
    label: Joi.string().min(5).max(50).required(),
    level: Joi.number().trim().min(1).max(5).required(),
  };

  return Joi.validate(role, schema);
}

exports.rolesSchema = rolesSchema;
exports.Roles = Roles;
// exports.validate = validateRoles;
