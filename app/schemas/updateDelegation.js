import Joi from "joi";

import { findUser, prismaUserSchema } from "./objects/user";
import { customPhoneNumber } from "./keys/phoneNumber";
import { updateUserSchema } from "./index"

const addressSchema = Joi.object({
  address: Joi.string()
    .messages({
      'string.empty': 'Address is required'
    }),

  country: Joi.string()
    .messages({
      'string.empty': 'Country is required'
    }),

  postalCode: Joi.string()
    .messages({
      'string.empty': 'Postal code is required'
    }),

  state: Joi.string()
    .messages({
      'string.empty': 'State is required'
    }),

  city: Joi.string()
    .messages({
      'string.empty': 'City is required'
    }),
})

export const updateDelegationSchema = Joi.object({
  school: Joi.string()
    .min(3)
    .max(60)
    .messages({
      'string.min': 'School name must be at least 3 characters long',
      'string.max': "School name can't be more than 60 characters long",
      'string.empty': 'School name is required',
    }),

  schoolPhoneNumber: customPhoneNumber.phone(),

  participationMethod: Joi.string()
    .valid('Escola', 'Universidade')
    .messages({
      'any.only': 'Participation method is required',
    }),

  code: Joi.string(),

  inviteLink: Joi.string(),

  address: Joi.object({
    update: addressSchema
  }),

  participants: Joi.object({
    update: Joi.object({
      where: findUser,
      data: updateUserSchema,
    })
  }).optional()
})
