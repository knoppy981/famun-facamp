import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

async function seed() {
	/* await prisma.admin.delete({ where: { email: "admin@famun.com" } }).catch((error) => console.log("No user found!"))

	await prisma.admin.create({
		data: {
			email: "famun@facamp.com.br",
			hash: await bcrypt.hash("Teste123", 10)
		}
	}) */

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
