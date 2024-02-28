import Joi from "joi"

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'E-mail inválido',
      'string.email': "E-mail inválido"
    }),

  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Senha inválida',
      'string.email': "Senha inválida"
    })
})