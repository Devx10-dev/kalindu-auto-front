import { FieldError } from "react-hook-form";

function CreatableSelectErrorMessage({
  error,
  value,
  label,
}: {
  error: FieldError;
  label: string;
  value: {
    label?: string;
    value?:
      | string
      | {
          value?: string;
          id?: number;
        };
    __isNew__?: boolean;
  };
}) {
  if (error.message === undefined) {
    return <p></p>;
  }

  return (
    <p className="error-msg">
      {error.message === "Required" ||
      error.message === "Expected object, received null"
        ? `${label} is required`
        : value !== null &&
            value.value !== null &&
            typeof value.value === "string" &&
            value.value.length < 2
          ? `${label} must be at least 2 characters.`
          : value !== null &&
              value.value !== null &&
              typeof value.value === "string" &&
              value.value.length > 255
            ? `${label} must not be longer than 255 characters.`
            : error.message}
    </p>
  );
}

export default CreatableSelectErrorMessage;
