import React, { useState, useEffect, useRef } from "react"

import { useWrapChange } from "~/hooks/useWrapChange";

import PersonalData from "./personal";
import EmergencyContactData from "./emergencyContact";
import AdvisorRoleData from "./advisorRole";
import CouncilPreference from "./councilPreference";
import LanguageData from "./language";
import SocialMediaData from "./socialMedia";
import { UserType } from "~/models/user.server";
import { Languages } from "@prisma/client";
import FoodRestrictions from "./foodRestrictions";
import EducationLevel from "./educationLevel";

const EditUserData = ({ isDisabled, actionData, formData, handleChange, handleAddLanguage, handleRemoveLanguage, userType }: {
  isDisabled: boolean,
  actionData: any,
  formData: UserType,
  handleChange: (e: any) => void,
  handleAddLanguage: (language: Languages) => void,
  handleRemoveLanguage: (language: Languages) => void,
  userType: any,
}) => {
  const [containerRef, isWrapped] = useWrapChange();

  return (
    <div
      ref={containerRef}
      className={`data-box-wrapper ${isWrapped ? "wrapped" : ""}  ${isDisabled ? "disabled" : ""}`}
      key={formData?.id}
    >
      <div className='data-box-column'>
        <PersonalData
          formData={formData}
          isDisabled={isDisabled}
          handleChange={handleChange}
          actionData={actionData}
        />

        <FoodRestrictions
          formData={formData}
          isDisabled={isDisabled}
          handleChange={handleChange}
          actionData={actionData}
        />

        {userType === 'delegate' ?
          <EmergencyContactData
            formData={formData}
            isDisabled={isDisabled}
            handleChange={handleChange}
            actionData={actionData}
          />
          :
          <AdvisorRoleData
            formData={formData}
            isDisabled={isDisabled}
            handleChange={handleChange}
            actionData={actionData}
          />
        }
      </div>

      <div className='data-box-column'>
        {userType === 'delegate' ?
          <>
            <EducationLevel
              formData={formData}
              isDisabled={isDisabled}
              handleChange={handleChange}
              actionData={actionData}
            />

            <CouncilPreference
              formData={formData}
              isDisabled={isDisabled}
              handleChange={handleChange}
            />

            <LanguageData
              formData={formData}
              isDisabled={isDisabled}
              handleRemoveLanguage={handleRemoveLanguage}
              handleAddLanguage={handleAddLanguage}
              actionData={actionData}
            />
          </>
          :
          <SocialMediaData
            formData={formData}
            isDisabled={isDisabled}
            handleChange={handleChange}
            actionData={actionData}
          />
        }
      </div>
    </div>
  )
}

export default EditUserData