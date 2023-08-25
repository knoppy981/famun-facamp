import Joi from "joi";
import { isValidCpf } from "~/utils";

export const customCpf = Joi.extend({
  type: 'cpf',
  base: Joi.string(),
  messages: {
    'cpf.invalid': 'Invalid CPF',
    'string.empty': 'CPF is required'
  },
  validate(value, helpers) {
    if (!isValidCpf(value)) {
      return { value, errors: helpers.error('cpf.invalid') };
    }
  }
});
