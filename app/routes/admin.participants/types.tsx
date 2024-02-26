import { AdvisorRole } from "@prisma/client";

export type ParticipantType = {
  id: string;
  name: string;
  delegation: {
    school: string;
  } | null;
  createdAt: Date;
  delegationAdvisor: {
    id: string;
    userId: string;
    advisorRole: AdvisorRole;
    facebook: string | null;
    instagram: string | null;
    linkedin: string | null;
  }
}