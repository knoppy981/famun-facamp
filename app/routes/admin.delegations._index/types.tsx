import { Address, Delegate, Delegation, DelegationAdvisor, ParticipationMethod } from "@prisma/client";
import { UserType } from "~/models/user.server";

export type adminDelegationType = {
  id: string;
  school: string;
  participants: {
    name: string;
    stripePaydId: string | null;
    delegate: Delegate;
    delegationAdvisor: DelegationAdvisor;
    _count: {
      files: number;
    };
  }[];
  _count: {
    participants: number;
  };
}

export type modalContextType = {
  amountPaid: number,
  id?: string;
  code?: string;
  inviteLink?: string;
  school?: string;
  schoolPhoneNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
  paymentExpirationDate?: Date;
  participationMethod?: ParticipationMethod;
  address?: Address,
  participants?: (
    Partial<UserType> & {
      _count: {
        files: number;
      };
    })[],
  paymentsCount?: number,
  documentsCount?: number,
  _count?: {
    participants: number
  }
} | null