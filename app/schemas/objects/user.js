import Joi from "joi";

export const findUser = Joi.object({
  id: Joi.string(),
  email: Joi.string()
    .email()
    .messages({
      'string.empty': 'E-mail is required',
      'string.email': "Invalid e-mail"
    }),
}).xor('id', 'email')