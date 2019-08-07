/**
 * models/points.js
 *
 * Define and validate a points object.
 * Used for collecting user's points via transactional table.
 * UserId and email are saved as a sub document.
 *
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;
const JoiBase = require('joi');
const JoiDecimals = require('joi-decimal');
const Joi = JoiBase.extend(JoiDecimals);

const pointsSchema = new Schema({
  _user: {
    // type: usersSchema,
    // type: Schema.Types.ObjectId,
    type: Map,
    of: String,
    required: true
  },
  points: {
    type: Number,
    required: true,
    default: 0
  },
  action: {
    type: String,
    required: true,
    default: 'added'
  },
  dateAdded: {
    type: Date,
    required: true,
    default: Date.now
  }
});

// define the model
const Points = mongoose.model('Points', pointsSchema);

// POST validation
function validatePointsPOST(points) {

  const schema = {

    // points: Joi.number()
    points: Joi.string().trim().regex(/^-?[1-9]\d*$/)     // positive or negative number without decimal places
      .required()
      .label('Points')
      .error(errors => {
        // console.log('errors', errors[0].type);
        switch (errors[0].type) {
          case 'string.regex.base':
            return { message: 'Please enter a whole number for the points parameter, no decimal places.'};
          // case 'number.base':
          //   return { message: 'Please enter a valid number for the points parameter.'};
          default:
            return { message: `The ${errors[0].context.label} parameter is required.` };
        }
    }),

    action: Joi.string()
      .trim()
      .valid('add', 'subtract', 'transfer')
      .required()
      .min(3)
      .max(50)
      .label('Action')
      .error(errors => {
        // console.log('errors', errors[0].type);
        switch (errors[0].type) {
          case 'any.allowOnly':
            return { message: 'Please enter one of the following for the action parameter: add, subtract, transfer' };
          case 'string.min':
            return { message: `${errors[0].context.label} requires at least ${errors[0].context.limit} characters.` };
            break;
          case 'string.max':
            return { message: `${errors[0].context.label} may have a maximum of 50 characters.` };
            break;
          default:
            return { message: `The ${errors[0].context.label} parameter is required.` };
        }
    })

  }

  return Joi.validate(points, schema);

}

exports.Points = Points;
exports.validatePOST = validatePointsPOST;
