/**
 * modles/roles.js
 *
 * Define and validate user roles.
 *
 * Insert roles to get started:
 * db.roles.insert({ label: 'Administrator', level: 1, dateAdded: new Date() });
 * db.roles.insert({ label: 'Guest', level: 2, dateAdded: new Date() });
 *
 */

const mongoose = require('mongoose');
const Joi = require('joi');
// const config = require('config');
// const logger = require('../middleware/logger');

// schema
const rolesSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
        min: 2,
        max: 50
    },
    level: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    dateAdded: {
        type: Date,
        required: true,
        default: Date.now
    }
});

// schema/model
const Roles = mongoose.model('Roles', rolesSchema);

exports.Roles = Roles;
