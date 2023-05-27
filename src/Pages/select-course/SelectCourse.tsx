import { SelectGroupedCourse } from "./SelectGroupedCourse";
import { SelectPlainCourse } from "./SelectPlainCourse";

export function SelectCourse() {
  return (
    <div>
      {" "}
      <SelectPlainCourse />
      <div>
        <h4>Select Grouped question</h4>
      </div>
      <SelectGroupedCourse />
    </div>
  );
}
