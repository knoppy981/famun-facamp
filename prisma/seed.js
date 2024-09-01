import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// Function to generate a list of unique 8-digit numeric IDs
function generateUniqueNumericIds(count) {
	const numericIds = new Set();

	// Generate IDs until we have the desired count
	while (numericIds.size < count) {
		const numericId = Math.floor(10000000 + Math.random() * 90000000);
		numericIds.add(numericId);
	}

	return Array.from(numericIds);
}

async function assignNumericIds() {
	// Find users that need a numeric ID
	const usersWithoutNumericId = await prisma.user.findMany({
		where: {
			numericId: undefined
		},
		select: {
			id: true,
			numericId: true
		}
	});

	const totalUsers = usersWithoutNumericId.length;

	if (totalUsers === 0) {
		console.log('No users need numeric IDs.');
		return;
	} else {
		console.log(usersWithoutNumericId)
	}

	// Generate a list of unique numeric IDs
	let uniqueNumericIds = generateUniqueNumericIds(totalUsers);

	// Assign IDs to users using a transaction
	try {
		await prisma.$transaction(
			usersWithoutNumericId.map((user, index) => {
				return prisma.user.update({
					where: { id: user.id },
					data: { numericId: uniqueNumericIds[index] },
				});
			})
		);

		console.log('All numeric IDs assigned successfully.');
	} catch (error) {
		console.error('Error assigning numeric IDs:', error);
	}
}

async function seed() {
	// await assignNumericIds()

	console.log(await prisma.user.findMany({
		select: {
			name: true,
			numericId: true,
		}
	}))

	console.log(`Database has been seeded. 🌱`);
}

seed()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
