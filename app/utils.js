import { useMatches } from "@remix-run/react";
import { useMemo } from "react";

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

export function prioritizeUser(users, id) {
  // Find the index of the user with the provided id
  const userIndex = users.findIndex(user => user.id === id);

  if (userIndex === -1) {
    // If the user isn't found, return the original array
    return users;
  }

  // Remove the user from their current position
  const user = users.splice(userIndex, 1)[0];

  // Insert the user at the beginning of the array
  users.unshift(user);

  return users;
}

export function formatDate(inputDate) {
  const dateObj = new Date(inputDate);
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JavaScript
  const year = dateObj.getFullYear();

  return `${day}/${month}/${year}`;
}

export function isValidCpf(cpf) {
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

export class ValidationError extends Error {
  constructor(message, details) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}