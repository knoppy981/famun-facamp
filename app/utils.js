import { useMatches } from "@remix-run/react";
import { useMemo } from "react";
import { postalCodes } from "./data/postal-codes";
import { isValidPhoneNumber } from 'react-phone-number-input'
import qs from 'qs'

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(to, defaultRedirect = DEFAULT_REDIRECT) {
	if (!to || typeof to !== "string") {
		return defaultRedirect;
	}

	if (!to.startsWith("/") || to.startsWith("//")) {
		return defaultRedirect;
	}

	return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(id) {
	const matchingRoutes = useMatches();
	const route = useMemo(
		() => matchingRoutes.find((route) => route.id === id),
		[matchingRoutes, id]
	);

	return route?.data;
}

function isUser(user) {
	return user && typeof user === "object" && typeof user.email === "string";
}

export function useOptionalUser() {
	const data = useMatchesData("root");
	if (!data || !isUser(data.user)) {
		return undefined;
	}
	return data.user;
}

export function useUser() {
	const maybeUser = useOptionalUser();
	if (!maybeUser) {
		throw new Error("No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.");
	}
	return maybeUser;
}

export function useUserType() {
	const data = useMatchesData("root");
	if (!data || !data.userType) {
		return undefined;
	}
	return data.userType;
}

export function generateString(length) {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

	let result = '';
	const charactersLength = characters.length;

	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}

	return result;
}

export function generatePassword() {
	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	const numbers = '0123456789';
	const specialChars = '!@#$%^&*_-+=';

	let password = '';

	// Generate random characters
	for (let i = 0; i < 6; i++) {
		let randomIndex = Math.floor(Math.random() * letters.length);
		password += letters[randomIndex];
	}

	for (let i = 0; i < 2; i++) {
		let randomIndex = Math.floor(Math.random() * numbers.length);
		password += numbers[randomIndex];
	}

	password += specialChars[Math.floor(Math.random() * specialChars.length)];

	return password;
}

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
	const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

	if (!dateRegex.test(dateString)) {
		return false;
	}

	const [day, month, year] = dateString.split("/");
	const parsedDate = new Date(`${year}-${month}-${day}T00:00:00`);

	const isValidDate =
		parsedDate.getDate() == day &&
		parsedDate.getMonth() + 1 == month &&
		parsedDate.getFullYear() == year;

	if (!isValidDate) {
		return false;
	}

	return true;
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
	// typeof data array
	// key, value, errorMessages, valuesToCompare, auxValue

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

		// only value to not throw error if equal is confirm password
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