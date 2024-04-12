
function ErrorMessage({ error }: { error: string }) {
  return <div><p className="fs-15 color-red mt-1">{error}</p></div>;
}

export default ErrorMessage;
