import { useMatches } from "@remix-run/react";
import { useMemo } from "react";

import type { User } from "@prisma/client"; 

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT,
) {
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
export function useMatchesData(
  id: string,
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id],
  );
  return route?.data as Record<string, unknown>;
}

function isUser(user: unknown): user is User {
  return (
    user != null &&
    typeof user === "object" &&
    "email" in user &&
    typeof user.email === "string"
  );
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.",
    );
  }
  return maybeUser;
}

export function useUserType(): "delegate" | "advisor" | undefined {
	const data = useMatchesData("root");
	if (!data || !data.userType) {
		throw new Error(
      "No user found in root loader, but user is required by useUserType",
    );
	}
	return data.userType as "delegate" | "advisor" | undefined;
}

export function generateString(length: number) {
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

export async function timeout(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}