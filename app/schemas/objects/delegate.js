import Joi from "joi";

import { customPhoneNumber } from "../keys/phoneNumber";

export const updateDelegateSchema = Joi.object({
  userType: Joi.string().valid('delegate'),

  emergencyContactName: Joi.string()
    .min(3)
    .max(40)
    .pattern(/^[^\d]*$/)
    .messages({
      'string.empty': 'Name is required',
      'string.pattern.base': 'Invalid Name'
    }),

  emergencyContactPhoneNumber: customPhoneNumber.phone(),

  educationLevel: Joi.string()
    .valid("Ensino Medio", "Cursinho", "Universidade")
    .messages({
      'any.required': 'Educational level required',
    }),

  currentYear: Joi.string()
    .messages({
      'string.empty': 'Current year is required',
      'alternatives.match': `Current year is required`,
      'alternatives.all': `Current year is required`,
      'alternatives.any': `Current year is required`,
      'any.required': `Current year is required`,
    }),

  councilPreference: Joi.alternatives()
    .try(
      Joi.string(),
      Joi.array()
        .items(Joi.string()
          .valid('Assembleia_Geral_da_ONU', 'Conselho_de_Juventude_da_ONU', 'Conselho_de_Seguranca_da_ONU', 'Rio_92'))
    ),

  languagesSimulates: Joi.alternatives()
    .try(
      Joi.array().items(Joi.string().valid('Portugues', 'Ingles', 'Espanhol')).min(1).max(3).required(),
      Joi.string().valid('Portugues', 'Ingles', 'Espanhol')
    )
    .messages({
      'alternatives.all': `At least one language required`,
      'alternatives.any': `At least one language required`,
      'alternatives.match': `At least one language required`,
      'any.required': `At least one language required`,
      'alternatives.types': 'At least one language required'
    }),

  country: Joi.string()
    .messages({
      'string.empty': 'Please select a nacionality'
    }),

  comittee: Joi.any(),

  advisorRole: Joi.forbidden(),
  Facebook: Joi.forbidden(),
  Instagram: Joi.forbidden(),
  Linkedin: Joi.forbidden(),
})

export const createDelegateSchema = Joi.object({
  userType: Joi.string().valid('delegate'),

  emergencyContactName: Joi.string()
    .min(3)
    .max(40)
    .required()
    .pattern(/^[^\d]*$/)
    .messages({
      'string.empty': 'Name is required',
      'string.pattern.base': 'Invalid Name'
    }),

  emergencyContactPhoneNumber: customPhoneNumber.phone()
    .required(),

  educationLevel: Joi.string()
    .valid("Ensino Medio", "Cursinho", "Universidade")
    .required()
    .messages({
      'any.required': 'Educational level required',
    }),

  currentYear: Joi.string()
    .required()
    .messages({
      'string.empty': 'Current year is required',
      'alternatives.match': `Current year is required`,
      'alternatives.all': `Current year is required`,
      'alternatives.any': `Current year is required`,
      'any.required': `Current year is required`,
    }),

  councilPreference: Joi.alternatives()
    .try(
      Joi.string(),
      Joi.array()
        .items(Joi.string()
          .valid('Assembleia_Geral_da_ONU', 'Conselho_de_Juventude_da_ONU', 'Conselho_de_Seguranca_da_ONU', 'Rio_92'))
    )
    .required(),

  languagesSimulates: Joi.alternatives()
    .try(
      Joi.array().items(Joi.string().valid('Portugues', 'Ingles', 'Espanhol')).min(1).max(3).required(),
      Joi.string().valid('Portugues', 'Ingles', 'Espanhol')
    )
    .required()
    .messages({
      'alternatives.all': `At least one language required`,
      'alternatives.any': `At least one language required`,
      'alternatives.match': `At least one language required`,
      'any.required': `At least one language required`,
      'alternatives.types': 'At least one language required'
    }),

  advisorRole: Joi.forbidden(),
  Facebook: Joi.forbidden(),
  Instagram: Joi.forbidden(),
  Linkedin: Joi.forbidden(),
})