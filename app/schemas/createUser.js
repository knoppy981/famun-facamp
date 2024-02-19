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
      'string.empty': 'E-mail is required',
      'string.email': "Invalid e-mail"
    }),

  name: Joi.string()
    .min(3)
    .max(50)
    .required()
    .pattern(/^[^\d]*$/)
    .messages({
      'string.empty': 'Name is required',
      'string.pattern.base': 'Invalid Name'
    }),

  phoneNumber: customPhoneNumber.phone()
    .required(),

  birthDate: Joi.date()
    .max('now')
    .required()
    .messages({
      'date.base': 'Birth date is required',
    }),

  nacionality: Joi.string()
    .required()
    .messages({
      'string.empty': 'Please select a nacionality'
    }),

  rg: Joi.string().when('nacionality', {
    is: "Brazil",
    then: Joi.string().required(),
    otherwise: Joi.string().allow('', null).optional(),
  }).messages({
    'string.empty': 'RG is required',
    'any.required': 'RG is required for Brazilian nationality',
  }),

  cpf: customCpf.cpf()
    .optional()
    .allow('', null),

  passport: Joi.string().when('nacionality', {
    is: "Brazil",
    then: Joi.string().allow('', null).optional(),
    otherwise: Joi.string().required(),
  }).messages({
    'string.empty': 'Passport is required',
    'any.required': 'Passport is required for non-Brazilian nationality',
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