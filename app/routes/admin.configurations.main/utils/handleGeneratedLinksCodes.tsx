import { ParticipationMethod } from "@prisma/client";
import { prisma } from "~/db.server";
import { generateString } from "~/utils";
import jwt from "jsonwebtoken";

export async function createNewJoinAuthentication(linkName: string) {
  const { JSON_WEB_TOKEN_SECRET, WEBSITE_URL } = process.env;
  const expiresIn = 7 * 24 * 60 * 60 * 1000
  let code = generateString(6)

	const token = jwt.sign(
		{ code },
		JSON_WEB_TOKEN_SECRET as jwt.Secret,
		{ expiresIn }
	);

  const searchParams = new URLSearchParams([["token", token]]);
  const now = new Date()


  const newJoinAuthentication = {
    name: linkName,
    code,
    expiresAt: new Date(now.getTime() + expiresIn),
    link: `${WEBSITE_URL}/join?${searchParams}`
  }

  await prisma.configuration.update({
    where: {
      name: "default"
    },
    data: {
      generatedJoinAuthentication: {
        push: newJoinAuthentication
      }
    }
  })

  return newJoinAuthentication
}

export async function deleteJoinAuthenticationItem(code: string) {
  return prisma.configuration.update({
    where: {
      name: "default"
    },
    data: {
      generatedJoinAuthentication: {
        deleteMany: {
          where: {
            code
          }
        }
      }
    }
  })
}