import React from "react"
import { DelegationType } from "~/models/delegation.server"

export function useUserScroll(
  searchParams: URLSearchParams,
  delegation: DelegationType,
  setSelectedUserId: React.Dispatch<React.SetStateAction<string | undefined>>
): React.MutableRefObject<any> {
  const userDataRef = React.useRef<any>()

  if (!searchParams) return userDataRef
  const name = searchParams.get("u")

  React.useEffect(() => {
    const id = delegation.participants?.find(participant => participant.name === name)?.id
    if (id) {
      setSelectedUserId(id)

      const timer = setTimeout(() => {
        userDataRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 500)

      return () => {
        clearTimeout(timer);
      };
    }
  }, [])

  return userDataRef
}