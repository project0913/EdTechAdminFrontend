import { useEffect, useState } from "react";
import styles from "./selectCourse.module.css";
import { fetchAvailableYears } from "../../DataService/fetchAvailableYears.service";
import SelectDropdown, { SelectOption } from "../../components/SelectDropdown";
import { fetchExamCategories } from "../../DataService/fetchExamCatagories.service";
import { Course } from "src/models/exam-catagory.model";
import { Link } from "react-router-dom";

export function SelectPlainCourse() {
  const [selectedYear, setSelectedYear] = useState<number | string>("2015");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [yearOptions, setYearOptions] = useState<SelectOption[]>([]);
  const [courseOptions, setCourseOptions] = useState<SelectOption[]>([]);

  const handleSelectYear = (e: React.FormEvent<HTMLSelectElement>) => {
    setSelectedYear((e.target as HTMLSelectElement).value);
  };
  const handleSelectCourse = (e: React.FormEvent<HTMLSelectElement>) => {
    setSelectedCourse((e.target as HTMLSelectElement).value);
  };
  useEffect(() => {
    getCourses();
  }, []);
  useEffect(() => {
    if (selectedCourse.length > 0) getYears(selectedCourse);
  }, [selectedCourse]);
  const getCourses = async () => {
    let examCats = await fetchExamCategories();
    let UEECourses = examCats.find((e) => e._id == "63a2ecdeee469ea43cdacbac");
    let courses: Course[] = [];
    if (UEECourses) courses = UEECourses.courses;
    let crs: SelectOption[] = [];
    console.log(examCats);

    for (const course of courses) {
      if (course.hasDirections) continue;

      crs.push({ label: course.name, value: course._id });
    }
    const privPageCrs = crs;
    const privSelectedCourse = courses[0]._id;
    setCourseOptions((p) => privPageCrs);
    setSelectedCourse((p) => privSelectedCourse);
    await getYears(courses[0]._id);
  };

  async function getYears(courseId: string | number) {
    let yearsFromServer: SelectOption[] = await fetchAvailableYears(courseId);
    const privYears = yearsFromServer;
    setYearOptions((p) => privYears);
    const privSelectedYear = yearsFromServer[0].value;
    setSelectedYear((p) => privSelectedYear);
  }

  return (
    <div>
      <div className={styles.directionHeader}>
        <span>
          <b>Select Course</b>
          <SelectDropdown
            title=""
            items={courseOptions}
            handleSelect={handleSelectCourse}
            // styles={{ display: "inline", width: "4rem" }}
          />
        </span>
        <span>
          <b>Select Year</b>
          <SelectDropdown
            title=""
            items={yearOptions}
            handleSelect={handleSelectYear}
          />
        </span>
      </div>
      {selectedCourse.length > 0 && (
        <Link
          onClick={() => {}}
          to={"/admin-user/view-plain-questions"}
          state={{ course: selectedCourse, year: selectedYear, page: 1 }}
        >
          <div
            className="btn-link"
            style={{
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <button
              style={{
                marginLeft: "30%",
                marginTop: "3%",
                cursor: "pointer",
                border: "none",
                color: "white",
                backgroundColor: "#4CAF50",
                padding: "10px 20px",
                fontSize: "16px",

                margin: "4px 2px",
                borderRadius: "5px",
                transition: "background-color 0.3s ease",
                fontFamily: "newtimes",
              }}
            >
              {" "}
              View Questions for the Selected Course
            </button>
          </div>
        </Link>
      )}
    </div>
  );
}
