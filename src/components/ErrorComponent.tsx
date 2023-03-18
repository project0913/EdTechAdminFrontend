type ErrorProps = {
  value: string;
};
export default function ErrorComponent({ value }: ErrorProps) {
  let notNumber = Number.isNaN(value);
  return (
    <span>
      {value === "" ||
      value === "<p><br></p>" ||
      !value ||
      (value && value.length < 1) ? (
        <span style={{ color: "red" }}>This field can not be empty</span>
      ) : null}
    </span>
  );
}
//<p><br></p>
