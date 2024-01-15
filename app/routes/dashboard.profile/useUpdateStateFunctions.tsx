import React from "react";
import { Languages } from "@prisma/client";
import { UserType } from "~/models/user.server";

export function useUpdateStateFunctions(formData: UserType, setFormData: React.Dispatch<React.SetStateAction<UserType>>): [
  (e: any) => void, (language: Languages) => void, (language: Languages) => void
] {
  const handleChange = (event: any) => {
    const { name, value } = event.target;

    setFormData((prevState: any) => {
      // ts with nested objects too complicated for me :( 

      // Copy the existing state
      let newData = { ...prevState };

      // Check if the name includes a '.'
      // if theres a dot it means its a nested value that we want to change
      if (name.includes('.')) {
        const [field, nestedField] = name.split('.')
        const key = field;

        // Check if the nested value we want to change already exists
        if (typeof newData[key] === 'object' && newData[key] !== null) {
          const nestedKey = nestedField;
          // Ensure that nestedKey is actually a key of newData[key]
          if (nestedKey in newData[key]) {
            newData[key][nestedKey] = value;
          }
        } else {
          newData[key] = { [nestedField]: value };
        }
      } else {
        newData[name] = value;
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
    if (!formData?.delegate?.languagesSimulates.includes(language)) {
      setFormData({
        ...formData,
        delegate: {
          ...formData.delegate,
          languagesSimulates: [...(formData?.delegate?.languagesSimulates || []), language],
        } as UserType["delegate"],
      });
    }
  };
  const handleRemoveLanguage = (language: Languages) => {
    setFormData({
      ...formData,
      delegate: {
        ...formData.delegate,
        languagesSimulates: formData.delegate?.languagesSimulates.filter((lang: any) => lang !== language) || [],
      } as UserType["delegate"],
    });
  };

  return [handleChange, handleAddLanguage, handleRemoveLanguage]
}