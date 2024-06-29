import React, { useState, useEffect, useRef } from "react"
import DefaultConfigurations from "./default"
import CommitteeConfigurations from "./committee"
import PaymentConfigurations from "./payments";
import { Configuration } from "@prisma/client";
import RepresentationConfiguration from "./representation";

const EditConfigurations = ({ isDisabled, actionData, defaultValues, handleChange, id }: {
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
      <CommitteeConfigurations
        defaultValues={defaultValues}
        isDisabled={isDisabled}
        handleChange={handleChange}
        actionData={actionData}
      />

      <RepresentationConfiguration
        defaultValues={defaultValues}
        isDisabled={isDisabled}
        handleChange={handleChange}
        actionData={actionData}
      />

      <DefaultConfigurations
        defaultValues={defaultValues}
        isDisabled={isDisabled}
        handleChange={handleChange}
        actionData={actionData}
      />

      <PaymentConfigurations
        defaultValues={defaultValues}
        isDisabled={isDisabled}
        handleChange={handleChange}
        actionData={actionData}
      />
    </div>
  )
}

export default EditConfigurations