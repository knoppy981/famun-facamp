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
			document: {
				documentName: "cpf",
				value: "512.070.218-06"
			},
			email: "andre.knopp8@gmail.com",
			phoneNumber: "+55 19 97154 7424",
			password: {
				create: {
					hash: await bcrypt.hash("dede5562", 10)
				}
			},
			nacionality: "Brasil",
			leader: true,
			delegate: {
				create: {
					councilPreference: {
						set: [
							"Assembleia_Geral_da_ONU",
							"Rio_92",
							"Conselho_de_Seguranca_da_ONU",
							"Conselho_de_Juventude_da_ONU",
						]
					},
					languagesSimulates: {
						set: ["Alemao", "Mandarin"]
					},
					emergencyContactName: "Julia",
					emergencyContactPhoneNumber: "+55 11 99877 2333"
				}
			},
		}
	})

	const user2 = await prisma.user.create({
		data: {
			name: "Ciclano de Fulano",
			birthDate: "23/06/2003",
			document: {
				documentName: "cpf",
				value: "123.123.123-23"
			},
			email: "teste@gmail.com",
			phoneNumber: "+55 19 97154 7424",
			password: {
				create: {
					hash: await bcrypt.hash("teste123", 10)
				}
			},
			nacionality: "Brasil",
			delegationAdvisor: {
				create: {
					advisorRole: "Professor",
					facebook: "Tinto",
					instagram: "Jose",
					linkedin: "Jose Alvarenga"
				}
			}
		}
	})

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
			schoolPhoneNumber: "+55 19 97866 7676",
			participationMethod: "Presencial",
			address: {
				create: {
					neighborhood: "Cambuí",
					city: "Campinas",
					state: "SP",
					address: "Rua Elviro",
					postalCode: "12099522",
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
	})

	await prisma.user.update({
		where: {
			email: "andre.knopp8@gmail.com"
		},
		data: {
			file: {
				create: {
					url: "https://www.hhsjjd.com/djkhsjjjs3298923",
					fileName: "ComprovanteVacinacaoAndreKnoppGuimaraes_2023_11_10.jpeg",
				}
			}
		}
	}) */

	const aaa = await prisma.delegation.create({
		data: {
			participants: {
				connect: {
					
				}
			}
		}
	})

	console.log(aaa)

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
