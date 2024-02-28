import Joi from "joi";

export const foodRestrictionsSchema = Joi.object({
  diet: Joi.string()
    .valid('vegetarian', 'vegan', '')
    .messages({
      'any.only': "Selecione ou vegetariano ou vegano"
    }),

  allergy: Joi.boolean(),

  allergyDescription: Joi.string().when('allergy', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.string().allow('').optional(),
  }).messages({
    'string.empty': "Descreva sua alergia",
    'any.forbidden': "",
    'alternatives.all': "Descreva sua alergia",
    'alternatives.any': "Descreva sua alergia",
    'alternatives.match': "Descreva sua alergia",
    'any.required': "Descreva sua alergia",
  })
})