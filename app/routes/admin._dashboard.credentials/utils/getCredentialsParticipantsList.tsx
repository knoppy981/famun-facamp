import { prisma } from "~/db.server";

import type { ParticipationMethod } from "@prisma/client";

export async function getCredentialsParticipantsList(index: number, participationMethod: ParticipationMethod, orderBy: string, searchQuery?: string) {
	let orderByObject
	type orderByType = "asc" | "desc"
	switch (orderBy) {
		case "user":
			orderByObject = { name: "asc" as orderByType }
			break;
		case "delegation":
			orderByObject = { delegation: { school: "asc" as orderByType } }
			break;
		case "createdAt":
			orderByObject = { createdAt: "asc" as orderByType }
			break;
		case "position":
			orderByObject = { delegate: { user: { name: "asc" as orderByType } } }
			break;
		default:
			orderByObject = { name: "asc" as orderByType }
			break;
	}

	const where: any = {
		participationMethod: participationMethod,
	}

	if (searchQuery) where.OR = [
		{
			name: searchQuery ? {
				contains: searchQuery,
				mode: "insensitive"
			} : undefined
		},
		{
			email: searchQuery ? {
				contains: searchQuery,
				mode: "insensitive"
			} : undefined
		}
	]

	return prisma.user.findMany({
		skip: index * 12,
		take: 12,
		where,
		include: {
			files: {
				where: {
					name: "Liability Waiver"
				},
				select: {
					name: true,
					fileName: true,
				}
			},
			delegate: true,
			delegationAdvisor: true,
			delegation: {
				select: {
					school: true,
					participants: {
						where: {
							OR: [
								{
									delegationAdvisor: {
										is: {
											userId: undefined
										}
									}
								},
								{ leader: true },
							]
						},
						orderBy: {
							createdAt: "asc"
						},
						select: {
							name: true,
							leader: true,
							delegationAdvisor: {
								select: {
									advisorRole: true
								}
							}
						}
					}
				}
			},
		},
		orderBy: orderByObject,
	})
}