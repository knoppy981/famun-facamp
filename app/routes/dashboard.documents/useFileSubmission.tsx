import React from "react";
import { timeout } from "~/utils";

export function useFileSubmission(actionData: any, close: () => void): [
  File | null,
  React.Dispatch<any>,
  string,
  React.Dispatch<React.SetStateAction<string>>,
  boolean,
  string | null,
  boolean,
  (event: any) => void,
  (event: any) => void,
  (event: any) => void,
  (event: any) => void,
] {
  const [file, setFile] = React.useState<File | null>(null)
  const [imagePreview, setImagePreview] = React.useState<string | null>(null)
  const [isDragging, setIsDragging] = React.useState<boolean>(false)
  const [selectedFileName, setSelectedFileName] = React.useState<string>("Position Paper")
  const [isImageUploaded, setIsImageUploaded] = React.useState<boolean>(false)

  React.useEffect(() => {
    setFile(null)
  }, [])

  React.useEffect(() => {
    if (file?.name && actionData?.fileName && actionData?.fileName === file?.name) {
      setIsImageUploaded(true)
      timeout(2500).then(() => {
        setFile(null)
        setIsImageUploaded(false)
        close()
      })
    }
  }, [actionData])

  const onDragOver = (event: any) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const onDragLeave = (event: any) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (event: any) => {
    event.preventDefault()
    setIsDragging(false)

    const files = event.dataTransfer.files

    if (files.length) {
      setFile(files[0])
    }
  }

  const onFileChange = (event: any) => {
    if (event.target.files.length) {
      setFile(event.target.files[0])
      setImagePreview(event.target.files[0] ? URL.createObjectURL(event.target.files[0]) : null)
    }
  }

  return [file, setFile, selectedFileName, setSelectedFileName, isImageUploaded, imagePreview, isDragging, onDragOver, onDragLeave, handleDrop, onFileChange]
}