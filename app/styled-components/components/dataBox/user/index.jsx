import { useState, useEffect, useRef } from "react"

import { useWrapChange } from "~/hooks/useWrapChange";

import * as S from "../elements"
import PersonalData from "./personal";
import EmergencyContactData from "./emergencyContact";
import AdvisorRoleData from "./advisorRole";
import CouncilPreference from "./councilPreference";
import LanguageData from "./language";
import SocialMediaData from "./socialMedia";

const EditUserData = ({
  isDisabled,
  actionData,
  formData,
  handleChange,
  handleAddLanguage,
  handleRemoveLanguage,
  userType,
  style
}) => {
  const [containerRef, isWrapped] = useWrapChange();

  return (
    <S.Wrapper
      ref={containerRef}
      isWrapped={isWrapped}
      isDisabled={isDisabled}
      key={formData.id}
      style={style}
    >
      <S.Column>
        <PersonalData
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
      </S.Column>

      <S.Column>
        {userType === 'delegate' ?
          <>
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
      </S.Column>
    </S.Wrapper>
  )
}

export default EditUserData