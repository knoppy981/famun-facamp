export function formatDate(inputDate: string) {
	const dateObj = new Date(inputDate);
	const day = String(dateObj.getDate()).padStart(2, '0');
	const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JavaScript
	const year = dateObj.getFullYear();

	return `${day}/${month}/${year}`;
}