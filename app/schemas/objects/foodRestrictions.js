import Joi from "joi";

export const foodRestrictionsSchema = Joi.object({
  diet: Joi.string()
    .valid('vegetarian', 'vegan', '')
    .messages({
      'any.only': "Select either vegetarian or vegan"
    }),

  allergy: Joi.boolean(),

  allergyDescription: Joi.string().when('allergy', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.string().allow('').optional(),
  }).messages({
    'string.empty': "Please describe your allergy",
    'any.forbidden': "Don't submit a description if you didn't say you had an allergy",
    'alternatives.all': "Please describe your allergy",
    'alternatives.any': "Please describe your allergy",
    'alternatives.match': "Please describe your allergy",
    'any.required': "Please describe your allergy",
  })
})