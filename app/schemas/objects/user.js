import Joi from "joi";

import { delegateSchema } from "./delegate";
import { advisorSchema } from "./advisor";
import { documentSchema } from "./document";
import { customPassword } from "../keys/password";
import { customPhoneNumber } from "../keys/phoneNumber";

export const userSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(40)
    .pattern(/^[^\d]*$/)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.pattern.base': 'Invalid Name'
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'E-mail is required',
      'string.email': "Invalid e-mail"
    }),

  password: customPassword.password().required(),

  birthDate: Joi.date()
    .max('now')
    .message('Invalid Birth Date')
    .messages({
      'date.base': 'Birth date is required',
    }),

  phoneNumber: customPhoneNumber.phone()
    .required(),

  nacionality: Joi.string()
    .required()
    .messages({
      'string.empty': 'Please select a nacionality'
    }),

  document: documentSchema,

  delegate: delegateSchema,

  delegationAdvisor: advisorSchema,
}).xor('delegate', 'delegationAdvisor');

export const prismaUserSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(40)
    .pattern(/^[^\d]*$/)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.pattern.base': 'Invalid Name'
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'E-mail is required',
      'string.email': "Invalid e-mail"
    }),

  password: Joi.object({
    create: Joi.object({
      hash: Joi.string()
    })
  }),

  birthDate: Joi.date()
    .max('now')
    .message('Invalid Birth Date')
    .messages({
      'date.base': 'Birth date is required',
    }),

  phoneNumber: customPhoneNumber.phone()
    .required(),

  nacionality: Joi.string()
    .required()
    .messages({
      'string.empty': 'Please select a nacionality'
    }),

  document: documentSchema,

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