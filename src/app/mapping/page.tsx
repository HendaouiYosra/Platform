"use client";
import { useState } from "react";
import HistorySidebar from "../../../components/HistorySidebar";
import styles from "./MappingPage.module.css";
import MappingResult from "../../../components/result/MappingResult";
import SaveMappingPopup from "../../../components/popup/SaveMappingPopup";
import CourseCard from "../../../components/result/CourseCard";
import { useRef, useEffect } from "react";
const API_BASE = "https://3cd7f2036e5c.ngrok-free.app";
type MappingSession = {
  id: string;
  name: string;
  leftText: string;
  rightText: string;
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
  const resultRef = useRef<HTMLDivElement | null>(null);
  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const [showPopup, setShowPopup] = useState(false);
  const updateSession = (field: "leftText" | "rightText", value: string) => {
    if (!activeSessionId) return;
    setSessions((prev) =>
      prev.map((s) => (s.id === activeSessionId ? { ...s, [field]: value } : s))
    );
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
        const extracted = JSON.stringify(data.extracted, null, 2);
        //alert(extracted);
        updateSession(side === "left" ? "leftText" : "rightText", extracted);
      } catch (err) {
        console.error("❌ Upload error:", err);
      } finally {
        setIsLoading(false); // Stop loading regardless of success or error
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
      payload =
        mappingMode === "courseToCourse"
          ? {
              source_course: JSON.parse(activeSession.leftText),
              target_course: JSON.parse(activeSession.rightText),
            }
          : {
              course: JSON.parse(activeSession.leftText),
              program: JSON.parse(activeSession.rightText),
            };
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
        setError(`❌ Server error: ${errText}`);
        return;
      }

      const result = await res.json(); // 🚫 no JSON.parse() here!
      console.log("✅ Parsed result from backend:", result);
      setMapResult(result);
    } catch (err) {
      console.error("❌ Mapping error:", err);
      setError("❌ Could not complete mapping. Server error.");
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
                  value={activeSession?.leftText || ""}
                  placeholder={`Extracted ${leftLabel.toLowerCase()}...`}
                  onChange={(e) => updateSession("leftText", e.target.value)}
                />
              </div>

              <div className={styles.uploadBlock}>
                <div className={styles.uploadHeader}>
                  <label className={styles.label}>{rightLabel}</label>
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
                  value={activeSession?.rightText || ""}
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
          onClose={() => setShowPopup(false)}
          onSubmit={(data) => {
            console.log("✅ Data received from popup:", data);
            // You can use `data.mapResult`, `data.leftCourse`, etc.
          }}
          popupData={{
            mapResult,
            leftCourseJSON: activeSession?.leftText,
            rightCourseJSON: activeSession?.rightText,
          }}
        />
      )}
    </>
  );
}
