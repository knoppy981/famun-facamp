import Joi from "joi";

export const customEmail = Joi.string()
  .email()
  .required()
  .messages({
    'string.empty': 'E-mail is required',
    'string.email': "Invalid e-mail"
  })