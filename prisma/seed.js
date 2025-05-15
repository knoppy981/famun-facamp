import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

async function seed() {
	await prisma.admin.delete({ where: { email: "famun@facamp.com.br" } }).catch((error) => console.log("No user found!"))

	await prisma.admin.create({
		data: {
			email: "famun@facamp.com.br",
			hash: await bcrypt.hash("Teste123", 10)
		}
	})

  await prisma.configuration.create({
    data: {
      name: "default",
      precoDelegadoEnsinoMedio: 18000,
      precoDelegadoInternacional: 18000,
      precoDelegadoUniversidade: 18000,
      precoFacultyAdvisors: 18000,
      precoProfessorOrientador: 18000,
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
