type ErrorProps = {
  value: string;
};
export default function ErrorComponent({ value }: ErrorProps) {
  let notNumber = Number.isNaN(value);
  return (
    <span>
      {value === "<p><br></p>" || (value && value.length < 1) || !notNumber ? (
        <span style={{ color: "red" }}>This field can not be empty</span>
      ) : null}
    </span>
  );
}
