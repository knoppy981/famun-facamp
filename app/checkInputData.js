import { postalCodes } from "./data/postal-codes";
import { isValidPhoneNumber } from 'react-phone-number-input'
import qs from 'qs'

export function validateEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	return emailRegex.test(email);
}

export function validateCpf(cpf) {
	cpf = cpf.replace(/[^0-9]/g, "")
	if (cpf.length !== 11) return false

	var Soma;
	var Resto;
	Soma = 0;
	if (cpf == "00000000000") return false;

	for (i = 1; i <= 9; i++) Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
	Resto = (Soma * 10) % 11;

	if ((Resto == 10) || (Resto == 11)) Resto = 0;
	if (Resto != parseInt(cpf.substring(9, 10))) return false;

	Soma = 0;
	for (i = 1; i <= 10; i++) Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
	Resto = (Soma * 10) % 11;

	if ((Resto == 10) || (Resto == 11)) Resto = 0;
	if (Resto != parseInt(cpf.substring(10, 11))) return false;
	return true;
}

export function validatePassword(password) {
	const digitRegex = /\d/;
	const lowercaseRegex = /[a-z]/;
	const uppercaseRegex = /[A-Z]/;
	console.log(password)

	if (digitRegex.test(password)) {
		return "invalid";
	}

	if (!lowercaseRegex.test(password)) {
		return "lowercase";
	}

	if (!uppercaseRegex.test(password)) {
		return "uppercase";
	}

	if (password.length < 8) {
		return "length";
	}

	return true;
}

export function validateBirthDate(dateString) {
	// Regular expression to match the date format 'yyyy-mm-dd'
  const pattern = /^\d{4}-\d{2}-\d{2}$/;

  if (!pattern.test(dateString)) {
    // The string didn't match the pattern, so it's not a valid date
    return false;
  }

  // Parse the date parts to integers
  const parts = dateString.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  // Check the ranges of month and year
  if (year < 1000 || year > 3000 || month === 0 || month > 12) {
    return false;
  }

  const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Adjust for leap years
  if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
    monthLength[1] = 29;
  }

  // Check the range of the day
  return day > 0 && day <= monthLength[month - 1];
}

export function validatePostalCode(postalCode, country) {

	const countryRegex = postalCodes[country];

	if (!countryRegex) {
		return true;
	}

	if (countryRegex === "") {
		return true;
	}

	if (!new RegExp(countryRegex).test(postalCode)) {
		return false;
	}

	return true
}

export function checkString(str) {
	return !/[^A-Za-zàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇ ]+/.test(str)
}

export function checkStringWithNumbers(str) {
	return !/[^A-Za-z0-9àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇ ]+/.test(str)
}

export function checkUserInputData(data) {
	// --user--
	// name
	// email
	// password
	// cpf
	// passport
	// birth date
	// phone number

	// --delegation--
	//	school name

	// --address--
	// country
	// Postal Code
	// city
	// state
	// address
	// neighborhood
	data.forEach(({ key, value, errorMessages, valuesToCompare, auxValue, dontValidate }) => {

		//console.log(key, dontValidate)
		if (dontValidate) return

		if (value === undefined || value === "" || value.length === 0) throw new Error(qs.stringify({ key: key, msg: errorMessages.undefined }))

		// check for valuesToCompare that are equal to the value
		if (valuesToCompare?.includes(value)) {
			if (key !== "confirmPassword") {
				throw new Error(qs.stringify({ key: key, msg: errorMessages.existingUser }))
			}
		} else {
			if (key === "confirmPassword") {
				throw new Error(qs.stringify({ key: key, msg: errorMessages.invalid }))
			}
		}

		if (key === "name" || key === "emergencyContactName" || key === "country" || key === "city" || key === "state" || key === "neighborhood") {
			if (!checkString(value)) throw new Error(qs.stringify({ key: key, msg: errorMessages.invalid }))
		}

		if (key === "email") {
			if (!validateEmail(value)) throw new Error(qs.stringify({ key: key, msg: errorMessages.invalid }))
		}

		if (key === "password") {
			switch (validatePassword(value)) {
				case "invalid":
					throw new Error(qs.stringify({ key: key, msg: errorMessages.invalid }))
				case "lowercase":
					throw new Error(qs.stringify({ key: key, msg: errorMessages.passwordLowerCase }))
				case "uppercase":
					throw new Error(qs.stringify({ key: key, msg: errorMessages.passwordUppercase }))
				case "length":
					throw new Error(qs.stringify({ key: key, msg: errorMessages.passwordLength }))
				case true:
					break
			}
		}

		if (key === "cpf") {
			if (!validateCpf(value)) throw new Error(qs.stringify({ key: key, msg: errorMessages.invalid }))
		}

		if (key === "passport") {
			if (value.length > 20) throw new Error(qs.stringify({ key: key, msg: errorMessages.invalid }))
		}

		if (key === "birthDate") {
			if (!validateBirthDate(value)) throw new Error(qs.stringify({ key: key, msg: errorMessages.invalid }))
		}

		if (key === "phoneNumber" || key === "emergencyContactPhoneNumber") {
			if (!isValidPhoneNumber(value)) throw new Error(qs.stringify({ key: key, msg: errorMessages.invalid }))
		}

		if (key === "schoolName" || key === "address") {
			if (!checkStringWithNumbers(value)) throw new Error(qs.stringify({ key: key, msg: errorMessages.invalid }))
		}

		if (key === "postalCode") {
			if (!validatePostalCode(value, auxValue)) throw new Error(qs.stringify({ key: key, msg: errorMessages.invalid }))
		}
	})
}