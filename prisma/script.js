const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient();

async function seed() {
	const email = "andre.knopp8@gmail.com"
	const name = "andre"

	await prisma.user.delete({ where: { email } }).catch(() => {})

	const hashedPassword = await bcrypt.hash("racheliscool", 10);

	const user = await prisma.user.create({
		data: {
			name: name,
			email: email,
			password: hashedPassword,
		},
	});

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
