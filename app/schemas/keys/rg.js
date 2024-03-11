import Joi from "joi"

function isValidRG(rg) {
  // Example validation: RG should be 9 characters long and numeric
  const rgRegex = /^\d{9}$/;
  return true;
}

export const customRg = Joi.extend((joi) => ({
  type: 'rg',
  base: joi.string(),
  messages: {
    'rg.invalid': 'RG inválido',
		'string.empty': 'RG é necessário'
  },
  validate(value, helpers) {
    if (!isValidRG(value)) {
      return { value, errors: helpers.error('rg.invalid') };
    }
  }
}));