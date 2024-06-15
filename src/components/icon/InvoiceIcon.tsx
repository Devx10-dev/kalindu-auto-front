import { IconProps } from "@/types/component/propTypes";

function InvoiceIcon({ width, height, color }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill="currentColor"
      className="bi bi-file-earmark-text-fill"
      style={{ color: `${color}` }}
      viewBox="0 0 16 16"
    >
      <path d="M6 0a2 2 0 0 1 2 2v1h4a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2zm1 3.5V2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5zm-1 1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5H6zm0 2.5V7a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5H6z" />
    </svg>
  );
}

export default InvoiceIcon;
