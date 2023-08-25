import Joi from "joi"

import { customCpf } from "../keys/cpf"

export const documentSchema = Joi.object({
  documentName: Joi.string().valid('passport', 'cpf').required(),
  value: Joi.when('documentName', {
    is: 'cpf',
    then: customCpf.cpf(),  // hypothetical validation for passport
    otherwise: Joi.string() // hypothetical validation for driver license
  }).required(),
})