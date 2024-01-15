import React from 'react'

import { useWrapChange } from '~/hooks/useWrapChange'
import { DelegationType } from '~/models/delegation.server'

import AddressData from './address'
import DelegationData from './information'

const EditDelegationData = ({ isDisabled, actionData, formData, handleChange }: {
  isDisabled: boolean,
  actionData: any,
  formData: DelegationType,
  handleChange: (e: any) => void,
}) => {
  const [containerRef, isWrapped] = useWrapChange();

  return (
    <div ref={containerRef} className={`data-box-wrapper ${isWrapped ? "wrapped" : ""}  ${isDisabled ? "disabled" : ""}`}>
      <div className='data-box-column'>
        <AddressData
          formData={formData}
          handleChange={handleChange}
          actionData={actionData}
          isDisabled={isDisabled}
        />
      </div>

      <div className='data-box-column'>
        <DelegationData
          formData={formData}
          handleChange={handleChange}
          actionData={actionData}
          isDisabled={isDisabled}
        />
      </div>
    </div>
  )
}

export default EditDelegationData