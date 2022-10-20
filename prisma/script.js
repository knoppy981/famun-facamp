const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient();

async function seed() {
	const email = ""
	const rg = 000000000
	const cpf = 49437463816
	const delegationName = "Delegação do Paraguay"

	await prisma.user.deleteMany({
		where: {
			
		},
	})

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
