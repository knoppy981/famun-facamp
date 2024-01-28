import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

async function delegationWith10Delegates() {
	await prisma.delegation.delete({ where: { code: "111111" } }).catch(err => { console.log('no delegation found') })

	const { JSON_WEB_TOKEN_SECRET } = process.env;

	const token = jwt.sign(
		{ delegationCode: "111111" },
		JSON_WEB_TOKEN_SECRET,
		{ expiresIn: 90 * 24 * 60 * 60 }
	);

	const delegation = await prisma.delegation.create({
		data: {
			code: "111111",
			inviteLink: `http://localhost:3000/i/${token}`,
			school: "teste",
			schoolPhoneNumber: "+55 19 97866 7676",
			participationMethod: "Escola",
			paymentExpirationDate: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
			address: {
				create: {
					city: "Campinas",
					state: "SP",
					address: "Rua Elviro",
					postalCode: "12099522",
					country: "Brasil",
				}
			},
		}
	})

	for (let i = 0; i < 10; i++) {
		await prisma.user.delete({ where: { email: `user${i + 1}@gmail.com` } }).catch(err => { })

		await prisma.user.create({
			data: {
				name: `user ${i + 1}`,
				birthDate: "2003-06-23",
				rg: `11.111.111-${i + 1}`,
				email: `user${i + 1}@gmail.com`,
				phoneNumber: "+55 19 97154 7424",
				participationMethod: "Escola",
				password: {
					create: {
						hash: await bcrypt.hash("Dede5562", 10)
					}
				},
				nacionality: "Brazil",
				leader: i === 0,
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
							set: ["Ingles", "Espanhol"]
						},
						emergencyContactName: "Julia",
						emergencyContactPhoneNumber: "+55 11 99877 2333",
						educationLevel: "Universidade",
						currentYear: "4 ano"
					}
				},
				delegation: {
					connect: {
						id: delegation.id
					}
				}
			}
		})
	}
}

async function delegationWith2Users() {
	await prisma.user.delete({ where: { email: "andre.knopp8@gmail.com" } }).catch(err => { console.log('no user found') })
	await prisma.user.delete({ where: { email: "teste@gmail.com" } }).catch(err => { console.log('no user found') })
	await prisma.delegation.delete({ where: { code: "123456" } }).catch(err => { console.log('no delegation found') })

	const user1 = await prisma.user.create({
		data: {
			name: "Andre Knopp Guimaraes",
			birthDate: "2003-06-23",
			cpf: "512.070.218-06",
			rg: "58.460.909-7",
			email: "andre.knopp8@gmail.com",
			phoneNumber: "+55 19 97154 7424",
			participationMethod: "Escola",
			password: {
				create: {
					hash: await bcrypt.hash("dede5562", 10)
				}
			},
			nacionality: "Brazil",
			leader: true,
			foodRestrictions: {
				create: {
					allergy: true,
					allergyDescription: "Intolerante a lactose",
					diet: "vegan"
				}
			},
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
						set: ["Ingles", "Espanhol"]
					},
					emergencyContactName: "Julia",
					emergencyContactPhoneNumber: "+55 11 99877 2333",
					educationLevel: "Universidade",
					currentYear: "4 ano"
				}
			},
		}
	})

	const user2 = await prisma.user.create({
		data: {
			name: "Ciclano de Fulano",
			birthDate: "2003-06-23",
			passport: "98230129",
			email: "teste@gmail.com",
			phoneNumber: "+55 19 97154 7424",
			participationMethod: "Escola",
			password: {
				create: {
					hash: await bcrypt.hash("teste123", 10)
				}
			},
			nacionality: "Germany",
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
		{ expiresIn: 90 * 24 * 60 * 60 }
	);

	const delegation = await prisma.delegation.create({
		data: {
			code: "123456",
			inviteLink: `http://localhost:3000/i/${token}`,
			school: "Colégio Notre Dame Campinas",
			schoolPhoneNumber: "+55 19 97866 7676",
			participationMethod: "Escola",
			paymentExpirationDate: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
			address: {
				create: {
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
}

async function postponePaymentExpiration() {
	await prisma.delegation.update({
		where: {
			code: "123456"
		},
		data: {
			paymentExpirationDate: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
		}
	})
}

async function createAdmin() {
	const admin = await prisma.admin.create({
		data: {
			email: "admin@famun.com",
			password: "Dede5562"
		}
	})
}

async function createXDelegations(max) {
	const { JSON_WEB_TOKEN_SECRET } = process.env;

	for (let i = 0; i < max; i++) {
		await prisma.delegation.delete({ where: { school: `teste ${i}` } }).catch(err => { console.log('no delegation found') })

		const delegationCode = i > 9 ? `${i}1331` : `${i}12331`

		const token = jwt.sign(
			{ delegationCode },
			JSON_WEB_TOKEN_SECRET,
			{ expiresIn: 90 * 24 * 60 * 60 }
		);

		await prisma.delegation.create({
			data: {
				code: delegationCode,
				inviteLink: `http://localhost:3000/i/${token}`,
				school: `teste ${i}`,
				schoolPhoneNumber: "+55 19 97866 7676",
				participationMethod: /* i % 2 === 0 */false ? "Escola" : "Universidade",
				paymentExpirationDate: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
				address: {
					create: {
						city: "Campinas",
						state: "SP",
						address: "Rua Elviro",
						postalCode: "12099522",
						country: "Brasil",
					}
				},
			}
		})
	}
}

async function seed() {
	// await delegationWith2Users()

	// await delegationWith10Delegates()

	// await postponePaymentExpiration()

	// await createAdmin()

	// await createXDelegations(20)

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
