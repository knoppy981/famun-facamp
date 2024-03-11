import { Languages } from "@prisma/client";
import { UserType } from "~/models/user.server";

export const defaultUser = (councils: string[]) => ({
  id: '',
  email: '',
  name: '',
  nacionality: 'Brazil',
  rg: '',
  cpf: null,
  passport: null,
  phoneNumber: '',
  birthDate: '',
  delegate: {
    emergencyContactName: '',
    emergencyContactPhoneNumber: '',
    councilPreference: councils,
    languagesSimulates: [] as Languages[]
  },
  delegationAdvisor: {
    advisorRole: 'Professor',
    facebook: '',
    instagram: '',
    linkedin: ''
  }
} as UserType)