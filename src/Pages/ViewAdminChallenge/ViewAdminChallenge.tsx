import SelectDropdown, { SelectOption } from "../../components/SelectDropdown";
import styles from "./viewAdminChallenge.module.css";
import React, { useEffect, useRef, useState } from "react";
import { isActiveOption, levelsOptions } from "../../constants";
import { HTMLReactParserOptions, Element, domToReact } from "html-react-parser";
import { AxiosError } from "axios";
import { showErrorToast, showSuccessToast } from "../../utils/helper";
import { deleteMaterialResources } from "../../DataService/materialResource.service";
import CustomPagination from "../../components/pagination";

import {
  AdminChallenge,
  getAdminChallenge,
} from "../../DataService/adminChallenge.service";

const options: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (domNode instanceof Element && domNode.attribs) {
      return <span>{domToReact(domNode.children)}</span>;
    }
  },
};

export function ViewAdminChallengePage() {
  const [adminChallenges, setAdminChallenges] = useState<AdminChallenge[]>([]);
  const [progressMessage, setProgressMessage] = useState("Loading ...");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<number | string>("");
  const [selectedIsActive, setSelectedIsActive] = useState("");
  const [levelsOption] = useState<SelectOption[]>(levelsOptions);
  const [isActiveOptions] = useState<SelectOption[]>(isActiveOption);
  const [activePage, setActivePage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  const handleSelectLevel = (e: React.FormEvent<HTMLSelectElement>) => {
    setSelectedLevel((e.target as HTMLSelectElement).value);
  };

  const handleSelectIsActive = (e: React.FormEvent<HTMLSelectElement>) => {
    setSelectedIsActive((e.target as HTMLSelectElement).value);
  };

  const onPageChange = async (page: number) => {
    setActivePage(page);
  };

  const resetFilter = async () => {
    setSelectedLevel("");
    setSelectedIsActive("");
  };

  const getFilterData = () => {
    const queryFilters: any = { page: activePage };
    if (selectedIsActive) {
      queryFilters.isActive = selectedIsActive === "active" ? true : false;
    }
    if (selectedLevel) {
      queryFilters.level = parseInt(selectedLevel.toString());
    }

    return queryFilters;
  };

  const LoadInit = async () => {
    await fetchAdminChallenges();
  };

  const deleteAdminChallengeFromServer = async (materialId: string) => {
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
      setAdminChallenges((prev) => {
        let newDir = prev.filter((dir) => dir._id !== materialId);
        return [...newDir];
      });

      showSuccessToast("Request Success");
    }
  };

  const fetchAdminChallenges = async () => {
    const { data, total } = await getAdminChallenge(getFilterData());

    console.log(data, getFilterData());

    setAdminChallenges(data);
    setTotalItems(total);

    if (adminChallenges.length == 0) {
      setProgressMessage("it looks like you don't have data ");
      return;
    }
  };

  useEffect(() => {
    LoadInit();
  }, []);

  useEffect(() => {
    fetchAdminChallenges();
  }, [selectedIsActive, selectedLevel, activePage]);

  return (
    <div>
      <div className={styles.adminHeader}>
        <span>
          <b>Status</b>
          <SelectDropdown
            title=""
            items={isActiveOptions}
            value={selectedIsActive}
            handleSelect={handleSelectIsActive}
            styles={{ display: "inline", width: "3rem" }}
          />
        </span>
        <span>
          <b>Level</b>
          <SelectDropdown
            title=""
            items={levelsOption}
            value={selectedLevel}
            handleSelect={handleSelectLevel}
            styles={{ display: "inline", width: "3rem" }}
          />
        </span>

        <span>
          <button className={styles.label1} onClick={() => resetFilter()}>
            Clear Filters
          </button>
        </span>
      </div>
      <div className={styles.allTable}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.row}>
              <th className={`${styles.th} ${styles.noColumn}`}>No</th>
              <th className={`${styles.th} ${styles.sectionColumn}`}>Label</th>
              <th className={`${styles.th} ${styles.yearColumn}`}>Level</th>
              <th className={`${styles.th} ${styles.sectionColumn}`}>
                Start Date
              </th>
              <th className={`${styles.th} ${styles.sectionColumn}`}>
                End Date
              </th>
              <th className={`${styles.th} ${styles.yearColumn}`}>STATUS</th>

              <th className={`${styles.th} ${styles.manageColumn}`}>Manage</th>
            </tr>
          </thead>
          <tbody>
            {adminChallenges.length > 0 ? (
              adminChallenges.map((challenge, index) => (
                <tr className={styles.tr} key={index}>
                  <td
                    className={`${styles.td} ${styles.tdNo} ${styles.tdData}`}
                  >
                    {index + 1}
                  </td>
                  <td className={`${styles.td} &{styles.tdY}`}>
                    {challenge.label}
                  </td>
                  <td className={`${styles.td} &{styles.tdY}`}>
                    {challenge.level}
                  </td>
                  <td className={styles.td}>
                    {new Date(challenge.startDate).toString() ?? ""}
                  </td>
                  <td className={styles.td}>
                    {new Date(challenge.endDate).toString() ?? ""}
                  </td>
                  <td className={styles.td}>
                    {challenge.isActive ? "Active" : "Inactive"}
                  </td>
                  <td className={`${styles.td} ${styles.tdManage}`}>
                    <button
                      className={styles.label1}
                      onClick={() =>
                        deleteAdminChallengeFromServer(challenge._id || "")
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
      <div className={styles.pagination}>
        <CustomPagination
          totalItems={totalItems}
          pageSize={10}
          onPageChange={onPageChange}
          activePage={activePage}
        />
      </div>
    </div>
  );
}
