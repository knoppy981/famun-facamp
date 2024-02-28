import Joi from "joi";
import { isValidPhoneNumber } from "react-phone-number-input";

export const customPhoneNumber = Joi.extend({
  type: 'phone',
  base: Joi.string(),
  messages: {
    'phone.invalid': 'Telefone inválido',
    'phone.required': 'Telefone é necessário',
    'string.empty': 'Telefone é necessário'
  },
  validate(value, helpers) {
    if (!isValidPhoneNumber(value)) {
      return { value, errors: helpers.error('phone.invalid') };
    }
  }
});