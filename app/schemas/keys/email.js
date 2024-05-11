import Joi from "joi";

export const customEmail = Joi.string()
  .email()
  .required()
  .messages({
    'string.empty': 'E-mail obrigatório',
    'string.email': "E-mail inválido",
    'any.required': "E-mail inválido",
  })