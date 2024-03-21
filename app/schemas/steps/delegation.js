import Joi from "joi"
import { customPhoneNumber } from "../keys/phoneNumber"

const step1 = Joi.object({
  joinMethod: Joi.string()
    .valid('create', 'join')
    .required()
})

const step2 = Joi.object({
  school: Joi.string()
    .min(3)
    .max(60)
    .required()
    .messages({
      'string.min': 'Nome deve conter pelo menos 3 letras',
      'string.max': "Nome não pode conter mais de 60 lentras",
      'string.empty': 'Nome é necessário',
    }),

  schoolPhoneNumber: customPhoneNumber.phone()
    .required(),

  maxParticipants: Joi.number()
    .min(1)
    .max(10)
    .required(),

  participationMethod: Joi.string()
    .valid('Escola', 'Universidade')
    .required()
    .messages({
      'any.only': 'Método de participação obrigatório',
    }),

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


export async function delegationStepValidation(step, data) {
  switch (step) {
    case 1: {
      return step1.validateAsync(data)
    }
    case 2: {
      return step2.validateAsync(data)
    }
  }
}