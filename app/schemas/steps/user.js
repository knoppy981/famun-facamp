import Joi from "joi"

import { createDelegateSchema } from "../objects/delegate"
import { createAdvisorSchema } from "../objects/advisor"
import { customPassword } from "../keys/password";
import { customPhoneNumber } from "../keys/phoneNumber";
import { customCpf } from "../keys/cpf";
import { customRg } from "../keys/rg";

const step1 = Joi.object({
  termsAndConditions: Joi.boolean()
    .truthy("on")
})

const step3 = Joi.object({
  nacionality: Joi.string()
    .required()
    .messages({
      'string.empty': 'Selecione uma nacionalidade'
    })
})

const step4 = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'E-mail obrigatório',
      'string.email': "Invalid e-mail"
    }),

  password: customPassword.password()
    .required(),

  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref('password'))
    .messages({
      'any.only': "Senhas diferentes",
      'string.empty': 'É necessário confirmar a senha'
    })
})

const step5 = Joi.object({
  name: Joi.string()
    .min(3)
    .max(40)
    .pattern(/^[^\d]*$/)
    .required()
    .messages({
      'string.empty': 'Nome obrigatório',
      'string.pattern.base': 'Nome obrigatório'
    }),

  rg: customRg.rg(),

  cpf: customCpf.cpf().optional().allow(''),

  passport: Joi.string()
    .messages({
      'string.empty': 'Passporte obrigatório',
    }),

  birthDate: Joi.date()
    .max('now')
    .min(new Date(1900, 1, 1))
    .message('Invalid Birth Date')
    .required()
    .messages({
      'date.base': 'Data de nascimento obrigatória',
    }),

  phoneNumber: customPhoneNumber.phone()
    .required(),

  sex: Joi.string()
    .valid('Male', 'Female')
    .required()
    .messages({
      'string.empty': 'Sexo obrigatório',
      'string.pattern.base': 'Sexp inválido'
    }),

  diet: Joi.string()
    .valid('vegetarian', 'vegan')
    .messages({
      'any.only': "Selecione ou vegetariano ou vegano"
    }),

  allergy: Joi.string()
    .valid("on", "off"),

  allergyDescription: Joi.string().when('allergy', {
    is: "on",
    then: Joi.required(),
    otherwise: Joi.optional()
  }).messages({
    'string.empty': "Descreva sua alergia",
    'any.forbidden': ""
  })

}).xor('rg', 'passport')

export async function userStepValidation(step, data) {
  switch (step) {
    case 1: {
      return step1.validateAsync(data)
    }
    case 3: {
      return step3.validateAsync(data)
    }
    case 4: {
      return step4.validateAsync(data)
    }
    case 5: {
      return step5.validateAsync(data)
    }
    case 7: {
      return data.userType === "delegate" ?
        createDelegateSchema.validateAsync(data) : createAdvisorSchema.validateAsync(data)
    }
  }
}