const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient();

async function seed() {

	/* const user1 = await prisma.user.create({
		data: {
			name: "Andre Knopp Guimaraes",
			birthDate: "23/06/2003",
			cpf: "51207021806",
			rg: "584609097",
			email: "andre.knopp8@gmail.com",
			phoneNumber: "+55 (19) 97154-7424",
			password: {
				create: {
					hash: await bcrypt.hash("dede5562", 10)
				}
			}
		}
	})

	const user2 = await prisma.user.create({
		data: {
			name: "Ciclano de Fulano",
			birthDate: "23/06/2003",
			cpf: "11122233344",
			rg: "112223334",
			email: "teste@gmail.com",
			phoneNumber: "+55 (19) 97154-7424",
			password: {
				create: {
					hash: await bcrypt.hash("teste123", 10)
				}
			}
		}
	})

	const delegation = await prisma.delegation.create({
		data: {
			code: "123456",
			school: "Colégio Notre Dame Campinas",
			schoolPhoneNumber: "+55 (19) 97866-7676",
			participationMethod: "Presential",
			address: {
				create: {
					neighborhood: "Cambuí",
					city: "Campinas",
					State: "SP",
					cep: "12099522",
					country: "Brasil",
				}
			},
			delegationLeader: {
				connect: {
					id: user2.id
				}
			}
		}
	})

	await prisma.delegation.update({
		where: {
			id: delegation.id
		},
		data: {
			delegate: {
				create: {
					councilPreference: "AssembleiaGeralOnu",
					user: {
						connect: {
							id: user1.id
						}
					}
				}
			},
			delegationAdvisor: {
				create: {
					advisorRole: "Professor",
					user: {
						connect: {
							id: user2.id
						}
					}
				}
			}
		}
	}) */

	const obj = { name: 'Andre Knopp Guimaraess', birthDate: '23/06/2001' }

	await prisma.user.findFirst({
		where: {
			OR: [
				{
					
				}
			]
		}
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
