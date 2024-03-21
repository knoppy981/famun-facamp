import Joi from "joi";

import { findUser } from "./objects/user";
import { customPhoneNumber } from "./keys/phoneNumber";
import { updateUserSchema } from "./index"

const addressSchema = Joi.object({
  address: Joi.string()
    .required()
    .messages({
      'string.empty': 'Endereço obrigatório'
    }),

  country: Joi.string()
    .required()
    .messages({
      'string.empty': 'País obrigatório'
    }),

  postalCode: Joi.string()
    .required()
    .messages({
      'string.empty': 'Código postal obrigatório'
    }),

  state: Joi.string()
    .required()
    .messages({
      'string.empty': 'Estado obrigatório'
    }),

  city: Joi.string()
    .required()
    .messages({
      'string.empty': 'Cidade obrigatório'
    }),
})

export const createDelegationSchema = Joi.object({
  school: Joi.string()
    .min(3)
    .max(60)
    .required()
    .messages({
      'string.min': 'Nome deve conter pelo menos 3 letras',
      'string.max': "Nome não pode conter mais de 60 lentras",
      'string.empty': 'Nome é necessário',
    }),

  schoolPhoneNumber: customPhoneNumber.phone(),

  participationMethod: Joi.string()
    .valid('Escola', 'Universidade')
    .required()
    .messages({
      'any.only': 'Método de participação obrigatório',
    }),

  maxParticipants: Joi.number()
    .min(1)
    .max(10)
    .required(),

  code: Joi.string(),

  inviteLink: Joi.string(),

  paymentExpirationDate: Joi.date()
    .required(),

  address: Joi.object({
    create: addressSchema
  }),

  participants: Joi.object({
    connect: Joi.object({
      id: Joi.string()
        .required()
    })
  }).optional()
})
