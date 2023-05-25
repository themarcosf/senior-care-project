import { useState, FormEvent } from "react";

const useInput = (validateValue: (value: string) => boolean) => {
  const [enteredValue, setEnteredValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const [isSubmited, setIsSubmited] = useState(false);

  const isValid = validateValue(enteredValue);
  const hasError = !isValid && (isTouched || isSubmited) ;

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement >) => {
    setEnteredValue(event.target.value);
  };

  const inputBlurHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement >) => {
    setIsTouched(true);
  };

  const submitInputHandler = () => {
    setIsSubmited(true);
  }

  const reset = () => {
    setEnteredValue("");
    setIsTouched(false);
  };

  return {
    value: enteredValue,
    isValid,
    hasError,
    inputChangeHandler,
    inputBlurHandler,
    reset,
    submitInputHandler
  };
};

export default useInput;
