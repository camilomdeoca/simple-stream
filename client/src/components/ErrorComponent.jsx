export default function ErrorComponent({ code, message }) {
  return (
    <div className="vertical-array expand">
      <h1>{code}</h1>
      <p className="error-message">{message}</p>
    </div>
  );
}
