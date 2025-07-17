"use client";
import { useState } from "react";
import HistorySidebar from "../../../components/HistorySidebar";
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
};

export default function MappingPage() {
  const [mappingMode, setMappingMode] = useState<
    "courseToCourse" | "courseToProgram"
  >("courseToCourse");
  const [sessions, setSessions] = useState<MappingSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mapResult, setMapResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [allCourses, setAllCourses] = useState<any[]>([]);

  const resultRef = useRef<HTMLDivElement | null>(null);
  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const [showPopup, setShowPopup] = useState(false);
  const updateSession = (field: "leftText" | "rightText", value: string) => {
    if (!activeSessionId) return;
    setSessions((prev) =>
      prev.map((s) => (s.id === activeSessionId ? { ...s, [field]: value } : s))
    );
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
    const selected = allCourses.find(
      (c) =>
        `${c.course_code} - ${c.course_title} - ${c.course_institution}` ===
        selectedValue
    );
    if (selected) {
      const formatted = JSON.stringify(selected.course_data, null, 2);
      updateSession(side === "left" ? "leftText" : "rightText", formatted);
      const courseId = selected.course_data.id;
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId
            ? {
                ...s,
                [side === "left" ? "leftId" : "rightId"]: courseId,
              }
            : s
        )
      );
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
    const file = e.target.files?.[0];
    if (!file || !activeSessionId) return;

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
        const courseId = data.course_id || extractedData.id; // ✅ Get from either place

        const { id, ...cleanedData } = extractedData;
        const cleanedText = JSON.stringify(cleanedData, null, 2);
        updateSession(side === "left" ? "leftText" : "rightText", cleanedText);

        // 🔒 Store courseId safely in the session
        setSessions((prev) =>
          prev.map((s) =>
            s.id === activeSessionId
              ? {
                  ...s,
                  [side === "left" ? "leftId" : "rightId"]: courseId,
                }
              : s
          )
        );
      } catch (err) {
        console.error("❌ Upload error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleMap = async () => {
    if (!activeSession) return;

    setIsLoading(true);
    setError(null);
    setMapResult(null);

    let payload;

    try {
      if (mappingMode === "courseToCourse") {
        const leftWithId = {
          ...JSON.parse(activeSession.leftText),
          id: activeSession.leftId,
        };
        const rightWithId = {
          ...JSON.parse(activeSession.rightText),
          id: activeSession.rightId,
        };
        payload = {
          source_course: leftWithId,
          target_course: rightWithId,
        };
      } else {
        payload = {
          course: {
            ...JSON.parse(activeSession.leftText),
            id: activeSession.leftId,
          },
          program: JSON.parse(activeSession.rightText),
        };
      }
    } catch (e) {
      setError("❌ Invalid JSON in input fields");
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

      const result = await res.json(); //  no JSON.parse() here!
      console.log(" Parsed result from backend:", result);
      setMapResult(result);
    } catch (err) {
      console.error(" Mapping error:", err);
      setError(" Could not complete mapping. Server error.");
    } finally {
      setIsLoading(false);
    }
  };

  const createNewSession = () => {
    const newId = crypto.randomUUID();
    const newSession: MappingSession = {
      id: newId,
      name: `Mapping ${sessions.length + 1}`,
      leftText: "",
      rightText: "",
    };
    setSessions((prev) => [...prev, newSession]);
    setActiveSessionId(newId);
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
        <HistorySidebar
          title="History"
          items={sessions.map((s) => ({ id: s.id, name: s.name }))}
          activeId={activeSessionId}
          onSelect={(id) => setActiveSessionId(id)}
          onDelete={(id) => {
            setSessions((prev) => prev.filter((s) => s.id !== id));
            if (activeSessionId === id) setActiveSessionId(null);
          }}
          onAdd={createNewSession}
        />

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
                  onClick={() => setMappingMode("courseToCourse")}
                >
                  Course to Course
                </button>
                <button
                  className={`${styles.toggleButton} ${
                    mappingMode === "courseToProgram" ? styles.active : ""
                  }`}
                  onClick={() => setMappingMode("courseToProgram")}
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
                  value={hideIdFromJson(activeSession?.leftText)}
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
                  value={hideIdFromJson(activeSession?.rightText)}
                  placeholder={`Extracted ${rightLabel.toLowerCase()}...`}
                  onChange={(e) => updateSession("rightText", e.target.value)}
                />
              </div>
            </div>
            {activeSession?.leftText && activeSession?.rightText && (
              <div className={styles.dualPanel}>
                <CourseCard
                  label="Course 1"
                  data={JSON.parse(activeSession.leftText)}
                />
                <CourseCard
                  label={rightLabel}
                  data={JSON.parse(activeSession.rightText)}
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
            leftCourseJSON:
              activeSession?.leftText && JSON.parse(activeSession.leftText),
            rightCourseJSON:
              activeSession?.rightText && JSON.parse(activeSession.rightText),
            leftId: activeSession?.leftId, // ✅ Add this
            rightId: activeSession?.rightId,
          }}
          onSubmit={async (data) => {
            try {
              const currentSession = sessions.find(
                (s) => s.id === activeSessionId
              );

              if (!currentSession?.leftId || !currentSession?.rightId) {
                alert(
                  "❌ Cannot save: course ID(s) missing. Please re-upload or reselect courses."
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
              if (result.status === "success") {
                alert("✅ Courses and mapping saved!");
                setShowPopup(false);
              } else {
                console.error("❌ Failed to save:", result.error);
                alert("❌ Failed to save mapping");
              }
            } catch (err) {
              console.error("❌ Error submitting mapping:", err);
              alert("❌ Unexpected error occurred");
            }
          }}
        />
      )}
    </>
  );
}
