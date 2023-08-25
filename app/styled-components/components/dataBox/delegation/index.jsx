import React from 'react'

import { useWrapChange } from '~/hooks/useWrapChange'

import * as S from "../elements"
import AddressData from './address'
import DelegationData from './information'

const EditDelegationData = ({
  isDisabled,
  actionData,
  formData,
  handleChange,
}) => {
  const [containerRef, isWrapped] = useWrapChange();

  return (
    <S.Wrapper ref={containerRef} isWrapped={isWrapped}>
      <S.Column>
        <AddressData
          formData={formData}
          handleChange={handleChange}
          actionData={actionData}
          isDisabled={isDisabled}
        />
      </S.Column>

      <S.Column>
        <DelegationData
          formData={formData}
          handleChange={handleChange}
          actionData={actionData}
          isDisabled={isDisabled}
        />
      </S.Column>
    </S.Wrapper>
  )
}

export default EditDelegationData