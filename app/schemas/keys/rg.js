import Joi from "joi"

function isValidRG(rg) {
  // Example validation: RG should be 9 characters long and numeric
  const rgRegex = /^\d{9}$/;
  return rgRegex.test(rg);
}

export const customRg = Joi.extend((joi) => ({
  type: 'rg',
  base: joi.string(),
  messages: {
    'rg.invalid': 'Invalid RG',
		'string.empty': 'RG is required'
  },
  validate(value, helpers) {
    if (!isValidRG(value)) {
      return { value, errors: helpers.error('rg.invalid') };
    }
  }
}));