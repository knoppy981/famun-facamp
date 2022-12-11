const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

async function seed() {

	/* await prisma.user.delete({ where: { email: "andre.knopp8@gmail.com" } }).catch(err => { console.log('no user found') })
	await prisma.user.delete({ where: { email: "teste@gmail.com" } }).catch(err => { console.log('no user found') })

	await prisma.delegation.delete({ where: { code: "123456" } }).catch(err => { console.log('no delegation found') })

	const user1 = await prisma.user.create({
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
			},
			nacionality: "Brasil",
			delegate: {
				create: {
					councilPreference: "Assembleia_Geral_da_ONU",
					languagesSimulates: {
						createMany: {
							data: [
								{ language: "Portugues" },
								{ language: "Espanhol" },
								{ language: "Ingles" },
							]
						}
					}
				}
			},
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
			},
			nacionality: "Brasil",
			delegationAdvisor: {
				create: {
					advisorRole: "Professor",
					socialMedia: {
						createMany: {
							data: [
								{ socialMediaName: "Facebook", username: "ciclano99" },
								{ socialMediaName: "Instagram", username: "ciclano99" },
							]
						}
					}
				}
			}
		}
	})

	const asd = await prisma.delegation.findUnique({where: {code: "123456"}})
	console.log(asd)

	const { JSON_WEB_TOKEN_SECRET } = process.env;

	const token = jwt.sign(
		{ delegationCode: "123456" },
		JSON_WEB_TOKEN_SECRET,
		{ expiresIn: 60 * 60 }
	);


	const delegation = await prisma.delegation.create({
		data: {
			code: "123456",
			inviteLink: `http://localhost:3000/i/${token}`,
			school: "Colégio Notre Dame Campinas",
			schoolPhoneNumber: "+55 (19) 97866-7676",
			participationMethod: "Presencial",
			address: {
				create: {
					neighborhood: "Cambuí",
					city: "Campinas",
					state: "SP",
					address: "Rua Elviro",
					cep: "12099522",
					country: "Brasil",
				}
			},
			participants: {
				connect: [
					{ id: user1.id },
					{ id: user2.id },
				]
			}
		}
	}) */

	return prisma.delegation.update({
		where: {
			code: code
		},
		data: {
			inviteLink: ""
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
