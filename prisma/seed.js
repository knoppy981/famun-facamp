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
			maxParticipants: 10,
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
				sex: "Masculino",
				password: {
					create: {
						hash: await bcrypt.hash("Teste123", 10)
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
			sex: "Masculino",
			password: {
				create: {
					hash: await bcrypt.hash("Dede5562", 10)
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
					educationLevel: "Escola",
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
			sex: "Feminino",
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
			school: "Colégio Teste 123",
			schoolPhoneNumber: "+55 19 97866 7676",
			participationMethod: "Escola",
			maxParticipants: 5,
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

async function postponePaymentExpiration(code) {
	await prisma.delegation.update({
		where: {
			code: code
		},
		data: {
			paymentExpirationDate: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
		}
	})
}

async function createAdmin() {
	/* 	await prisma.admin.delete({ where: { email: "admin@famun.com" } }).catch(err => { console.log('no admin found') })
		await prisma.configuration.delete({ where: { name: "default" } }).catch(err => { console.log('no configuration found') })
	
		const admin = await prisma.admin.create({
			data: {
				email: "admin@famun.com",
				password: "Teste123"
			}
		})
	
		const basicConifuration = await prisma.configuration.create({
			data: {
				name: "default",
				precoDelegadoEnsinoMedio: 16000,
				precoDelegadoUniversidade: 16000,
				precoProfessorOrientador: 16000,
				precoDelegadoInternacional: 16000,
				precoFacultyAdvisors: 16000,
				coupons: {
					code: "MUNPARTNER50",
					type: "Universidade"
				},
				conselhosEscolas: [
					"United Nations Security Council - Inglês",
					"Conselho de Segurança da ONU - Português",
					"United Nations Environment Assembly - Inglês",
					"Assembleia do Meio Ambiente da ONU - Português"
				],
				conselhosUniversidades: [
					"Consejo de Seguridad de las Naciones Unidas - Espanhol",
					"United Nations Environment Assembly - Inglês"
				],
				representacoesExtras: [
					"Unicef",
					"Vietnamitas"
				]
			}
		}) */

	await prisma.configuration.update({
		where: {
			name: "default"
		},
		data: {
			allowParticipantsChangeData: true,
			allowParticipantsPayments: true,
			allowParticipantsSendDocuments: true
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
				maxParticipants: 10,
				participationMethod: /* i % 2 === 0 */true ? "Escola" : "Universidade",
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

async function createXParticipants(max) {
	for (let i = 0; i < max; i++) {
		await prisma.user.delete({ where: { email: `testxxx${i}@gmail.com` } }).catch(err => { console.log('no delegation found') })

		await prisma.user.create({
			data: {
				name: `user ${i + 1}`,
				birthDate: "2003-06-23",
				rg: `11.111.981-${i + 1}`,
				email: `testxxx${i}@gmail.com`,
				phoneNumber: "+55 19 97154 7424",
				participationMethod: "Universidade",
				sex: "Masculino",
				password: {
					create: {
						hash: await bcrypt.hash("Teste123", 10)
					}
				},
				nacionality: "Brazil",
				leader: i === 0,
				delegation: {
					connect: {
						code: "112331"
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
	}
}

async function create10Participants(delegationCode) {
	function generateString(length) {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

		let result = '';
		const charactersLength = characters.length;

		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}

		return result;
	}

	for (let i = 0; i < 10; i++) {
		const str = generateString(10)

		await prisma.user.delete({ where: { email: `${str}@gmail.com` } }).catch(err => { })

		await prisma.user.create({
			data: {
				name: str,
				birthDate: "2003-06-23",
				rg: str,
				email: `${str}@gmail.com`,
				phoneNumber: "+55 19 97154 7424",
				participationMethod: "Escola",
				sex: "Masculino",
				password: {
					create: {
						hash: await bcrypt.hash("asdasdasd", 10)
					}
				},
				nacionality: "Brazil",
				leader: false,
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
						code: delegationCode
					}
				}
			}
		})
	}
}

async function seed() {
	// await delegationWith2Users()

	// await delegationWith10Delegates()

	// await postponePaymentExpiration("111111")

	// await createAdmin()

	await createXDelegations(1)

	await createXParticipants(30)

	// await create10Participants("012331")

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
