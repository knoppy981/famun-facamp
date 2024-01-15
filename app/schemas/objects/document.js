import Joi from "joi"

import { customCpf } from "../keys/cpf"

export const documentSchema = Joi.object({
  documentName: Joi.string().valid('passport', 'cpf').required(),
  value: Joi.when('documentName', {
    is: 'cpf',
    then: customCpf.cpf(),  // validation for cpf
    otherwise: Joi.string() // validation for passport
    .messages({
      'string.empty': 'Passport is required',
      'string.email': "Invalid passport"
    })
  }).required(),
})