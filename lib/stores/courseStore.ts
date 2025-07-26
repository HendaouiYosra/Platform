import { create } from "zustand";

type Course = {
  course_code: string;
  course_title: string;
  course_institution: string;
  course_data: any;
};

type CourseStore = {
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  fetchCourses: () => Promise<void>;
  addCourse: (newCourse: Course) => void;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export const useCourseStore = create<CourseStore>((set, get) => ({
  courses: [],
  setCourses: (courses) => set({ courses }),
  fetchCourses: async () => {
    try {
      const res = await fetch(`${API_BASE}/courses`, {
        headers: { "ngrok-skip-browser-warning": "true" },
      });
      const data = await res.json();
      set({ courses: data.courses || [] });
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  },
  addCourse: (newCourse) => {
    set((state) => ({
      courses: [newCourse, ...state.courses],
    }));
  },
}));
