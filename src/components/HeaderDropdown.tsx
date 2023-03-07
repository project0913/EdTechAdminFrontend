import React from "react";

export default function HeaderDropdown() {
  return (
    <div className={styles.bgDrop}>
      <div className={styles.dropdownItem1}>
        <div>
          <b className={styles.adminTopText}>Exam Category</b>
          <SelectDropdown
            title=""
            items={examCatagories}
            handleSelect={handleExamCategoryChange}
          />
        </div>
        <div className="course-selection">
          <b className={styles.adminTopText}>Courses</b>
          <SelectDropdown
            title=""
            items={courses}
            handleSelect={handleCourseChange}
          />
        </div>
        <div className="subCategory">
          <b className={styles.adminTopText}>Sub Category</b>
          <SelectDropdown
            title=""
            items={subExamCategory}
            handleSelect={handleSubExamCategoryChange}
          />
        </div>
      </div>
    </div>
  );
}
