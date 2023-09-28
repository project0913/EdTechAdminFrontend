import SelectDropdown, { SelectOption } from "../../components/SelectDropdown";
import styles from "./ViewMaterialResourcePage.module.css";
import React, { useEffect, useRef, useState } from "react";
import { courseIdToName, coursesOptions, gradeOptions } from "../../constants";
import { HTMLReactParserOptions, Element, domToReact } from "html-react-parser";
import { Link } from "react-router-dom";
import { fetchDirectionOfCourseByYearAsArray } from "../../DataService/fetchCourse.service";
import { AxiosError } from "axios";
import { showErrorToast, showSuccessToast } from "../../utils/helper";
import { IMaterialResource } from "../../models/materialResource.model";
import {
  deleteMaterialResources,
  fetchMaterialResources,
} from "../../DataService/materialResource.service";
import { baseURL } from "../../api/axios";

const options: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (domNode instanceof Element && domNode.attribs) {
      return <span>{domToReact(domNode.children)}</span>;
    }
  },
};

export default function ViewMaterialResourcePage() {
  const [materialResources, setMaterialResources] = useState<
    IMaterialResource[]
  >([]);
  const [progressMessage, setProgressMessage] = useState("Loading ...");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<number | string>("9");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [gradesOption] = useState<SelectOption[]>(gradeOptions);
  const [courseOptions] = useState<SelectOption[]>(coursesOptions);
  const isInitialMount = useRef(true);

  const handleSelectYear = (e: React.FormEvent<HTMLSelectElement>) => {
    setSelectedGrade((e.target as HTMLSelectElement).value);
  };
  const handleSelectCourse = (e: React.FormEvent<HTMLSelectElement>) => {
    setSelectedCourse((e.target as HTMLSelectElement).value);
  };
  const LoadInit = async () => {
    setSelectedCourse(coursesOptions[0].value);
    setSelectedGrade(gradeOptions[0].value);
    await fetchMaterials();
  };

  const deleteMaterialResourceFromServer = async (materialId: string) => {
    let result = await deleteMaterialResources(materialId);
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
      setMaterialResources((prev) => {
        let newDir = prev.filter((dir) => dir._id !== materialId);
        return [...newDir];
      });

      showSuccessToast("Request Success");
    }
  };

  const fetchMaterials = async () => {
    const fetchedMaterials = await fetchMaterialResources({
      courseId: selectedCourse,
      grade: selectedGrade,
    });
    console.log(fetchedMaterials);

    setMaterialResources(fetchedMaterials);

    if (fetchedMaterials.length == 0) {
      setProgressMessage("it looks like you don't have data yet");
      return;
    }
  };
  useEffect(() => {
    LoadInit();
  }, []);

  useEffect(() => {
    fetchMaterials();
  }, [selectedCourse, selectedGrade]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      (async () => {
        const directionsFromServer = await fetchDirectionOfCourseByYearAsArray(
          selectedCourse,
          parseInt(selectedGrade.toString())
        );
        setMaterialResources(directionsFromServer);
      })();
    }
  }, [selectedGrade]);

  return (
    <div>
      <div className={styles.adminHeader}>
        <span>
          <b>Select Course</b>
          <SelectDropdown
            title=""
            items={courseOptions}
            value={selectedCourse}
            handleSelect={handleSelectCourse}
            styles={{ display: "inline", width: "3rem" }}
          />
        </span>
        <span>
          <b>Select Year</b>
          <SelectDropdown
            title=""
            items={gradesOption}
            value={selectedGrade}
            handleSelect={handleSelectYear}
            styles={{ display: "inline", width: "3rem" }}
          />
        </span>
      </div>
      <div className={styles.allTable}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.row}>
              <th className={`${styles.th} ${styles.noColumn}`}>No</th>
              <th className={`${styles.th} ${styles.yearColumn}`}>Grade</th>
              <th className={`${styles.th} ${styles.sectionColumn}`}>course</th>
              <th className={`${styles.th} ${styles.yearColumn}`}>chapter</th>
              <th className={`${styles.th} ${styles.directionColumn}`}>URL</th>

              <th className={`${styles.th} ${styles.manageColumn}`}>Manage</th>
            </tr>
          </thead>
          <tbody>
            {materialResources.length > 0 ? (
              materialResources.map((material, index) => (
                <tr className={styles.tr} key={index}>
                  <td
                    className={`${styles.td} ${styles.tdNo} ${styles.tdData}`}
                  >
                    {index + 1}
                  </td>
                  <td className={`${styles.td} &{styles.tdY}`}>
                    {material.grade}
                  </td>
                  <td className={styles.td}>
                    {courseIdToName(material.courseId ?? "")}
                  </td>
                  <td className={styles.td}>{material.chapter}</td>
                  <td className={styles.td}>
                    {baseURL + "/material-resources/" + material.url}
                  </td>
                  <td className={`${styles.td} ${styles.tdManage}`}>
                    <Link
                      to={"/admin-user/edit-material-resources"}
                      state={{ materialResource: material }}
                    >
                      <button className={styles.label}>Edit</button>
                    </Link>
                    <button
                      className={styles.label1}
                      onClick={() =>
                        deleteMaterialResourceFromServer(material._id || "")
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}> {progressMessage}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
