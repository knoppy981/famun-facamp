import Joi from "joi";

export const updateConfigurationSchema = Joi.object({
  subscriptionAvailable: Joi.boolean(),

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

  precoDelegadoEnsinoMedio: Joi.number(),
  precoDelegadoUniversidade: Joi.number(),
  precoProfessorOrientador: Joi.number(),
  precoDelegadoInternacional: Joi.number(),
  precoFacultyAdvisors: Joi.number(),

})