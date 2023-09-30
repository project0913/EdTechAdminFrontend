import React, { useEffect, useState } from "react";
import styles from "./viewExamCategory.module.css";
import { ExamCategory } from "../../models/exam-catagory.model";
import {
  fetchExamCategories,
  deleteExamCategory,
} from "../../DataService/fetchExamCatagories.service";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";
import { showErrorToast, showSuccessToast } from "../../utils/helper";

export default function ViewExamCategory() {
  const [examCatagories, setExamCatagories] = useState<ExamCategory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInit();
  }, []);

  const fetchInit = async () => {
    setLoading(true);
    let data = await fetchExamCategories();
    let examCatsWithCategory = [];
    for (const examCat of data) {
      if (examCat?.category && examCat?.category === "generalQuestion")
        examCatsWithCategory.push(examCat);
    }
    setLoading(false);
    setExamCatagories(examCatsWithCategory);
  };

  const _deleteExamCategory = async (id: string) => {
    let result: any = await deleteExamCategory(id);

    if (result instanceof AxiosError) {
      let msgTxt = "";
      const messages =
        result.response?.data?.message ||
        (["something is wrong try again Later"] as Array<string>);
      for (const msg of messages) {
        msgTxt += msg + " "; //concatenate array of error messages
      }

      showErrorToast();
    } else {
      setExamCatagories((prev) => {
        let newcats = prev.filter((q) => q._id !== id);
        return [...newcats];
      });

      showSuccessToast("Request Success");
    }
  };

  return (
    <div className="">
      <div className="">
        <table className={styles.table}>
          <thead className={styles.tHeader}>
            <tr>
              <th
                className={`${styles.tableHeader} ${styles.th} ${styles.noColumn}`}
              >
                No
              </th>
              <th className={`${styles.th} ${styles.questionColumn}`}>Name</th>
              <th className={styles.th}>Category</th>

              <th className={styles.th}>Manage</th>
            </tr>
          </thead>
          <tbody>
            {!loading && examCatagories.length > 0 ? (
              examCatagories.map((examCategory, index) => (
                <tr className={styles.row} key={index}>
                  <td className={`${styles.td}  ${styles.tdData}`}>
                    {index + 1}
                  </td>

                  <td className={styles.td}>{examCategory.name}</td>
                  <td className={styles.td}>{examCategory.category}</td>

                  <td className={styles.td}>
                    <div className={styles.tdLabel}>
                      <Link
                        to={"/admin-user/edit-exam-category"}
                        state={{ examCategory }}
                      >
                        <button className={styles.label} onClick={() => {}}>
                          Edit
                        </button>
                      </Link>
                      <button
                        className={styles.label1}
                        onClick={() =>
                          _deleteExamCategory(examCategory._id || "")
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : loading ? (
              <td colSpan={4}>Loading....</td>
            ) : (
              <td colSpan={4}>no question inserted for this category</td>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
