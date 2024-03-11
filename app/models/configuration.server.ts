import { ParticipationMethod } from "@prisma/client";
import { prisma } from "~/db.server";

export async function checkCuponCode(code: string, type: ParticipationMethod) {
  const configuration = await prisma.configuration.findUnique({
    where: {
      name: "default"
    },
    select: {
      coupons: true
    }
  })

  if (configuration === null) return false

  return configuration.coupons.some(coupon => coupon.code === code && coupon.type === type);
}

export async function getPaymentPrices() {
  return prisma.configuration.findUnique({
    where: {
      name: "default"
    },
    select: {
      precoDelegadoEnsinoMedio: true,
      precoDelegadoInternacional: true,
      precoDelegadoUniversidade: true,
      precoFacultyAdvisors: true,
      precoProfessorOrientador: true,
    }
  })
}

export async function getCouncils(participationMethod: "Escola" | "Universidade") {
  const config = await prisma.configuration.findUnique({
    where: {
      name: "default"
    },
    select: {
      conselhosEscolas: participationMethod === "Escola",
      conselhosUniversidades: participationMethod === "Universidade",
    }
  })

  return participationMethod === "Escola" ? config?.conselhosEscolas : config?.conselhosUniversidades
}