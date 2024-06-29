import React from 'react'

import { DelegationType } from '~/models/delegation.server'

import AddressData from './address'
import DelegationData from './information'

const EditDelegationData = ({ isDisabled, actionData, defaultValues, handleChange, id }: {
  isDisabled: boolean,
  actionData: any,
  defaultValues?: DelegationType,
  handleChange: (e: any) => void | ((type: "delegation" | "participant") => (e: any) => void),
  id: any
}) => {

  return (
    <div className="data-box-wrapper delegation">
      <AddressData
        defaultValues={defaultValues}
        handleChange={handleChange}
        actionData={actionData}
        isDisabled={isDisabled}
      />

      <DelegationData
        defaultValues={defaultValues}
        handleChange={handleChange}
        actionData={actionData}
        isDisabled={isDisabled}
      />
    </div>
  )
}

export default EditDelegationData