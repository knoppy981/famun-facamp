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

	/* const name = "Roger Roger"
	const email = "roger@gmail.com"
	const password = "teste123"
	const cpf = "12312312312"
	const rg = "121231231"
	const birthDate = "23/06/2003"
	const phoneNumber = "1997154-7424"
	const userType = "delegate"

	const data = {
		Facebook: "asdasdasd",
		Instagram: "123123123",
		Linkedin: "lkjlkjlkj"
	}

	await prisma.user.delete({
		where: {
			email: email
		}
	}).catch(() => { })


	const asdasd = {
		create: {
			councilPreference: "Assembleia_Geral_da_ONU",
			languagesSimulates: {
				createMany: {
					data: [
						{ language: "portuguese" },
						{ language: "english" }
					]
				}
			}
		}
	}

	let auxArray1 = []
	const sasdasd = {
		create: {
			advisorRole: "Professor",
			socialMedia: {
				createMany: {
					data: [
						data.Facebook ? { socialMediaName: "Facebook", username: data.Facebook } : undefined,
						data.Instagram ? { socialMediaName: "Instagram", username: data.Instagram } : undefined,
						data.Linkedin ? { socialMediaName: "Linkedin", username: data.Linkedin } : undefined,
					]
				}
			}
		}
	}

	const user = await prisma.user.create({
		data: {
			name: name,
			email: email,
			password: {
				create: {
					hash: await bcrypt.hash(password, 10)
				}
			},
			cpf: cpf,
			rg: rg,
			birthDate: birthDate,
			phoneNumber: phoneNumber,
			delegate: userType === "delegate" ? asdasd : undefined,
			delegationAdvisor: userType === "advisor" ? sasdasd : undefined,
		}
	})

	const delegation = await prisma.delegation.update({
		where: {
			code: "123456"
		},
		data: {
			delegate: userType === "delegate" ? {
				connect: {
					userId: user.id
				}
			} : undefined,
			delegationAdvisor: userType === "delegate" ? {
				connect: {
					userId: user.id
				}
			} : undefined,
		}
	})

	console.log(user) */

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
