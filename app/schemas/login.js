import Joi from "joi"

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'E-mail is required',
      'string.email': "Invalid e-mail"
    }),

  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.email': "Invalid password"
    })
})