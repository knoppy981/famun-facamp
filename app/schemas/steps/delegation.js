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
})

const step3 = Joi.object({
  address: Joi.string()
    .required()
    .messages({
      'string.empty': 'Address is required'
    }),

  country: Joi.string()
    .required()
    .messages({
      'string.empty': 'Country is required'
    }),

  postalCode: Joi.string()
    .required()
    .messages({
      'string.empty': 'Postal code is required'
    }),

  state: Joi.string()
    .required()
    .messages({
      'string.empty': 'State is required'
    }),

  city: Joi.string()
    .required()
    .messages({
      'string.empty': 'City is required'
    }),

  neighborhood: Joi.string()
    .required()
    .messages({
      'string.empty': 'Neighborhood is required'
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
    case 3: {
      return step3.validateAsync(data)
    }
  }
}