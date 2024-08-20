import Joi from "joi";

export const updateConfigurationSchema = Joi.object({
  subscriptionEM: Joi.boolean(),
  subscriptionUNI: Joi.boolean(),
  allowParticipantsChangeData: Joi.boolean(),
  allowParticipantsPayments: Joi.boolean(),
  allowParticipantsSendDocuments: Joi.boolean(),

  conselhosEscolas: Joi.object({
    set: Joi.alternatives()
      .try(
        Joi.string(),
        Joi.array()
          .items(Joi.string())
      )
  }),

  conselhosUniversidades: Joi.object({
    set: Joi.alternatives()
      .try(
        Joi.string(),
        Joi.array()
          .items(Joi.string())
      )
  }),

  representacoesExtras: Joi.object({
    set: Joi.alternatives()
      .try(
        Joi.string(),
        Joi.array()
          .items(Joi.string())
      )
  }),

  precoDelegadoEnsinoMedio: Joi.number()
    .min(50)
    .messages({
      'number.min': 'O valor deve ser de no mínimo 50 centavos'
    }),
  precoDelegadoUniversidade: Joi.number()
    .min(50)
    .messages({
      'number.min': 'O valor deve ser de no mínimo 50 centavos'
    }),
  precoProfessorOrientador: Joi.number()
    .min(50)
    .messages({
      'number.min': 'O valor deve ser de no mínimo 50 centavos'
    }),
  precoDelegadoInternacional: Joi.number()
    .min(50)
    .messages({
      'number.min': 'O valor deve ser de no mínimo 50 centavos'
    }),
  precoFacultyAdvisors: Joi.number()
    .min(50)
    .messages({
      'number.min': 'O valor deve ser de no mínimo 50 centavos'
    }),
})