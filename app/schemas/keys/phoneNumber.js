import Joi from "joi";
import { isValidPhoneNumber } from "react-phone-number-input";

export const customPhoneNumber = Joi.extend({
  type: 'phone',
  base: Joi.string(),
  messages: {
    'phone.invalid': 'Invalid phone number',
    'phone.required': 'Phone number is required',
    'string.empty': 'Phone number is required'
  },
  validate(value, helpers) {
    if (!isValidPhoneNumber(value)) {
      return { value, errors: helpers.error('phone.invalid') };
    }
  }
});