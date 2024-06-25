import bcrypt from "bcryptjs";
import qs from "qs"
import { prisma } from "~/db.server";

import type { User } from "@prisma/client";

export async function handleCheckIn(participantId: User["id"], checkIn: boolean) {
  return prisma.user.update({
    where: {
      id: participantId
    },
    data: {
      presenceControl: {
        checked: checkIn
      }
    }
  })
}

export async function changeObservation(participantId: User["id"], observation: string) {
  return prisma.user.update({
    where: {
      id: participantId
    },
    data: {
      presenceControl: {
        observation
      }
    }
  })
}