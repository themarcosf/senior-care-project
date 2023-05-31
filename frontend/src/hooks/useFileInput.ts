import { useState } from "react";

const useFileInput = (validateValue: (value: File | null) => boolean) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isTouched, setIsTouched] = useState(false);
  const [isSubmited, setIsSubmited] = useState(false);

  const isValid = validateValue(selectedFile);
  const hasError = !isValid && (isTouched || isSubmited);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const inputBlurHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsTouched(true);
  };

  const submitInputHandler = () => {
    setIsSubmited(true);
  };

  const reset = () => {
    setSelectedFile(null);
    setIsTouched(false);
  };

  return {
    selectedFile,
    isValid,
    hasError,
    handleFileChange,
    inputBlurHandler,
    reset,
    submitInputHandler,
  };
};

export default useFileInput;
