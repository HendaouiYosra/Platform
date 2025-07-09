import React from "react";
import styles from "./SaveMappingPopup.module.css";

export default function SaveMappingPopup(props: {
  popupData: {
    mapResult: any;
    leftCourseJSON: string;
    rightCourseJSON: string;
  };
  onClose: () => void;
  onSubmit: (data: {
    decision: string;
    combined_score: number;
    source_course: { code: string; name: string };
    target_course: { code: string; name: string };
  }) => void;
}) {
  const { popupData, onClose, onSubmit } = props;
  const { mapResult, leftCourseJSON, rightCourseJSON } = popupData;

  const leftCourse = JSON.parse(leftCourseJSON || "{}");
  const rightCourse = JSON.parse(rightCourseJSON || "{}");

  const handleConfirm = () => {
    const payload = {
      decision: mapResult?.decision,
      combined_score: mapResult?.combined_score,
      source_course: {
        code: leftCourse.course_code,
        name: leftCourse.course_name,
      },
      target_course: {
        code: rightCourse.course_code,
        name: rightCourse.course_name,
      },
    };

    onSubmit(payload);
  };

  return (
    <div className={styles.popupContainer}>
      <div className={styles.popupContent}>
        <h3>Review Mapping</h3>
        <p>
          <strong>Decision:</strong> {mapResult?.decision}
        </p>
        <p>
          <strong>Score:</strong> {mapResult?.combined_score?.toFixed(2)}%
        </p>
        <p>
          <strong>Source Course:</strong> {leftCourse.course_code} -{" "}
          {leftCourse.course_name}
        </p>
        <p>
          <strong>Target Course:</strong> {rightCourse.course_code} -{" "}
          {rightCourse.course_name}
        </p>

        <div className={styles.buttonGroup}>
          <button className={styles.confirmButton} onClick={handleConfirm}>
            Confirm Save
          </button>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
