import bcrypt from "bcryptjs"

export async function generatePassword(): Promise<[string, string]> {
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

  let hash = await bcrypt.hash(password, 10)

	return [hash, password];
}