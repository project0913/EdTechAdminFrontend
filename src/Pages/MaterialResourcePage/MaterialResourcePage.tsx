import { CSSProperties, useEffect, useState } from "react";
import styles from "./materialResourcePage.module.css";
import { AxiosError } from "axios";
import { showErrorToast, showSuccessToast } from "../../utils/helper";
import {
  createExamCategories,
  fetchExamCategories,
} from "../../DataService/fetchExamCatagories.service";
import ErrorComponent from "../../components/ErrorComponent";
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import { FadeLoader } from "react-spinners";
import SelectDropdown, { SelectOption } from "../../components/SelectDropdown";
import { Course } from "../../models/exam-catagory.model";
import { useLocation } from "react-router-dom";
import { IMaterialResource } from "../../models/materialResource.model";
import {
  createMaterialResources,
  updateMaterialResources,
} from "../../DataService/materialResource.service";

const override: CSSProperties = {
  margin: "10 auto",
  borderColor: "red",
};

export const MaterialResourcePage = () => {
  const location = useLocation();
  const [grade, setGrade] = useState<string | number>("");
  const [chapter, setChapter] = useState<string | number>("");
  const [courseId, setCourseId] = useState("");

  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [message, setErrorMessage] = useState("");
  const [materialResource, setMaterialResource] = useState(""); // selectedFilePath
  const [selectedFilePath, setSelectedFilePath] = useState("");
  const [courses, setCourses] = useState<SelectOption[]>([]);

  const [editableMaterialResource, setEditableMaterialResource] =
    useState<any>(null);

  useEffect(() => {
    fetchInitialFromServer();
  }, []);

  async function fetchInitialFromServer() {
    let data = await fetchExamCategories();
    console.log(data);

    let UEECourses = data.find((e) => e._id == "63a2ecdeee469ea43cdacbac");
    let courses: Course[] = [];
    if (UEECourses) courses = UEECourses.courses;
    let crs: SelectOption[] = [];

    for (const course of courses) {
      //    if (course.hasDirections) continue;

      crs.push({ label: course.name, value: course._id });
    }

    let coursesOption = [];
    for (const course of data[0].courses) {
      coursesOption.push({ label: course.name, value: course._id });
    }

    if (!crs.length) return;

    setCourses(crs);
    setCourseId(crs[0].value.toString());

    //if navigated from edit route
    const editableMaterialResourceState = location.state
      ?.materialResource as IMaterialResource;

    if (editableMaterialResourceState) {
      console.log("eddit mode a");

      setIsEditMode(true);
      setEditableMaterialResource(editableMaterialResourceState ?? null);
      setCourseId(editableMaterialResourceState?.courseId ?? "");
      setGrade(editableMaterialResourceState?.grade ?? "9");
      setChapter(editableMaterialResourceState?.chapter ?? "1");
      setSelectedFilePath("");
    }
  }

  function handleMaterialResourceChange(e: any) {
    console.log(e.target.files);
    setSelectedFilePath(URL.createObjectURL(e.target.files[0]));
    setMaterialResource(e.target.files[0]);
    console.log(materialResource);
  }

  const submitMaterialResource = async () => {
    if (!grade || !chapter || !courseId) {
      showErrorToast("fill all requires fields");
      return;
    }
    if (!isEditMode && !selectedFilePath) {
      showErrorToast("fill all requires fields");
      return;
    }

    setLoading((prev) => true);

    let materialResourceSchema: any = {
      grade: parseInt(grade.toString()),
      chapter: parseInt(chapter.toString()),
      materialResource,
      courseId,
    };

    console.log(materialResourceSchema);

    let result;

    if (!isEditMode) {
      result = await createMaterialResources(materialResourceSchema);
    } else {
      if (!materialResource) delete materialResourceSchema.materialResource;
      result = await updateMaterialResources(
        editableMaterialResource?._id ?? "",
        materialResourceSchema
      );
    }

    setLoading((prev) => false);
    if (result instanceof AxiosError) {
      let msgTxt = "";
      const messages =
        result.response?.data?.message ||
        (["something is wrong try again Later"] as Array<string>);
      for (const msg of messages) msgTxt += msg + " ";
      setErrorMessage(msgTxt);
      showErrorToast();
    } else {
      showSuccessToast("Request Success ");
    }
  };

  const handleCourseChange = (e: any) => {
    setCourseId(e.target.value);
  };

  return (
    <LoadingOverlayWrapper
      active={loading}
      spinner={
        <FadeLoader
          loading={loading}
          cssOverride={override}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      }
    >
      <div className={styles.headerBg} style={{ marginLeft: "50px" }}>
        <div className="course-selection">
          <p className={styles.txt}>Courses:</p>
          <SelectDropdown
            title=""
            items={courses}
            value={courseId}
            handleSelect={handleCourseChange}
          />
        </div>

        <div>
          <p className={styles.txt}>Grade:</p>
          <input
            value={grade}
            type="number"
            min={9}
            max={12}
            placeholder="9"
            onChange={(e) => setGrade(e.target.value)}
            className={`${styles.editor} ${styles.grade}`}
          />
          <br />
          <ErrorComponent value={grade.toString()} />
        </div>

        <div>
          <p className={styles.txt}>Chapter:</p>
          <input
            value={chapter}
            type="number"
            min={1}
            max={20}
            placeholder="1"
            onChange={(e) => setChapter(e.target.value)}
            className={`${styles.editor} ${styles.chapter}`}
          />
          <br />
          <ErrorComponent value={chapter.toString()} />
        </div>

        <div className={styles.plainTxt}>
          {selectedFilePath ? (
            <div style={{ height: "200px", width: "200px", marginTop: "50px" }}>
              <embed
                src={selectedFilePath}
                type="application/pdf"
                width="100%"
                height="100%"
              />
            </div>
          ) : null}
          <p className={styles.txt}>Select Material Resource</p>
          <div style={{ display: "flex", alignItems: "center" }}>
            <label htmlFor="file" className={styles.chooseFileButton}>
              <span>Choose File</span>
              <input
                type="file"
                id="file"
                onChange={handleMaterialResourceChange}
                className={styles.plainTxt}
                style={{ display: "none" }}
              />
            </label>
            <span className={styles.txt}>
              {selectedFilePath ? "" : "No file chosen"}
            </span>
          </div>
        </div>

        <div style={{ marginTop: "20px" }}>
          <button
            onClick={() => {
              submitMaterialResource();
            }}
            className={styles.submitBtn}
          >
            Submit
          </button>
        </div>
      </div>
    </LoadingOverlayWrapper>
  );
};
