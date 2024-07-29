import { prisma } from "~/db.server";

export async function checkJoinAuthenticationCode(code: string) {
  const config = await prisma.configuration.findUnique({
    where: {
      name: "default"
    },
    select: {
      generatedJoinAuthentication: {
        select: {
          code: true
        }
      }
    }
  })

  return config?.generatedJoinAuthentication.find(item => item.code === code) ? true : false
}