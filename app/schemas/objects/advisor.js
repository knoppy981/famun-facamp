import Joi from "joi";

export const updateAdvisorSchema = Joi.object({
  userType: Joi.string().valid('advisor'),

  advisorRole: Joi.string()
    .messages({
      'string.empty': `Selecione uma posição`,
    }),

  facebook: Joi.string()
    .allow(''),

  instagram: Joi.string()
    .allow(''),

  linkedin: Joi.string()
    .allow(''),

  councilPreference: Joi.forbidden(),
  languagesSimulates: Joi.forbidden(),
  emergencyContactName: Joi.forbidden(),
  emergencyContactPhoneNumber: Joi.forbidden(),
})

export const createAdvisorSchema = Joi.object({
  userType: Joi.string().valid('advisor'),

  advisorRole: Joi.string()
    .required()
    .messages({
      'string.empty': `Selecione uma posição`,
    }),

  facebook: Joi.string()
    .allow(''),

  instagram: Joi.string()
    .allow(''),

  linkedin: Joi.string()
    .allow(''),

  councilPreference: Joi.forbidden(),
  languagesSimulates: Joi.forbidden(),
  emergencyContactName: Joi.forbidden(),
  emergencyContactPhoneNumber: Joi.forbidden(),
})