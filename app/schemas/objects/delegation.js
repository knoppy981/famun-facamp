import Joi from "joi";

import { customPhoneNumber } from "../keys/phoneNumber";
import { addressSchema, prismaAddressSchema } from "./address";
import { findUser, prismaUserSchema } from "./user";

export const delegationSchema = Joi.object({
  school: Joi.string()
    .min(3)
    .max(60)
    .required()
    .messages({
      'string.min': 'School name must be at least 3 characters long',
      'string.max': "School name can't be more than 40 characters long",
      'string.empty': 'School name is required',
    }),

  schoolPhoneNumber: customPhoneNumber.phone()
    .required(),

  participationMethod: Joi.string()
    .valid('Presencial', 'Online', 'Ambos')
    .required()
    .messages({
      'any.only': 'Participation method is required',
    }),

  code: Joi.string(),

  inviteLink: Joi.string(),

  address: addressSchema
})

export const prismaDelegationSchema = Joi.object({
  school: Joi.string()
    .min(3)
    .max(60)
    .required()
    .messages({
      'string.min': 'School name must be at least 3 characters long',
      'string.max': "School name can't be more than 40 characters long",
      'string.empty': 'School name is required',
    }),

  schoolPhoneNumber: customPhoneNumber.phone()
    .required(),

  participationMethod: Joi.string()
    .valid('Presencial', 'Online', 'Ambos')
    .required()
    .messages({
      'any.only': 'Participation method is required',
    }),

  code: Joi.string(),

  inviteLink: Joi.string(),

  address: prismaAddressSchema,

  participants: Joi.alternatives().try(
    Joi.object({
      connect: findUser
    }),
    Joi.object({
      update: Joi.object({
        data: prismaUserSchema,
        where: findUser
      })
    }),
    Joi.object({
      updateMany: Joi.array().items(
        Joi.object({
          data: prismaUserSchema,
          where: findUser
        })
      )
    })
  ).optional()
})
