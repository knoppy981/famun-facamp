import Joi from "joi";

export const customPassword = Joi.extend({
  type: 'password',
  base: Joi.string(),
  messages: {
    'password.lowerCase': 'Password must contain at least one lower case character',
    'password.upperCase': 'Password must contain at least one upper case character',
    'password.digit': 'Password must contain at least one number',
    'password.length': 'Password must contain at least 8 characters',
    'string.empty': 'Password is required'
  },
  validate(value, helpers) {
    if (value.length < 8) return { value, errors: helpers.error('password.length') };
    if (!value.match(/(?=.*\d)/)) return { value, errors: helpers.error('password.digit') };
    if (!value.match(/(?=.*[a-z])/)) return { value, errors: helpers.error('password.lowerCase') };
    if (!value.match(/(?=.*[A-Z])/)) return { value, errors: helpers.error('password.upperCase') };
  }
});

export const completePassword = Joi.object({
  password: customPassword.password()
    .required(),

  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref('password'))
    .messages({
      'any.only': "Passwords don't match",
      'string.empty': 'Confirm Password is Required'
    })
})