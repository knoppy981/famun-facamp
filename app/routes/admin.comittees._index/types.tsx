import { Council, ParticipationMethod } from "@prisma/client";
import { GetResult } from "@prisma/client/runtime";

export type ComitteeList = {
  id: string;
  council: Council;
  type: ParticipationMethod;
  name: string;
  createdAt: Date;
  _count: {
    delegates: number;
  };
}[]
