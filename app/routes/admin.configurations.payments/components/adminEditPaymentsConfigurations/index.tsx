import React, { useState, useEffect, useRef } from "react"
import PaymentConfigurations from "./payments";
import { Configuration } from "@prisma/client";

const EditPaymentsConfigurations = ({ isDisabled, actionData, defaultValues, handleChange, id }: {
  isDisabled: boolean,
  actionData: any,
  defaultValues?: Partial<Configuration>,
  handleChange: (e: any) => void | ((type: "delegation" | "participant") => (e: any) => void),
  id: any,
}) => {
  return (
    <div
      className={`data-box-wrapper c`}
      key={id}
    >
      <PaymentConfigurations
        defaultValues={defaultValues}
        isDisabled={isDisabled}
        handleChange={handleChange}
        actionData={actionData}
      />
    </div>
  )
}

export default EditPaymentsConfigurations