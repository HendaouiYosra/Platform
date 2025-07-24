"use client";
import { useState } from "react";

import styles from "./MappingPage.module.css";
import MappingResult from "../../../components/result/MappingResult";
import SaveMappingPopup from "../../../components/popup/SaveMappingPopup";
import CourseCard from "../../../components/result/CourseCard";
import CourseSelector from "../../../components/selector/CourseSelector";
import { useRef, useEffect } from "react";
const API_BASE = process.env.NEXT_PUBLIC_API_URL;
type MappingSession = {
  id: string;
  name: string;
  leftText: string;
  rightText: string;
  leftId?: string;
  rightId?: string;
  mapResult?: any;
};

export default function MappingPage() {
  const [mappingMode, setMappingMode] = useState<
    "courseToCourse" | "courseToProgram"
  >("courseToCourse");

const [sessions, setSessions] = useState<{
  courseToCourse: MappingSession;
  courseToProgram: MappingSession;
}>({
  courseToCourse: {
    id: "ctc",
    name: "Course to Course",
    leftText: "",
    rightText: "",
  },
  courseToProgram: {
    id: "ctp",
    name: "Course to Program",
    leftText: "",
    rightText: "",
  },
});
const session = sessions[mappingMode];
  const [isLoading, setIsLoading] = useState(false);
  const [mapResult, setMapResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [selectedLeftCourse, setSelectedLeftCourse] = useState<string>("");
  const [selectedRightCourse, setSelectedRightCourse] = useState<string>("");

  const resultRef = useRef<HTMLDivElement | null>(null);

  const [showPopup, setShowPopup] = useState(false);
  const updateSession = (field: "leftText" | "rightText", value: string) => {
    setSessions((prev) => ({
  ...prev,
  [mappingMode]: {
    ...prev[mappingMode],
    
    [field]: value
  },
}));
  };
  const hideIdFromJson = (json: string | undefined) => {
    try {
      const parsed = JSON.parse(json || "{}");
      delete parsed.id;
      return JSON.stringify(parsed, null, 2); // formatted
    } catch (e) {
      return json || "";
    }
  };

  //fetch the list of courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_BASE}/courses`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });
        // Check for error response
        if (!res.ok) {
          const errText = await res.text();
          console.error(" Server returned error:", errText);
          return;
        }
        const data = await res.json();
        console.log(" Got courses:", data);
        setAllCourses(data.courses || []);
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };

    fetchCourses();
  }, []);

  //handler of the course selector
  const handleCourseSelect = (
    selectedValue: string,
    side: "left" | "right"
  ) => {
    if (side === "left") {
      setSelectedLeftCourse(selectedValue);
    } else {
      setSelectedRightCourse(selectedValue);
    }

    const selected = allCourses.find(
      (c) =>
        `${c.course_code} - ${c.course_title} - ${c.course_institution}` ===
        selectedValue
    );

    if (selected) {
      const formatted = JSON.stringify(selected.course_data, null, 2);
      updateSession(side === "left" ? "leftText" : "rightText", formatted);
      const courseId = selected.course_data.id;

      setSessions((prev) => ({
  ...prev,
  [mappingMode]: {
    ...prev[mappingMode],
    [side === "left" ? "leftId" : "rightId"]: courseId, // ✅ now inside courseToCourse or courseToProgram
  },
}));

    }
  };

  useEffect(() => {
    if (mapResult && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [mapResult]);
  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    side: "left" | "right"
  ) => {
    setMapResult(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result?.toString().split(",")[1];
      const payload = {
        filename: file.name,
        content: base64,
        message: "the course",
      };

      const isProgram = mappingMode === "courseToProgram" && side === "right";
      const endpoint = isProgram
        ? `${API_BASE}/extract_program`
        : `${API_BASE}/extract_skills`;

      setIsLoading(true);
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        const extractedData = data.extracted;
        const courseId = data.course_id || extractedData.id; // Get from either place

        const { id, ...cleanedData } = extractedData;
        const cleanedText = JSON.stringify(cleanedData, null, 2);
        updateSession(side === "left" ? "leftText" : "rightText", cleanedText);

        // Store courseId safely in the session
        setSessions((prev) => ({
  ...prev,
  [mappingMode]: {
    ...prev[mappingMode],
    [side === "left" ? "leftText" : "rightText"]: cleanedText,
    [side === "left" ? "leftId" : "rightId"]: courseId, //  this line is missing!
  },
}));
      } catch (err) {
        console.error(" Upload error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsDataURL(file);
  };
  const handleMap = async () => {
    if (!session) return;

    setIsLoading(true);
    setError(null);
    setMapResult(null);

    let payload;

    try {
      if (mappingMode === "courseToCourse") {
        const leftWithId = {
          ...JSON.parse(session.leftText),
          id: session.leftId,
        };
        const rightWithId = {
          ...JSON.parse(session.rightText),
          id: session.rightId,
        };
        payload = {
          source_course: leftWithId,
          target_course: rightWithId,
        };
      } else {
        payload = {
          course: {
            ...JSON.parse(session.leftText),
            id: session.leftId,
          },
          program: JSON.parse(session.rightText),
        };
      }
    } catch (e) {
      setError(" Invalid JSON in input fields");
      setIsLoading(false);
      return;
    }

    const endpoint =
      mappingMode === "courseToCourse"
        ? `${API_BASE}/map_course_to_course`
        : `${API_BASE}/map_program`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        setError(` Server error: ${errText}`);
        return;
      }

      const result = await res.json();

      console.log("Parsed result from backend:", result);

      //  Sync mapResult state for UI + session storage
      setMapResult(result);
      setSessions((prev) => ({
  ...prev,
  [mappingMode]: {
    ...prev[mappingMode],
    mapResult: result,
  },
}));

    } catch (err) {
      console.error("Mapping error:", err);
      setError("Could not complete mapping. Server error.");
    } finally {
      setIsLoading(false);
    }
  };

  const leftLabel = "Course 1";
  const rightLabel = mappingMode === "courseToProgram" ? "Program" : "Course 2";

  return (
    <>
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loader}>Extracting data, please wait...</div>
        </div>
      )}

      <div className={styles.chatLayout}>
        <div className={styles.chatArea}>
          <div className={styles.titleContainer}>
            <h1 className={styles.heading}>
              Skill Mapping Has Never Been Easier
            </h1>
            <p className={styles.subheading}>
              Choose the type of mapping you want to perform
            </p>
            <div className={styles.toggleWrapper}>
              <div className={styles.toggleGroup}>
                <button
                  className={`${styles.toggleButton} ${
                    mappingMode === "courseToCourse" ? styles.active : ""
                  }`}
                  onClick={() => {
  setMappingMode("courseToCourse");
  setSelectedLeftCourse("");
  setSelectedRightCourse("");
  setMapResult(null);
  setError(null);
}}
                >
                  Course to Course
                </button>
                <button
                  className={`${styles.toggleButton} ${
                    mappingMode === "courseToProgram" ? styles.active : ""
                  }`}
                  onClick={() => {setMappingMode("courseToProgram");
                    setSelectedLeftCourse("");
  setSelectedRightCourse("");
  setMapResult(null);
  setError(null);
                  }}
                >
                  Course to Program
                </button>
              </div>
            </div>
          </div>
          <div className={styles.scrollablePanel}>
            <div className={styles.dualPanel}>
              <div className={styles.uploadBlock}>
                <div className={styles.uploadHeader}>
                  <label className={styles.label}>{leftLabel}</label>
                  <CourseSelector
                    allCourses={allCourses}
                    onSelect={handleCourseSelect}
                    label={leftLabel}
                    selectedValue={selectedLeftCourse}
                    side="left"
                  />

                  <label className={styles.uploadLabel}>
                    Upload File
                    <input
                      type="file"
                      onChange={(e) => handleUpload(e, "left")}
                      className={styles.hiddenFileInput}
                    />
                  </label>
                </div>
                <textarea
                  className={styles.textarea}
                  value={hideIdFromJson(session?.leftText)}
                  placeholder={`Extracted ${leftLabel.toLowerCase()}...`}
                  onChange={(e) => updateSession("leftText", e.target.value)}
                />
              </div>

              <div className={styles.uploadBlock}>
                <div className={styles.uploadHeader}>
                  <label className={styles.label}>{rightLabel}</label>
                  <CourseSelector
                    allCourses={allCourses}
                    onSelect={handleCourseSelect}
                    label={rightLabel}
                    side="right"
                    selectedValue={selectedRightCourse}
                  />

                  <label className={styles.uploadLabel}>
                    Upload File
                    <input
                      type="file"
                      onChange={(e) => handleUpload(e, "right")}
                      className={styles.hiddenFileInput}
                    />
                  </label>
                </div>
                <textarea
                  className={styles.textarea}
                  value={hideIdFromJson(session?.rightText)}
                  placeholder={`Extracted ${rightLabel.toLowerCase()}...`}
                  onChange={(e) => updateSession("rightText", e.target.value)}
                />
              </div>
            </div>
            {session?.leftText && session?.rightText && (
              <div className={styles.dualPanel}>
                <CourseCard
                  label="Course 1"
                  data={JSON.parse(session.leftText)}
                />
                <CourseCard
                  label={rightLabel}
                  data={JSON.parse(session.rightText)}
                />
              </div>
            )}

            <div className={styles.mapButtonWrapper}>
              <button className={styles.mapButton} onClick={handleMap}>
                {" "}
                Map
              </button>
            </div>
            {mapResult && (
              <div ref={resultRef}>
                <MappingResult data={mapResult} />

                <div className={styles.mapButtonWrapper}>
                  <button
                    className={styles.mapButton}
                    onClick={() => setShowPopup(true)}
                  >
                    Save Mapping
                  </button>{" "}
                </div>
              </div>
            )}

            {error && (
              <div className={styles.errorBox}>
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {showPopup && (
        <SaveMappingPopup
          isOpen={true}
          onClose={() => setShowPopup(false)}
          popupData={{
            mapResult,
            leftCourseJSON: session?.leftText && JSON.parse(session.leftText),
            rightCourseJSON:
              session?.rightText && JSON.parse(session.rightText),
            leftId: session?.leftId, // Add this
            rightId: session?.rightId,
          }}
          onSubmit={async (data) => {
            try {
              const currentSession = session;

              if (!currentSession?.leftId || !currentSession?.rightId) {
                alert(
                  " Cannot save: course ID(s) missing. Please re-upload or reselect courses."
                );
                return;
              }

              // Inject IDs back before saving
              const leftWithId = {
                ...data.leftCourseJSON,
                id: currentSession.leftId,
              };

              const rightWithId = {
                ...data.rightCourseJSON,
                id: currentSession.rightId,
              };

              const payload = {
                source_course: leftWithId,
                target_course: rightWithId,
                mapping_result: data.mapResult,
              };

              const res = await fetch(`${API_BASE}/save_course_mapping`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              });

              const result = await res.json();
              if (result.status === "success" || result.status === "updated") {
                alert(" Courses and mapping saved!");
                setSessions((prev) => ({
  ...prev,
  [mappingMode]: {
    ...prev[mappingMode],
    mapResult: result,
  },
}));

                setMapResult(data.mapResult); //  Update main UI result too
                setShowPopup(false);
              } else {
                console.error(
                  " Failed to save:",
                  result.error || result.message
                );
                alert(" Failed to save mapping");
              }
            } catch (err) {
              console.error(" Error submitting mapping:", err);
              alert(" Unexpected error occurred");
            }
          }}
        />
      )}
    </>
  );
}
