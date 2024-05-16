import React, { useState, useEffect, useRef } from "react"

import { UserType } from "~/models/user.server";

import PersonalData from "./personal";
import EmergencyContactData from "./emergencyContact";
import AdvisorRoleData from "./advisorRole";
import CouncilPreference from "./councilPreference";
import LanguageData from "./language";
import SocialMediaData from "./socialMedia";
import FoodRestrictions from "./foodRestrictions";
import EducationLevel from "./educationLevel";
import Representation from "./representation";

const EditUserData = ({ isDisabled, actionData, defaultValues, handleChange, userType, id, actionType, theme }: {
  isDisabled: boolean,
  actionData: any,
  defaultValues?: UserType,
  handleChange: (e: any) => void | ((type: "delegation" | "participant") => (e: any) => void),
  userType: any,
  id: any,
  actionType: "edit" | "add",
  theme?: "light" | "dark"
}) => {
  return (
    <div
      className={`data-box-wrapper ${userType === "delegate" ? "" : "advisor"}`}
      key={id}
    >
      {actionType === "edit" && userType === "delegate" ?
        <Representation
          defaultValues={defaultValues}
          isDisabled={isDisabled}
          handleChange={handleChange}
          actionData={actionData}
          theme={theme}
        />
        :
        null
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