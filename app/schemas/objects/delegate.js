import Joi from "joi";

import { customPhoneNumber } from "../keys/phoneNumber";

export const updateDelegateSchema = Joi.object({
  userType: Joi.string().valid('delegate'),

  emergencyContactName: Joi.string()
    .min(3)
    .max(40)
    .pattern(/^[^\d]*$/)
    .messages({
      'string.empty': 'Nome é necessário',
      'string.pattern.base': 'Nome inválido'
    }),

  emergencyContactPhoneNumber: customPhoneNumber.phone(),

  educationLevel: Joi.string()
    .valid("Ensino Medio", "Cursinho", "Universidade")
    .messages({
      'any.required': 'Nível educacional é necessário',
    }),

  currentYear: Joi.string()
    .messages({
      'string.empty': 'Ano atual é necessário',
      'alternatives.match': `Ano atual é necessário`,
      'alternatives.all': `Ano atual é necessário`,
      'alternatives.any': `Ano atual é necessário`,
      'any.required': `Ano atual é necessário`,
    }),

  councilPreference: Joi.alternatives()
    .try(
      Joi.string(),
      Joi.array()
        .items(Joi.string())
    ),

  languagesSimulates: Joi.alternatives()
    .try(
      Joi.array().items(Joi.string().valid('Portugues', 'Ingles', 'Espanhol')).min(1).max(3).required(),
      Joi.string().valid('Portugues', 'Ingles', 'Espanhol')
    )
    .messages({
      'alternatives.all': `Pelo menos um idioma necessário`,
      'alternatives.any': `Pelo menos um idioma necessário`,
      'alternatives.match': `Pelo menos um idioma necessário`,
      'any.required': `Pelo menos um idioma necessário`,
      'alternatives.types': 'Pelo menos um idioma necessário'
    }),

  country: Joi.string()
    .messages({
      'string.empty': 'Selecione uma nacionalidade'
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
      'string.empty': 'Nome é necessário',
      'string.pattern.base': 'Nome inválido'
    }),

  emergencyContactPhoneNumber: customPhoneNumber.phone()
    .required(),

  educationLevel: Joi.string()
    .valid("Ensino Medio", "Cursinho", "Universidade")
    .required()
    .messages({
      'any.required': 'Nível educacional é necessário',
    }),

  currentYear: Joi.string()
    .required()
    .messages({
      'string.empty': 'Ano atual é necessário',
      'alternatives.match': `Ano atual é necessário`,
      'alternatives.all': `Ano atual é necessário`,
      'alternatives.any': `Ano atual é necessário`,
      'any.required': `Ano atual é necessário`,
    }),

  councilPreference: Joi.alternatives()
    .try(
      Joi.string(),
      Joi.array()
        .items(Joi.string())
    )
    .required(),

  languagesSimulates: Joi.alternatives()
    .try(
      Joi.array().items(Joi.string().valid('Portugues', 'Ingles', 'Espanhol')).min(1).max(3).required(),
      Joi.string().valid('Portugues', 'Ingles', 'Espanhol')
    )
    .required()
    .messages({
      'alternatives.all': `Pelo menos um idioma necessário`,
      'alternatives.any': `Pelo menos um idioma necessário`,
      'alternatives.match': `Pelo menos um idioma necessário`,
      'any.required': `Pelo menos um idioma necessário`,
      'alternatives.types': 'Pelo menos um idioma necessário'
    }),

  advisorRole: Joi.forbidden(),
  Facebook: Joi.forbidden(),
  Instagram: Joi.forbidden(),
  Linkedin: Joi.forbidden(),
})