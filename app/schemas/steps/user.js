import Joi from "joi"

import { delegateSchema } from "../objects/delegate"
import { advisorSchema } from "../objects/advisor"
import { customPassword } from "../keys/password";
import { customPhoneNumber } from "../keys/phoneNumber";
import { customCpf } from "../keys/cpf";

const step1 = Joi.object({
  termsAndConditions: Joi.boolean()
    .truthy("on")
})

const step2 = Joi.object({
  nacionality: Joi.string()
    .required()
    .messages({
      'string.empty': 'Please select a nacionality'
    })
})

const step3 = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'E-mail is required',
      'string.email': "Invalid e-mail"
    }),

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

const step4 = Joi.object({
  name: Joi.string()
    .min(3)
    .max(40)
    .pattern(/^[^\d]*$/)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.pattern.base': 'Invalid Name'
    }),

  cpf: customCpf.cpf(),

  passport: Joi.string()
    .messages({
      'string.empty': 'Passport is required',
    }),

  birthDate: Joi.date()
    .max('now')
    .message('Invalid Birth Date')
    .messages({
      'date.base': 'Birth date is required',
    }),

  phoneNumber: customPhoneNumber.phone()
    .required(),

}).xor('cpf', 'passport')

export async function userStepValidation(step, data) {
  switch (step) {
    case 1: {
      return step1.validateAsync(data)
    }
    case 2: {
      return step2.validateAsync(data)
    }
    case 3: {
      return step3.validateAsync(data)
    }
    case 4: {
      return step4.validateAsync(data)
    }
    case 6: {
      return data.userType === "delegate" ?
        delegateSchema.validateAsync(data) : advisorSchema.validateAsync(data)
    }
  }
}