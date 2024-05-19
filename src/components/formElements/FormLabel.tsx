import capitalize from "@/utils/string";


type LabelProps = {
  label: string;
};

function RequiredLabel({ label }: LabelProps) {
  return (
    <div className="flex gap-1 mb-2">
      <p>{capitalize(label)}</p>
      <span className="color-red">*</span>
    </div>
  );
}

function OptionalLabel({ label }: LabelProps) {
  return <p>{capitalize(label)}</p>;
}

export { OptionalLabel, RequiredLabel };
