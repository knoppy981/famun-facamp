import { Council, Languages } from "@prisma/client";
import { UserType } from "~/models/user.server";

export const defaultUser = {
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
    councilPreference: [
      'Conselho_de_Seguranca_da_ONU',
      'Rio_92',
      'Assembleia_Geral_da_ONU',
      'Conselho_de_Juventude_da_ONU'
    ] as Council[],
    languagesSimulates: [] as Languages[]
  },
  delegationAdvisor: {
    advisorRole: 'Professor',
    facebook: '',
    instagram: '',
    linkedin: ''
  }
} as UserType