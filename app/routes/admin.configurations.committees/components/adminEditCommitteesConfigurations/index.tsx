import React, { useState, useEffect, useRef } from "react"
import CommitteeConfigurations from "./committee"
import { Configuration } from "@prisma/client";
import RepresentationConfiguration from "./representation";

const EditCommitteesConfigurations = ({ isDisabled, actionData, defaultValues, handleChange, id }: {
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
    </div>
  )
}

export default EditCommitteesConfigurations