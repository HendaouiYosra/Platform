import styles from "./CourseCard.module.css";

interface CourseData {
  course_code: string;
  course_title: string;
  institution: string;
  institutional_type: string;
  instructor_name: string;
  course_term_date: string;
  course_type: string;
  course_level: string;
  course_description: string;
  learning_outcomes_and_content: string;
  covered_topics_keywords: string;
  course_credit: string;
  hours_breakdown: string;
}

interface Props {
  label: string;
  data: CourseData;
}

const CourseCard = ({ label, data }: Props) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        <div className={styles.title}>{data.course_code}-{data.course_title}</div>
        <div className={styles.institution}>{data.institution}</div>
      </div>

      <div className={styles.metaRow}>
        <span>
          <strong>Instructor:</strong> {data.instructor_name || "Unknown"}
        </span>
        <span>
          <strong>Term:</strong> {data.course_term_date || "Unknown"}
        </span>
      </div>

      <div className={styles.badges}>
        <span className={`${styles.badge} ${styles[data.course_type]}`}>
          {data.course_type}
        </span>
        <span className={`${styles.badge} ${styles[data.course_level]}`}>
          {data.course_level}
        </span>
      </div>

      <div className={styles.section}>
        <strong>Description:</strong>
        <p>{data.course_description}</p>
      </div>

      <div className={styles.section}>
        <strong>Learning Outcomes:</strong>
        <p>{data.learning_outcomes_and_content}</p>
      </div>

      <div className={styles.section}>
        <strong>Covered Topics:</strong>
        <p className={styles.keywords}>{data.covered_topics_keywords}</p>
      </div>

      <div className={styles.metaRow}>
        <span>
          <strong>Credit:</strong> {data.course_credit || "N/A"}
        </span>
        <span>
          <strong>Hours:</strong> {data.hours_breakdown || "N/A"}
        </span>
      </div>
    </div>
  );
};

export default CourseCard;
