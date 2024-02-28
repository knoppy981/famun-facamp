import Joi from "joi"

export const comitteeSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      'string.empty': 'Nome obrigatório',
      'string.email': "Nome inválido"
    }),

  council: Joi.string()
    .valid('Assembleia_Geral_da_ONU', 'Conselho_de_Juventude_da_ONU', 'Conselho_de_Seguranca_da_ONU', 'Rio_92')
    .required(),

  type: Joi.string()
    .valid('Escola', 'Universidade')
    .required()
})