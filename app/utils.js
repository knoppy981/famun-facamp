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
		throw new Error(
			"No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
		);
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

export function validateEmail(email) {
	return typeof email === "string" && email.length > 3 && email.includes("@");
}

export function validatePhoneNumber(phoneNumber) {
	phoneNumber = phoneNumber.replace(/\D/g, '');

	if (!(phoneNumber.length >= 10 && phoneNumber.length <= 11)) return false;

	if (phoneNumber.length == 11 && parseInt(phoneNumber.substring(2, 3)) != 9) return false;

	for (var n = 0; n < 10; n++) {
		if (phoneNumber == new Array(11).join(n) || phoneNumber == new Array(12).join(n)) return false;
	}

	var codigosDDD =
		[11, 12, 13, 14, 15, 16, 17, 18, 19,
			21, 22, 24, 27, 28, 31, 32, 33, 34,
			35, 37, 38, 41, 42, 43, 44, 45, 46,
			47, 48, 49, 51, 53, 54, 55, 61, 62,
			64, 63, 65, 66, 67, 68, 69, 71, 73,
			74, 75, 77, 79, 81, 82, 83, 84, 85,
			86, 87, 88, 89, 91, 92, 93, 94, 95,
			96, 97, 98, 99];

	if (codigosDDD.indexOf(parseInt(phoneNumber.substring(0, 2))) == -1) return false;

	return true;
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

export function checkString(str) {
	return !/[^A-Za-zàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇ ]+/.test(str)
}

export function checkStringWithNumbers(str) {
	return !/[^A-Za-z0-9àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇ ]+/.test(str)
}

export function createNestedObject(base, names) {
	for (var i = 0; i < names.length; i++) {
		base = base[names[i]] = base[names[i]] || {};
		console.log(base)
	}
};