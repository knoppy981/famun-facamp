import Joi from "joi";

import { findUser } from "./objects/user";
import { customPhoneNumber } from "./keys/phoneNumber";
import { updateUserSchema } from "./index"

const addressSchema = Joi.object({
  address: Joi.string()
    .messages({
      'string.empty': 'Endereço obrigatório',
      'any.required': 'Endereço obrigatório'
    }),

  country: Joi.string()
    .messages({
      'string.empty': 'País obrigatório',
      'any.required': 'País obrigatório'
    }),

  postalCode: Joi.string()
    .messages({
      'string.empty': 'Código postal obrigatório',
      'any.required': 'Código postal obrigatório'
    }),

  state: Joi.string()
    .messages({
      'string.empty': 'Estado obrigatório',
      'any.required': 'Estado obrigatório'
    }),

  city: Joi.string()
    .messages({
      'string.empty': 'Cidade obrigatório',
      'any.required': 'Cidade obrigatório'
    }),
})

export const updateDelegationSchema = Joi.object({
  school: Joi.string()
    .min(3)
    .max(60)
    .messages({
      'any.required': "Nome obrigatório",
      'string.min': 'Nome deve conter pelo menos 3 letras',
      'string.max': "Nome não pode conter mais de 60 lentras",
      'string.empty': 'Nome obrigatório',
    }),

  schoolPhoneNumber: customPhoneNumber.phone(),

  participationMethod: Joi.string()
    .valid('Escola', 'Universidade')
    .messages({
      'any.only': 'Método de Participação obrigatório',
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
