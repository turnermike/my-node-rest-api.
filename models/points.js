/**
 * models/points.js
 *
 * Define and validate a points object.
 * Used for collecting user's points via transactional table.
 *
 */

const mongoose = require('mongoose');
const { Schema } = require mongoose;
const Joi = require('joi');

const pointsSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  value: {
    type: Number,
    require: true,
    default: 0
  },
  dateAdded: {
    type: Date,
    require: true,
    default: Date.now
  }
});