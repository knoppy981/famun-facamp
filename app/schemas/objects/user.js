import Joi from "joi";

import { delegateSchema } from "./delegate";
import { advisorSchema } from "./advisor";
import { foodRestrictionsSchema } from "./foodRestrictions";
import { customPhoneNumber } from "../keys/phoneNumber";
import { customCpf } from "../keys/cpf";

export const userSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'E-mail is required',
      'string.email': "Invalid e-mail"
    }),

  name: Joi.string()
    .min(3)
    .max(40)
    .pattern(/^[^\d]*$/)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.pattern.base': 'Invalid Name'
    }),

  password: Joi.object({
    create: Joi.object({
      hash: Joi.string()
    })
  }),

  phoneNumber: customPhoneNumber.phone()
    .required(),

  birthDate: Joi.date()
    .required()
    .max('now')
    .message('Invalid Birth Date')
    .messages({
      'date.base': 'Birth date is required',
    }),

  nacionality: Joi.string()
    .required()
    .messages({
      'string.empty': 'Please select a nacionality'
    }),

  cpf: customCpf.cpf().optional().allow(''),

  rg: Joi.string().when('nacionality', {
    is: "Brazil",
    then: Joi.required(),
    otherwise: Joi.string().allow('').optional(),
  }).messages({
    'string.empty': 'RG is required',
  }),

  passport: Joi.string().when('nacionality', {
    is: "Brazil",
    then: Joi.string().allow('').optional(),
    otherwise: Joi.required(),
  }).messages({
    'string.empty': 'Passport is required',
  }),

  participationMethod: Joi.string()
    .valid("Escola", "Universidade")
    .required(),

  foodRestriction: foodRestrictionsSchema,

  delegate: delegateSchema,

  delegationAdvisor: advisorSchema,
}).xor('delegate', 'delegationAdvisor');

export const prismaUserSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'E-mail is required',
      'string.email': "Invalid e-mail"
    }),

  name: Joi.string()
    .min(3)
    .max(40)
    .pattern(/^[^\d]*$/)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.pattern.base': 'Invalid Name'
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
    .message('Invalid Birth Date')
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
    then: Joi.required(),
    otherwise: Joi.string().allow('', null).optional(),
  }).messages({
    'string.empty': 'RG is required',
  }),

  cpf: customCpf.cpf().optional().allow('', null),

  passport: Joi.string().when('nacionality', {
    is: "Brazil",
    then: Joi.string().allow('', null).optional(),
    otherwise: Joi.required(),
  }).messages({
    'string.empty': 'Passport is required',
  }),


  participationMethod: Joi.string()
    .valid("Escola", "Universidade")
    .required(),

  foodRestrictions: Joi.alternatives().try(
    Joi.object({
      create: foodRestrictionsSchema
    }),
    Joi.object({
      update: foodRestrictionsSchema
    }),
    Joi.object({
      upsert: {
        create: foodRestrictionsSchema,
        update: foodRestrictionsSchema,
      }
    }),
  ),

  delegate: Joi.alternatives().try(
    Joi.object({
      create: delegateSchema
    }),
    Joi.object({
      update: delegateSchema
    }),
  ),

  delegationAdvisor: Joi.alternatives().try(
    Joi.object({
      create: advisorSchema
    }),
    Joi.object({
      update: advisorSchema
    }),
  ),
}).xor('delegate', 'delegationAdvisor');

export const findUser = Joi.object({
  id: Joi.string(),
  email: Joi.string()
    .email()
    .messages({
      'string.empty': 'E-mail is required',
      'string.email': "Invalid e-mail"
    }),
}).xor('id', 'email')