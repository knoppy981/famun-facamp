import Joi from "joi";

function isValidCpf(cpf) {
	cpf = cpf.replace(/[^0-9]/g, "")
	if (cpf.length !== 11) return false

	let Soma;
	let Resto;
	Soma = 0;
	if (cpf == "00000000000") return false;

	for (let i = 1; i <= 9; i++) Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
	Resto = (Soma * 10) % 11;

	if ((Resto == 10) || (Resto == 11)) Resto = 0;
	if (Resto != parseInt(cpf.substring(9, 10))) return false;

	Soma = 0;
	for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
	Resto = (Soma * 10) % 11;

	if ((Resto == 10) || (Resto == 11)) Resto = 0;
	if (Resto != parseInt(cpf.substring(10, 11))) return false;
	return true;
}

export const customCpf = Joi.extend({
	type: 'cpf',
	base: Joi.string(),
	messages: {
		'cpf.invalid': 'CPF inválido',
		'any.required': "CPF obrigatório"
	},
	validate(value, helpers) {
		if (!isValidCpf(value)) {
			return { value, errors: helpers.error('cpf.invalid') };
		}
	}
});
