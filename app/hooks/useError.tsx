import React from "react";

export function useError({ errorMessage, action, ref, onChangeUpdateError }:
  { errorMessage: React.ReactNode, action: any, ref?: any, onChangeUpdateError?: any }
): [React.ReactNode, () => void] {
  const [error, setError] = React.useState<React.ReactNode>(errorMessage);

  React.useEffect(() => {
    if (errorMessage && ref?.current) {
      ref?.current?.focus({ preventScroll: true })
      ref?.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    }

    setError(errorMessage);
  }, [errorMessage, action]);

  React.useEffect(() => {
    setError(false)
  }, [onChangeUpdateError])

  function handleInputErrorChange() {
    if (error) setError(false)
  }

  return [error, handleInputErrorChange]
}