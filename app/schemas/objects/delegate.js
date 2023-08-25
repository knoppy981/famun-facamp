import Joi from "joi";

import { customPhoneNumber } from "../keys/phoneNumber";

export const delegateSchema = Joi.object({
  userType: Joi.string().valid('delegate'),

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
    }),

  emergencyContactName: Joi.string()
    .required()
    .messages({
      'string.empty': `Name is required`,
    }),

  emergencyContactPhoneNumber: customPhoneNumber.phone()
    .required(),

  advisorRole: Joi.forbidden(),
  Facebook: Joi.forbidden(),
  Instagram: Joi.forbidden(),
  Linkedin: Joi.forbidden(),
})