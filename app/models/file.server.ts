import { prisma } from "~/db.server";

import { UserType } from "./user.server";

import type { File } from "@prisma/client";
import { DelegationType } from "./delegation.server";

export async function getDelegationFilesDescription(delegationId: DelegationType["id"]) {
  return prisma.delegation.findUnique({
    where: {
      id: delegationId
    },
    select: {
      participants: {
        select: {
          id: true,
          name: true,
          email: true,
          nacionality: true,
          delegate: true,
          delegationAdvisor: true,
          files: {
            select: {
              name: true,
              fileName: true,
              size: true,
              createdAt: true,
            }
          }
        }
      }
    }
  })
}

export async function getFilesByUserId(userId: UserType["id"]) {
  return prisma.file.findMany({
    where: {
      userId
    },
  })
}

export async function uploadFile({ userId, stream, filename, name, size, contentType }:
  { userId: UserType["id"], stream: Buffer, filename: string | undefined, name: string, size: number, contentType: string }
) {
  if (filename === undefined) return

  return prisma.file.upsert({
    where: {
      name_userId: {
        name,
        userId
      }
    },
    update: {
      fileName: filename,
      size,
      stream
    },
    create: {
      user: {
        connect: {
          id: userId
        }
      },
      fileName: filename,
      name,
      size,
      stream,
      url: undefined,
      contentType
    },
  })
}

export async function deleteFileById(fileId: File["id"]) {
  return prisma.file.delete({
    where: {
      id: fileId
    }
  })
}

export async function getFileBuffer(fileId: File["id"]) {
  return prisma.file.findUnique({
    where: {
      id: fileId
    },
    select: {
      stream: true,
      name: true,
      contentType: true,
      user: {
        select: {
          name: true
        }
      }
    }
  })
}