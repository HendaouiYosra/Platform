"use client";
import { useEffect, useState } from "react";
import { useCourseStore } from "../../../lib/stores/courseStore";
import styles from "./Courses.module.css";

const Courses = () => {
  const { courses, fetchCourses, deleteCourse } = useCourseStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingCourses, setDeletingCourses] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const loadCourses = async () => {
      try {
        await fetchCourses();
      } catch (err) {
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [fetchCourses]);

  const handleDelete = async (courseId: string) => {
    if (!courseId) return;

    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }

    setDeletingCourses((prev) => new Set(prev).add(courseId));

    try {
      await deleteCourse(courseId);
    } catch (err) {
      alert("Failed to delete course. Please try again.");
    } finally {
      setDeletingCourses((prev) => {
        const newSet = new Set(prev);
        newSet.delete(courseId);
        return newSet;
      });
    }
  };

  const getInstructor = (courseData: any) => {
    return (
      courseData?.instructor_name ||
      courseData?.course_contact_person ||
      "Not specified"
    );
  };
  if (loading) {
    return (
      <div className={styles.coursesContainer}>
        <div className={styles.loadingMessage}>Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.coursesContainer}>
        <div className={styles.errorMessage}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.coursesContainer}>
      <div className={styles.coursesHeader}>
        <h1 className={styles.coursesTitle}>Course Management</h1>
        <p className={styles.coursesSubtitle}>
          Manage your course collection - view details and delete courses as
          needed
        </p>
      </div>

      {courses.length === 0 ? (
        <div className={styles.emptyState}>
          <h2 className={styles.emptyStateTitle}>No courses found</h2>
          <p className={styles.emptyStateMessage}>
            Upload some courses to get started with course mapping.
          </p>
        </div>
      ) : (
        <div className={styles.coursesGrid}>
          {courses.map((course, index) => (
            <div
              key={course.course_data?.id || index}
              className={styles.courseCard}
            >
              <div className={styles.courseCardHeader}>
                <div className={styles.courseMainInfo}>
                  <div className={styles.courseCode}>{course.course_code}</div>
                  <h3 className={styles.courseTitle}>{course.course_title}</h3>
                  <div className={styles.courseInstitution}>
                    {course.course_institution}
                  </div>
                  <div className={styles.courseInstructor}>
                    <span className={styles.instructorLabel}>Instructor: </span>
                    {getInstructor(course.course_data)}
                  </div>
                </div>
                {course.course_data?.id && (
                  <button
                    onClick={() => handleDelete(course.course_data.id)}
                    disabled={deletingCourses.has(course.course_data.id)}
                    className={styles.deleteButton}
                  >
                    {deletingCourses.has(course.course_data.id)
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
