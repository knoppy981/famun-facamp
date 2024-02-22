import { ParticipationMethod } from "@prisma/client";
import { prisma } from "~/db.server";

export async function checkCuponCode(code: string, type: ParticipationMethod) {
  const coupons = await prisma.paymentConfiguration.findUnique({
    where: {
      name: "default"
    },
    select: {
      coupons: true
    }
  })

  if (coupons === null) return false

	return coupons.coupons.some(coupon => coupon.code === "MUNPARTNER50" && coupon.type === "Universidade");
}