export class ValidationError extends Error {
	details: any;
	constructor(message: string, details: any) {
		super(message);
		this.name = 'ValidationError';
		this.details = details;
	}
}

export function getCorrectErrorMessage(error: any) {
	// the error message of joi contains the detail object by default
	let scope = error.details[0]
	let x = 0

	/* 
	however if there is an alternatives().try() error another detail object is created inside the detail of the error.
	this loop goes on when there are nested alternatives().try() in a validation and the error shows up in the last 
	alternatives().try().
	so we want to extract the real error inside the details object independent of how long the nested alternatives().try() error
	details are there
	*/

	// we check if there are details in the error (it is still an alternatives().try() error)
	while (scope.context.details !== undefined) {
		let isScopeChanged = false

		// iterate over each error detail in the details object, if there is a nested alternatives().try() error details in there
		// update the scope variable to the next details object
		for (var i = 0; i < scope.context.details.length; i++) {
			let y = scope.context.details[i]
			if (typeof y.context.details === "object") {
				isScopeChanged = true
				scope = y
				break
			}
		}

		// if scope has not been changed, that means that it didn't find another details nested object so we break the loop
		if (!isScopeChanged) {
			scope = scope.context.details.find((detail: any) => detail.type !== 'object.unknown')
		}

		x = x + 1
		if (x > 10) break
	}

	// sometimes errors needs to be separated in groups
	const errorGrouping = [
		["PersonalDataError", "name", "email", "phoneNumber", "birthDate", "nacionality", "value"],
		["EmergencyContactDataError", "emergencyContactName", "emergencyContactPhoneNumber"],
		["AdvisorRoleError", "advisorRole"],
		["CouncilPreferenceError"],
		["LanguageDataError", "languagesSimulates"],
		["SocialMediaDataError", "instagram", "facebook", "linkedin"]
	]

	// find which group the error belongs
	const group = errorGrouping
		.map((item) => (item.includes(scope.context.key) ? item[0] : undefined))
		.filter(item => item !== undefined)?.[0]

	// error.details[0].context.key, error.details[0].message
	return [scope.context.key, scope.message, group, scope.path]
}