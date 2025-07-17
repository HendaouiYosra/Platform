import { useState } from "react";
import styles from './CourseSelector.module.css';
interface SaveMappingPopupProps {
  onClose: () => void;
  onSubmit: (data: {
    mapResult: any;
    leftCourseJSON: string;
    rightCourseJSON: string;
  }) => void;
  popupData: {
    mapResult: any;
    leftCourseJSON: string;
    rightCourseJSON: string;
  };
}
const CourseSelector = ({ allCourses, onSelect, label, side }) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredCourses = allCourses.filter((c) =>
    `${c.course_code} - ${c.course_title} - ${c.course_institution}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div className={styles.selectorContainer}>
      
      <div className={styles.selector}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search courses..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)} // delay to allow click
        />
        {isOpen && (
          <div className={styles.dropdown}>
            {filteredCourses.length === 0 ? (
              <div className={styles.emptyMessage}>No matching courses</div>
            ) : (
              <div className={styles.optionsList}>
                {filteredCourses.map((c, i) => {
                  const labelText = `${c.course_code} - ${c.course_title} - ${c.course_institution}`;
                  return (
                    <div
                      key={i}
                      className={styles.option}
                      onClick={() => {
                        setQuery(labelText);
                        onSelect(labelText, side);
                        setIsOpen(false);
                      }}
                    >
                      <div className={styles.courseCode}>{c.course_code}</div>
                      <div className={styles.courseTitle}>{c.course_title}</div>
                      <div className={styles.courseInstitution}>{c.course_institution}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseSelector;
