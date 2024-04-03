import { CommitteeType } from "./route"

type CommitteeAooType = {
  "Representation"?: string,
  "School"?: string,
  "Delegate"?: string,
  "Head Delegate"?: string,
  "Position Paper"?: number,
  "Male"?: number,
  "Female"?: number,
}[]

export function committeeAoo(committee: CommitteeType) {
  const aoo: CommitteeAooType = []

  committee.delegates.forEach(delegate => {
    aoo.push({
      "Representation": delegate.country ?? "",
      "School": delegate.user.delegation?.school,
      "Delegate": delegate.user.name,
      "Head Delegate": delegate.user.delegation?.participants[0].name,
      "Position Paper": delegate.user._count.files > 0 ? 1 : 0,
      "Male": delegate.user.sex === "Masculino" ? 1 : 0,
      "Female": delegate.user.sex === "Feminino" ? 1 : 0,
    })
  })

  return aoo
}