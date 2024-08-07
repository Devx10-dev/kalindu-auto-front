import { FieldError } from "react-hook-form";

function SelectErrorMessage({
  error,
  value,
  label,
}: {
  error: FieldError;
  label: string;
  value: {
    label?: string;
    value?: string;
  };
}) {
  return (
    <p className="error-msg">
      {error.message === "undefined" ? `${label} is required` : error.message}
    </p>
  );
}

export default SelectErrorMessage;
