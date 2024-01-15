import { Languages } from "@prisma/client";
import React from "react";
import { DelegationType } from "~/models/delegation.server";

export function useUpdateStateFunctions(
  formData: DelegationType, 
  setFormData: React.Dispatch<React.SetStateAction<DelegationType>>, selectedUserId: string) {
  const handleDelegationChange = (event: any) => {
    const { name, value } = event.target;

    setFormData((prevState: any) => {
      let newData = { ...prevState };

      if (name.includes('.')) {
        const [field, nestedField] = name.split('.');

        // Check if the user object has the field and if the field is an object
        if (newData[field] && typeof newData[field] === 'object') {
          newData[field][nestedField] = value;
        } else {
          newData[field] = { [nestedField]: value };
        }
      } else {
        newData[name] = value;
      }

      return newData
    })
  }
  const handleChange = (event: any) => {
    const { name, value } = event.target;

    setFormData((prevState: any) => {
      // Copy the existing state
      let newData = { ...prevState };

      // Find the user and update the field
      const user = newData.participants.find(
        (participant: any) => participant.id === selectedUserId
      );
      if (user) {
        // Check if the name includes a '.'
        if (name.includes('.')) {
          const [field, nestedField] = name.split('.');

          // Check if the user object has the field and if the field is an object
          if (user[field] && typeof user[field] === 'object') {
            user[field][nestedField] = value;
          } else {
            user[field] = { [nestedField]: value };
          }
        } else {
          user[name] = value;
        }
      }

      if (name === "nacionality") {
        newData.passport = ""
        newData.rg = ""
        newData.cpf = ""
      }

      // Return the updated state
      return newData;
    });
  };
  const handleAddLanguage = (language: Languages) => {
    setFormData((prevState: any) => {
      let newData = { ...prevState };

      const user = newData.participants.find(
        (participant: any) => participant.id === selectedUserId
      );
      if (user && !user.delegate.languagesSimulates.includes(language)) {
        user.delegate.languagesSimulates.push(language);
      }

      return newData;
    });
  };
  const handleRemoveLanguage = (language: Languages) => {
    setFormData((prevState: any) => {
      let newData = { ...prevState };

      // Find the user and remove the language from the language array
      const user = newData.participants.find(
        (participant: any) => participant.id === selectedUserId
      );
      if (user) {
        user.delegate.languagesSimulates = user.delegate.languagesSimulates.filter(
          (el: any) => el !== language
        );
      }

      return newData;
    });
  };

  return [handleDelegationChange, handleChange, handleAddLanguage, handleRemoveLanguage]
}