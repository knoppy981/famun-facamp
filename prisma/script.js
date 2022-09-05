const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient();

async function seed() {
	const email = "andre.knopp8@gmail.com"
	const delegationName = "Delegação do Paraguay"

	await prisma.user.delete({ where: { email } }).catch(() => { })
	await prisma.delegation.delete({ where: { name: delegationName } }).catch(() => { })

	const hashedPassword = await bcrypt.hash("dede5562", 10);

	await prisma.user.create({
		data: {
			name: "André Knopp Guimarães",
			email: email,
			password: {
				create: {
					hash: hashedPassword,
				}
			},
			cpf: 51207021806,
			rg: 584609097,
			country: "Brasil",
			dateOfBirth: "23062003",
			phoneNumber: "19971547424",
			delegation: {
				create: {
					name: delegationName
				}
			}
		},
	});

	const ladelegation = await prisma.user.findUnique({
		where: {
			email: email,
		},
		select: {
			delegation:	{
				include: {
					users: true
				}
			}
		}
	})

	console.log(ladelegation.delegation.users)
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
