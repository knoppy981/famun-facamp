import { ParticipationMethod } from "@prisma/client";
import { prisma } from "~/db.server";

export async function checkCuponCode(code: string, type: ParticipationMethod) {
  const paymentConfiguration = await prisma.paymentConfiguration.findUnique({
    where: {
      name: "default"
    },
    select: {
      coupons: true
    }
  })

  if (paymentConfiguration === null) return false

  return paymentConfiguration.coupons.some(coupon => coupon.code === code && coupon.type === type);
}