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
      'string.empty': 'E-mail is required',
      'string.email': "Invalid e-mail"
    }),

  name: Joi.string()
    .min(3)
    .max(50)
    .pattern(/^[^\d]*$/)
    .messages({
      'string.empty': 'Name is required',
      'string.pattern.base': 'Invalid Name'
    }),

  phoneNumber: customPhoneNumber.phone(),

  birthDate: Joi.date()
    .max('now')
    .message('Invalid Birth Date')
    .messages({
      'date.base': 'Birth date is required',
    }),

  nacionality: Joi.string()
    .messages({
      'string.empty': 'Please select a nacionality'
    }),

  rg: Joi.string().when('nacionality', {
    is: "Brazil",
    then: Joi.string(),
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
    otherwise: Joi.string(),
  }).messages({
    'string.empty': 'Passport is required',
    'any.required': 'Passport is required for non-Brazilian nationality',
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