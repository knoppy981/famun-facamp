import Joi from "joi";

import { createDelegateSchema } from "./objects/delegate";
import { createAdvisorSchema } from "./objects/advisor";
import { foodRestrictionsSchema } from "./objects/foodRestrictions";
import { customPhoneNumber } from "./keys/phoneNumber";
import { customCpf } from "./keys/cpf";

export const createUserSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'E-mail obrigatório',
      'string.email': "E-mail inválido"
    }),

  name: Joi.string()
    .min(3)
    .max(50)
    .required()
    .pattern(/^[^\d]*$/)
    .messages({
      'string.empty': 'Nome obrigatório',
      'string.pattern.base': 'Nome inválido',
      'string.min': 'Nome deve conter pelo menos 3 letras',
      'string.max': "Nome não pode conter mais de 60 lentras",
    }),

  socialName: Joi.string()
    .max(40)
    .pattern(/^[^\d]*$/)
    .optional()
    .allow('', null)
    .messages({
      'string.pattern.base': 'Nome inválido',
      'string.min': 'Nome deve conter pelo menos 3 letras',
      'string.max': "Nome não pode conter mais de 60 lentras",
    }),

  password: Joi.object({
    create: Joi.object({
      hash: Joi.string()
    })
  }),

  phoneNumber: customPhoneNumber.phone()
    .required(),

  birthDate: Joi.date()
    .max('now')
    .required()
    .messages({
      'date.base': 'Data de nascimento obrigatório',
    }),

  nacionality: Joi.string()
    .required()
    .messages({
      'string.empty': 'Selecione sua nacionalidade'
    }),

  sex: Joi.string()
    .valid('Male', 'Female')
    .required()
    .messages({
      'string.empty': 'Sexo obrigatório',
      'string.pattern.base': 'Sexo inválido'
    }),


  rg: Joi.string().when('nacionality', {
    is: "Brazil",
    then: Joi.string().required(),
    otherwise: Joi.string().allow('', null).optional(),
  }).messages({
    'string.empty': 'RG obrigatório',
    'any.required': 'RG obrigatório',
  }),

  cpf: customCpf.cpf()
    .optional()
    .allow('', null),

  passport: Joi.string().when('nacionality', {
    is: "Brazil",
    then: Joi.string().allow('', null).optional(),
    otherwise: Joi.string().required(),
  }).messages({
    'string.empty': 'Passporte obrigatório',
    'any.required': 'Passporte obrigatório',
  }),

  participationMethod: Joi.string()
    .required()
    .valid("Escola", "Universidade"),

  foodRestrictions: Joi.object({
    create: foodRestrictionsSchema,
  }),

  delegate: Joi.object({
    create: createDelegateSchema
  }),

  delegationAdvisor: Joi.object({
    create: createAdvisorSchema
  }),
}).xor('delegate', 'delegationAdvisor');