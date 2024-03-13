import Joi from "joi"

export const comitteeSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      'string.empty': 'Nome obrigatório',
      'string.email': "Nome inválido"
    }),

  council: Joi.alternatives()
    .try(
      Joi.string(),
      Joi.array()
        .items(Joi.string())
    )
    .required(),

  type: Joi.string()
    .valid('Escola', 'Universidade')
    .required()
})