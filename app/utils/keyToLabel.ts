const keyToLabelList = {
  email: "E-mail",
  name: "Nome",
  password: "Senha",
  cpf: "CPF",
  rg: "RG",
  passport: "Passaporte",
  phoneNumber: "Telefone",
  birthDate: "Data de nascimento",
  diet: "Dieta",
  allergy: "Alergia",
  allergyDescription: "Descrição da alergia",
  emergencyContactName: "Nome do Contato de Emergencia",
  emergencyContactPhoneNumber: "Telefone do Contato de Emergencia",
  educationLevel: "Nível Educacional",
  currentYear: "Ano em que está cursando",
  councilPreference: "Preferència de Conselho",
  languagesSimulates: "Idiomas que pode simular",
  advisorRole: "Posição do Orientador",
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "Linkedin",
  address: "Endereço",
  city: "Cidade",
  state: "Estado",
  postalCode: "Código Postal",
  country: "País"
}

export default function keyToLabel(key: string) {
  const keyToLabelMap = new Map(Object.entries(keyToLabelList));
  return keyToLabelMap.get(key);
}
