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

const EditUserData = ({ isDisabled, actionData, defaultValues, handleChange, userType, id }: {
  isDisabled: boolean,
  actionData: any,
  defaultValues?: UserType,
  handleChange: (e: any) => void | ((type: "delegation" | "participant") => (e: any) => void),
  userType: any,
  id: any
}) => {

  return (
    <div
      className="data-box-wrapper"
      key={id}
    >
      <PersonalData
        defaultValues={defaultValues}
        isDisabled={isDisabled}
        handleChange={handleChange}
        actionData={actionData}
      />

      {userType === 'delegate' ?
        <EmergencyContactData
          defaultValues={defaultValues}
          isDisabled={isDisabled}
          handleChange={handleChange}
          actionData={actionData}
        />
        :
        <AdvisorRoleData
          defaultValues={defaultValues}
          isDisabled={isDisabled}
          handleChange={handleChange}
          actionData={actionData}
        />
      }

      {userType === 'delegate' ?
        <EducationLevel
          defaultValues={defaultValues}
          isDisabled={isDisabled}
          handleChange={handleChange}
          actionData={actionData}
        /> :
        <SocialMediaData
          defaultValues={defaultValues}
          isDisabled={isDisabled}
          handleChange={handleChange}
          actionData={actionData}
        />
      }

      <FoodRestrictions
        defaultValues={defaultValues}
        isDisabled={isDisabled}
        handleChange={handleChange}
        actionData={actionData}
      />

      {userType === 'delegate' ?
        <>
          <CouncilPreference
            defaultValues={defaultValues}
            isDisabled={isDisabled}
            handleChange={handleChange}
          />

          <LanguageData
            defaultValues={defaultValues}
            isDisabled={isDisabled}
            handleChange={handleChange}
            actionData={actionData}
          />
        </>
        :
        null
      }
    </div>
  )
}

export default EditUserData