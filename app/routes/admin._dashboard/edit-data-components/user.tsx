import React, { useState, useEffect, useRef } from "react"

import { UserType } from "~/models/user.server";

import PersonalData from "~/routes/dashboard/edit-data-components/user/personal";
import EmergencyContactData from "~/routes/dashboard/edit-data-components/user/emergencyContact";
import AdvisorRoleData from "~/routes/dashboard/edit-data-components/user/advisorRole";
import CouncilPreference from "~/routes/dashboard/edit-data-components/user/councilPreference";
import LanguageData from "~/routes/dashboard/edit-data-components/user/language";
import SocialMediaData from "~/routes/dashboard/edit-data-components/user/socialMedia";
import FoodRestrictions from "~/routes/dashboard/edit-data-components/user/foodRestrictions";
import EducationLevel from "~/routes/dashboard/edit-data-components/user/educationLevel";
import Representation from "./representation";
import useFlexboxLines from "~/hooks/useFlexboxLines";

const EditUserData = ({ isDisabled, actionData, defaultValues, handleChange, userType, id, theme }: {
  isDisabled: boolean,
  actionData: any,
  defaultValues?: UserType,
  handleChange: (e: any) => void | ((type: "delegation" | "participant") => (e: any) => void),
  userType: any,
  id: any,
  actionType: "edit" | "add",
  theme?: "light" | "dark"
}) => {
  const [ref, lines] = useFlexboxLines()

  return (
    <div
      className={`data-box-wrapper ${userType === "delegate" ? "" : "a"}`}
      key={id}
      ref={ref}
      style={{ marginRight: `${Math.max(0, (lines - 1) * 8)}px` }}
    >
      {userType === "delegate" ?
        <Representation
          defaultValues={defaultValues}
          isDisabled={isDisabled}
          handleChange={handleChange}
          actionData={actionData}
          theme={theme}
        />
        : null
      }

      <PersonalData
        defaultValues={defaultValues}
        isDisabled={isDisabled}
        handleChange={handleChange}
        actionData={actionData}
        theme={theme}
      />

      {userType === 'delegate' ?
        <EmergencyContactData
          defaultValues={defaultValues}
          isDisabled={isDisabled}
          handleChange={handleChange}
          actionData={actionData}
          theme={theme}
        />
        :
        <AdvisorRoleData
          defaultValues={defaultValues}
          isDisabled={isDisabled}
          handleChange={handleChange}
          actionData={actionData}
          theme={theme}
        />
      }

      {userType === 'delegate' ?
        <EducationLevel
          defaultValues={defaultValues}
          isDisabled={isDisabled}
          handleChange={handleChange}
          actionData={actionData}
          theme={theme}
        /> :
        <SocialMediaData
          defaultValues={defaultValues}
          isDisabled={isDisabled}
          handleChange={handleChange}
          actionData={actionData}
          theme={theme}
        />
      }

      <FoodRestrictions
        defaultValues={defaultValues}
        isDisabled={isDisabled}
        handleChange={handleChange}
        actionData={actionData}
        theme={theme}
      />

      {userType === 'delegate' ?
        <>
          <CouncilPreference
            defaultValues={defaultValues}
            isDisabled={isDisabled}
            handleChange={handleChange}
            theme={theme}
          />

          <LanguageData
            defaultValues={defaultValues}
            isDisabled={isDisabled}
            handleChange={handleChange}
            actionData={actionData}
            theme={theme}
          />
        </>
        :
        null
      }
    </div>
  )
}

export default EditUserData