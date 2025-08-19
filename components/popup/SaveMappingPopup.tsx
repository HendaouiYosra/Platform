import React, { useState } from "react";
import styles from "./SaveMappingPopup.module.css";
const API_BASE = process.env.NEXT_PUBLIC_API_URL;
interface CourseData {
  institution: string;
  institutional_type: string;
  course_title: string;
  course_code: string;
  course_level: string;
  course_type: string;
  course_contact_person: string;
  course_term_date: string;
  faculty_department: string;
  course_credit: string;
  hours_breakdown: string;
  course_description: string;
  academic_calendar_description: string;
  learning_outcomes_and_content: string[];
  covered_topics_keywords: string;
  grading_system_final_exam: string;
  group_or_individual_work: string;
  schedule_of_lectures_and_topics: string;
  textbooks_or_materials: string;
  prerequisite_corequisite_info: string;
  instructor_qualifications: string;
  instructor_name: string;
  accreditation_bodies: string;
  id: string;
}

interface MappingResult {
  decision: string;
  comparison: {
    level: {
      source: string;
      target: string;
      similarity: string;
    };
    type: {
      source: string;
      target: string;
      similarity: string;
    };
    credit: {
      source: string;
      target: string;
      similarity: string;
    };
    hours_breakdown: {
      source: string;
      target: string;
      similarity: string;
    };
    keywords_and_skills: {
      shared_keywords: string[];
      missing_in_source: string[];
      extra_in_source: string[];
    };
    learning_outcomes: {
      matched: string[];
      unmatched: string[];
    };
  };
  Comments: string;
}

interface SaveMappingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    mapResult: MappingResult;
    leftCourseJSON: CourseData;
    rightCourseJSON: CourseData;
  }) => void;
  popupData: {
    mapResult: MappingResult;
    leftCourseJSON: CourseData;
    rightCourseJSON: CourseData;
  };
}

export default function SaveMappingPopup({
  isOpen,
  onClose,
  onSubmit,
  popupData,
}: SaveMappingPopupProps) {
  const [mappingData, setMappingData] = useState<MappingResult>(
    popupData.mapResult
  );

  if (!isOpen) return null;
const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setMappingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleComparisonChange = (
    section: string,
    field: string,
    value: string
  ) => {
    setMappingData((prev) => ({
      ...prev,
      comparison: {
        ...prev.comparison,
        [section]: {
          ...prev.comparison[section as keyof typeof prev.comparison],
          [field]: value,
        },
      },
    }));
  };

  const handleArrayChange = (section: string, field: string, value: string) => {
    const arrayValue = value.split("\n").filter((item) => item.trim() !== "");
    setMappingData((prev) => ({
      ...prev,
      comparison: {
        ...prev.comparison,
        [section]: {
          ...prev.comparison[section as keyof typeof prev.comparison],
          [field]: arrayValue,
        },
      },
    }));
  };

 
  const handleSubmit = () => {
    onSubmit({
      mapResult: mappingData,
      leftCourseJSON: popupData.leftCourseJSON,
      rightCourseJSON: popupData.rightCourseJSON,
    });
  };
const buildRow = () => ({
    "Transfer Institution": popupData.leftCourseJSON.course_institution || popupData.leftCourseJSON.institution || "",
    "Transfer Course": popupData.leftCourseJSON.course_title || "",
    "Transfer Course Term": popupData.leftCourseJSON.course_term_date || "",
    "Requested Equivalent": popupData.rightCourseJSON.course_title || "",
    "Decision": mappingData.decision || "",
    "Rationale/Comments": mappingData.Comments || "",
    // "Due" left out → backend auto-fills
  });

  const handleSaveMapping = async () => {
    try {
      const res = await fetch(`${API_BASE}/save_mapping`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildRow()),
      });

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      alert("Saved to Google Sheet (" + data.action + ")");
    } catch (e: any) {
      setError("Failed to save mapping: " + e.message);
    }
  };
  return (
    <div className={styles.saveMappingPopup}>
      <div className={styles.popupContent}>
        <h2 className={styles.popupHeader}>Review and Save Mapping</h2>

        <div className={styles.csvSection}>
          <p className={styles.csvDescription}>
            Export summary: {popupData.leftCourseJSON.course_title} (
            {popupData.leftCourseJSON.course_code}) →{" "}
            {popupData.rightCourseJSON.course_title}
          </p>
          <button onClick={handleSaveMapping} className={styles.csvButton}>
            📥 Save as CSV
          </button>
        </div>

        <div className={styles.formSection}>
          <label className={styles.formLabel}>Decision</label>
          <input
            type="text"
            className={styles.formInput}
            value={mappingData.decision}
            onChange={(e) => handleInputChange("decision", e.target.value)}
          />
        </div>

        <div className={styles.formSection}>
          <label className={styles.formLabel}>Comments</label>
          <textarea
            className={styles.formTextarea}
            value={mappingData.Comments}
            onChange={(e) => handleInputChange("Comments", e.target.value)}
            rows={4}
          />
        </div>

        <div className={styles.comparisonGrid}>
          {["level", "type", "credit", "hours_breakdown"].map((section) => (
            <div key={section} className={styles.comparisonSection}>
              <h4 className={styles.sectionTitle}>
                {section
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}{" "}
                Comparison
              </h4>
              <div className={styles.formRow}>
                {["source", "target", "similarity"].map((field) => (
                  <div key={field} className={styles.formGroup}>
                    <label className={styles.formLabelSmall}>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      type="text"
                      className={styles.formInputSmall}
                      value={(mappingData.comparison as any)[section][field]}
                      onChange={(e) =>
                        handleComparisonChange(section, field, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.skillsSection}>
          {["shared_keywords", "missing_in_source", "extra_in_source"].map(
            (field) => (
              <div key={field} className={styles.formSection}>
                <label className={styles.formLabel}>
                  {field
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}{" "}
                  (one per line)
                </label>
                <textarea
                  className={styles.formTextarea}
                  value={mappingData.comparison.keywords_and_skills[field].join(
                    "\n"
                  )}
                  onChange={(e) =>
                    handleArrayChange(
                      "keywords_and_skills",
                      field,
                      e.target.value
                    )
                  }
                  rows={4}
                />
              </div>
            )
          )}
        </div>

        <div className={styles.outcomesSection}>
          {["matched", "unmatched"].map((field) => (
            <div key={field} className={styles.formSection}>
              <label className={styles.formLabel}>
                {field === "matched" ? "Matched" : "Unmatched"} Learning
                Outcomes (one per line)
              </label>
              <textarea
                className={styles.formTextarea}
                value={mappingData.comparison.learning_outcomes[field].join(
                  "\n"
                )}
                onChange={(e) =>
                  handleArrayChange("learning_outcomes", field, e.target.value)
                }
                rows={field === "matched" ? 4 : 6}
              />
            </div>
          ))}
        </div>

        <div className={styles.formActions}>
          <button onClick={handleSubmit} className={styles.submitButton}>
            ✅ Submit
          </button>
          <button onClick={onClose} className={styles.cancelButton}>
            ❌ Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
