import Joi from "joi";

export const customEmail = Joi.string()
  .email()
  .required()
  .messages({
    'string.empty': 'E-mail é necessário',
    'string.email': "E-mail inválido"
  })