import { ParticipationMethod } from "@prisma/client";
import { GetResult } from "@prisma/client/runtime";

export type ComitteeList = {
  id: string;
  council: string;
  type: ParticipationMethod;
  name: string;
  createdAt: Date;
  _count: {
    delegates: number;
  };
}[]
