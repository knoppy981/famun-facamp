import Joi from "joi";

import { customPhoneNumber } from "../keys/phoneNumber";

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

  address: Joi.object({
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

  address: Joi.object({
    create: ({
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
  }),

  participants: Joi.object({
    connect: Joi.object({
      id: Joi.string(),
      email: Joi.string()
        .email()
        .messages({
          'string.empty': 'E-mail is required',
          'string.email': "Invalid e-mail"
        }),
    }).xor('id', 'email')
  })
})
