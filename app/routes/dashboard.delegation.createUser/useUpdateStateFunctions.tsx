import { Languages } from "@prisma/client";
import { UserType } from "~/models/user.server";

export function useUpdateStateFunctions(formData: UserType, setFormData: React.Dispatch<React.SetStateAction<UserType>>) {
  function handleChange(event: any) {
    const { name, value } = event.target;

    setFormData((prevState: any) => {
      // Copy the existing state
      let newData = { ...prevState };

      // Check if the name includes a '.'
      if (name.includes('.')) {
        const [field, nestedField] = name.split('.');

        // Check if the data object has the field and if the field is an object
        if (newData[field] && typeof newData[field] === 'object') {
          newData[field][nestedField] = value;
        } else {
          newData[field] = { [nestedField]: value };
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