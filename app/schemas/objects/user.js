import Joi from "joi";

export const findUser = Joi.object({
  id: Joi.string(),
  email: Joi.string()
    .email()
    .messages({
      'string.empty': "E-mail obrigatório",
      'string.email': "Invalid e-mail",
      'any.required': "E-mail obrigatório"
    }),
}).xor('id', 'email')