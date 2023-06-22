import React, { useEffect, useState } from "react";
import SelectDropdown, { SelectOption } from "../../components/SelectDropdown";
import styles from "./viewGroupedQuestionPage.module.css";
import {
  fetchDirectionOfCourseByYear,
  fetchGroupedCourses,
  fetchGroupedCoursesDirectionYears,
} from "../../DataService/fetchCourse.service";
import { Link } from "react-router-dom";

export function SelectGroupedCourse() {
  const [selectedYear, setSelectedYear] = useState<number | string>("2040");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDirection, setSelectedDirection] = useState("");
  const [yearOptions, setYearOptions] = useState<SelectOption[]>([]);
  const [courseOptions, setCourseOptions] = useState<SelectOption[]>([]);
  const [directionsOption, setDirectionsOption] = useState<SelectOption[]>([]);
  const [progressMessage, setProgressMessage] = useState("");
  //hooks to listen for changes and initialization
  useEffect(() => {
    getGroupedCourses();
  }, []);
  useEffect(() => {
    if (selectedCourse.length > 0) getGroupedCoursesYear();
  }, [selectedCourse]);
  useEffect(() => {
    if (selectedYear)
      getGroupedCoursesDirections(
        selectedCourse,
        parseInt(selectedYear.toString())
      );
  }, [selectedYear]);

  const getGroupedCourses = async () => {
    const groupedCourses = await fetchGroupedCourses();
    setCourseOptions(groupedCourses);
    const defaultCourseId = groupedCourses[0].value;
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log(groupedCourses);
    setSelectedCourse(defaultCourseId);
    const years = await fetchGroupedCoursesDirectionYears(defaultCourseId);
    setYearOptions(years);
  };

  const getGroupedCoursesYear = async () => {
    //listen for course change to be called
    setProgressMessage("Loading....");
    const years = await fetchGroupedCoursesDirectionYears(selectedCourse);
    console.log("@@@@@@years@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log(years);
    if (years.length == 0) {
      setProgressMessage("it looks like you don't have data yet");
      return;
    }
    setProgressMessage(""); // clear loading if years are loaded
    setYearOptions(years);
    setSelectedYear(years[0].value);
  };
  const getGroupedCoursesDirections = async (
    courseId: string,
    year: number
  ) => {
    //  listen for course change to be called
    setSelectedDirection("");
    const directionsFromServer = await fetchDirectionOfCourseByYear(
      courseId,
      year
    );
    const defaultDirectionId = directionsFromServer[0].value;
    console.log(directionsFromServer);
    setSelectedDirection(defaultDirectionId);
    setDirectionsOption(directionsFromServer);
  };

  const handleSelectYear = (e: React.FormEvent<HTMLSelectElement>) => {
    setSelectedYear((e.target as HTMLSelectElement).value);
  };
  const handleSelectCourse = (e: React.FormEvent<HTMLSelectElement>) => {
    setSelectedCourse((e.target as HTMLSelectElement).value);
  };
  const handleDirectionChange = (e: any) => {
    setSelectedDirection(e.target.value);
  };
  return (
    <div>
      <div>{progressMessage && progressMessage}</div>
      <div className={styles.adminBody}>
        <div className={styles.groupedHeader}>
          <span className="list-course mt-3">
            <b style={{ color: "white" }}>Courses</b>
            <SelectDropdown
              title=""
              items={courseOptions}
              handleSelect={handleSelectCourse}
              styles={{ display: "inline", width: "3rem" }}
            />
          </span>
          <span className="year-selection mt-3">
            <b style={{ color: "white" }}>Select Year</b>
            <SelectDropdown
              title=""
              items={yearOptions}
              handleSelect={handleSelectYear}
              styles={{ display: "inline", width: "3rem" }}
            />
          </span>
          <span className="direction mt-3">
            <b style={{ color: "white" }}>Directions</b>
            <SelectDropdown
              title=""
              items={directionsOption}
              handleSelect={handleDirectionChange}
              styles={{ display: "inline", width: "3rem" }}
            />
          </span>
        </div>
      </div>
      <div>
        {selectedDirection.length > 0 && (
          <Link
            to={"/admin-user/view-grouped-questions"}
            state={{ direction: selectedDirection }}
          >
            <button
              style={{ marginLeft: "30%", marginTop: "3%", cursor: "pointer" }}
            >
              {" "}
              View Questions for the Selected Direction
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
