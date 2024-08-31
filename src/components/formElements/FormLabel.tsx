import capitalize from "@/utils/string";

type LabelProps = {
  label: string;
  style?: React.CSSProperties;
};

function RequiredLabel({ label }: LabelProps) {
  return (
    <div className="flex gap-1 mb-2">
      <p className="text-sm font-medium">
        {capitalize(label)}
      </p>
      <span className="color-red">*</span>
    </div>
  );
}

function OptionalLabel({ label, style }: LabelProps) {
  return <p style={style}>{capitalize(label)}</p>;
}

export { OptionalLabel, RequiredLabel };
