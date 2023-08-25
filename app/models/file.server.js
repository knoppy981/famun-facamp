import { prisma } from "~/db.server";

export async function getDelegationParticipantsFilesById(delegationId) {
  return prisma.delegation.findUnique({
    where: {
      id: delegationId
    },
		select: {
			participants: {
				select: {
					id: true,
					name: true,
					file: true,
				}
			}
		}
  })
}

export async function createFile() {
  // send file to some API
  // get the image url
  // update db with url and file name
}