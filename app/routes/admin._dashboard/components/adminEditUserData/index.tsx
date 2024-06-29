import React, { useState, useEffect, useRef } from "react"

import { UserType } from "~/models/user.server";

import PersonalData from "~/routes/dashboard/components/editUserData/user/personal";
import EmergencyContactData from "~/routes/dashboard/components/editUserData/user/emergencyContact";
import AdvisorRoleData from "~/routes/dashboard/components/editUserData/user/advisorRole";
import CouncilPreference from "~/routes/dashboard/components/editUserData/user/councilPreference";
import LanguageData from "~/routes/dashboard/components/editUserData/user/language";
import SocialMediaData from "~/routes/dashboard/components/editUserData/user/socialMedia";
import FoodRestrictions from "~/routes/dashboard/components/editUserData/user/foodRestrictions";
import EducationLevel from "~/routes/dashboard/components/editUserData/user/educationLevel";
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
      className={`data-box-wrapper ${userType === "delegate" ? "admin" : "advisor"}`}
      key={id}
      ref={ref}
      /* style={{ marginRight: `${Math.max(0, (lines - 1) * 8)}px` }} */
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