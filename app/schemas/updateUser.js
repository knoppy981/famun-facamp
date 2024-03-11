import Joi from "joi";

import { updateDelegateSchema } from "./objects/delegate";
import { updateAdvisorSchema } from "./objects/advisor";
import { foodRestrictionsSchema } from "./objects/foodRestrictions";
import { customPhoneNumber } from "./keys/phoneNumber";
import { customCpf } from "./keys/cpf";

export const updateUserSchema = Joi.object({
  email: Joi.string()
    .email()
    .messages({
      'string.empty': 'E-mail obrigatório',
      'string.email': "E-mail inválido"
    }),

  name: Joi.string()
    .min(3)
    .max(50)
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
    .allow('')
    .messages({
      'string.pattern.base': 'Nome inválido',
      'string.min': 'Nome deve conter pelo menos 3 letras',
      'string.max': "Nome não pode conter mais de 60 lentras",
    }),

  phoneNumber: customPhoneNumber.phone(),

  birthDate: Joi.date()
    .max('now')
    .message('Invalid Birth Date')
    .messages({
      'date.base': 'Data de nascimento obrigatória',
    }),

  sex: Joi.string()
    .valid('Male', 'Female')
    .messages({
      'string.empty': 'Sexo obrigatório',
      'string.pattern.base': 'Sexo inválido'
    }),

  nacionality: Joi.string()
    .messages({
      'string.empty': 'Selecione uma nacionalidade'
    }),

  rg: Joi.string().when('nacionality', {
    is: "Brazil",
    then: Joi.string(),
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
    otherwise: Joi.string(),
  }).messages({
    'string.empty': 'Passporte obrigatório',
    'any.required': 'Passporte obrigatório',
  }),

  participationMethod: Joi.string()
    .valid("Escola", "Universidade"),

  foodRestrictions: Joi.object({
    upsert: {
      create: foodRestrictionsSchema,
      update: foodRestrictionsSchema,
    }
  }),

  delegate: Joi.object({
    update: updateDelegateSchema
  }),

  delegationAdvisor: Joi.object({
    update: updateAdvisorSchema
  }),

}).oxor('delegate', 'delegationAdvisor');