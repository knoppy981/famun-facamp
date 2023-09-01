import Joi from "joi";

export const addressSchema = Joi.object({
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

export const prismaAddressSchema = Joi.alternatives().try(
  Joi.object({ create: addressSchema }),
  Joi.object({ update: addressSchema }),
)