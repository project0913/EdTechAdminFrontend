import SelectDropdown, { SelectOption } from "../../components/SelectDropdown";
import styles from "./viewDirectionsPage.module.css";
import React, { useEffect, useRef, useState } from "react";

import parse, {
  HTMLReactParserOptions,
  Element,
  domToReact,
} from "html-react-parser";

import { Link } from "react-router-dom";
import { Direction } from "../../models/direction.model";
import {
  fetchDirectionOfCourseByYearAsArray,
  fetchGroupedCourses,
  fetchGroupedCoursesDirectionYears,
} from "../../DataService/fetchCourse.service";
import { deleteDirections } from "../../DataService/editDirections.service";
import { AxiosError } from "axios";
import { showErrorToast, showSuccessToast } from "../../utils/helper";

const options: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (domNode instanceof Element && domNode.attribs) {
      return <span>{domToReact(domNode.children)}</span>;
    }
  },
};

export default function ViewDirectionsPage() {
  const [directions, setDirections] = useState<Direction[]>([]);
  const [progressMessage, setProgressMessage] = useState("Loading ...");
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedYear, setSelectedYear] = useState<number | string>("2015");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [yearOptions, setYearOptions] = useState<SelectOption[]>([]);
  const [courseOptions, setCourseOptions] = useState<SelectOption[]>([]);
  const isInitialMount = useRef(true);

  const handleSelectYear = (e: React.FormEvent<HTMLSelectElement>) => {
    setSelectedYear((e.target as HTMLSelectElement).value);
  };
  const handleSelectCourse = (e: React.FormEvent<HTMLSelectElement>) => {
    setSelectedCourse((e.target as HTMLSelectElement).value);
  };
  const LoadInit = async () => {
    const groupedCourses = await fetchGroupedCourses();
    setCourseOptions(groupedCourses);
    const defaultCourseId = groupedCourses[0].value;
    setSelectedCourse(defaultCourseId);
    const years = await fetchGroupedCoursesDirectionYears(defaultCourseId);
    setYearOptions(years);
    if (years.length == 0) {
      setProgressMessage("it looks like you don't have data yet");
      return;
    }
    const defaultYear = years[0].value;
    setSelectedYear(defaultYear);
    const directionsFromServer = await fetchDirectionOfCourseByYearAsArray(
      defaultCourseId,
      parseInt(defaultYear.toString())
    );
    setDirections(directionsFromServer);
  };
  const deleteDirectionFromServer = async (directionId: string) => {
    let result = await deleteDirections(directionId);
    if (result instanceof AxiosError) {
      let msgTxt = "";
      const messages =
        result.response?.data?.message ||
        (["something is wrong try again Later"] as Array<string>);
      for (const msg of messages) {
        msgTxt += msg + " "; //concatenate array of error messages
      }
      setErrorMessage(msgTxt);
      showErrorToast();
    } else {
      setDirections((prev) => {
        let newDir = prev.filter((dir) => dir._id !== directionId);
        return [...newDir];
      });

      showSuccessToast("Request Success");
    }
  };

  useEffect(() => {
    LoadInit();
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      (async () => {
        const directionsFromServer = await fetchDirectionOfCourseByYearAsArray(
          selectedCourse,
          parseInt(selectedYear.toString())
        );
        setDirections(directionsFromServer);
      })();
    }
  }, [selectedCourse, selectedYear]);
  return (
    <div>
      <div className={styles.adminBody}>
        <span>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </span>
        <span>
          <b style={{ color: "white" }}>select Course</b>
          <SelectDropdown
            title=""
            items={courseOptions}
            handleSelect={handleSelectCourse}
            styles={{ display: "inline", width: "3rem" }}
          />
        </span>
        <span>
          <b style={{ color: "white" }}>select Year</b>
          <SelectDropdown
            title=""
            items={yearOptions}
            handleSelect={handleSelectYear}
            styles={{ display: "inline", width: "3rem" }}
          />
        </span>
      </div>

      <table className={styles.table}>
        <tr>
          <th className={`${styles.tableHeader} ${styles.th}`}>No</th>
          <th className={`${styles.tableHeader} ${styles.th}`}> Direction Text</th>
          <th className={`${styles.tableHeader} ${styles.th}`}>Section Name</th>
          <th className={`${styles.tableHeader} ${styles.th}`}>Passage</th>
          <th className={`${styles.tableHeader} ${styles.th}`}>Passage</th>

        </tr>
        {directions.length > 0 ? (
          directions.map((direction, index) => (
            <tr className={styles.tr} key={index}>
              <td className={styles.td}>{direction.directionNumber}</td>
              <td className={styles.td}>
                {parse(direction.directionText, options)}
              </td>
              <td className={styles.td}>
                {parse(direction.sectionName, options)}
              </td>
              <td className={styles.td} colSpan={4}>
                {parse(direction.passage || "", options)}
              </td>
       
              <td className={styles.td}>
                <Link to={"/admin-user/edit-direction"} state={{ direction }}>
                  <button className={styles.label}>Edit</button>
                </Link>
                <button
                  className={styles.label1}
                  onClick={() => deleteDirectionFromServer(direction._id || "")}
                  >Delete
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={8}>{progressMessage}</td>
          </tr>
        )}
      </table>
    </div>
  );
}
