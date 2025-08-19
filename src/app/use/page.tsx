"use client";
import { useState } from "react";
import styles from "./Use.module.css";

export default function HowToUse() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "course-extraction", label: "Course to Course Mapping" }, // renamed tab label

    { id: "course-mapping", label: "Course to Program Mapping" },
    { id: "academic-chat", label: "Academic Chat" },

    { id: "results", label: "Understanding Results" },
  ];

  const renderOverview = () => (
    <div className={styles.tabContent}>
      <h2 className={styles.sectionTitle}>
        Course Credit & Skill Mapping Platform
      </h2>
      <p className={styles.paragraph}>
        This platform helps universities handle course credit transfer and
        curriculum alignment. It removes the manual hassle of comparing course
        outlines by using advanced AI technology for accurate analysis and
        decision-making.
      </p>

      <div className={styles.featureGrid}>
        <div className={styles.featureCard}>
          <div className={`${styles.featureIcon} ${styles.featureIconPrimary}`}>
            <div
              className={`${styles.featureIconBox} ${styles.featureIconBoxPrimary}`}
            ></div>
          </div>
          <h3 className={styles.featureTitle}>Extract Course Information</h3>
          <p className={styles.featureDescription}>
            Upload a course outline (PDF) and automatically extract structured
            data like course code, title, description, learning outcomes, hours
            breakdown, and more.
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={`${styles.featureIcon} ${styles.featureIconInfo}`}>
            <div
              className={`${styles.featureIconBox} ${styles.featureIconBoxInfo}`}
            ></div>
          </div>
          <h3 className={styles.featureTitle}>Course-to-Course Mapping</h3>
          <p className={styles.featureDescription}>
            Compare a course from one institution to another and receive a
            detailed evaluation including whether it's equivalent, partially
            transferable, or not acceptable based on criteria like content
            overlap, level, hours.
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={`${styles.featureIcon} ${styles.featureIconSuccess}`}>
            <div
              className={`${styles.featureIconBox} ${styles.featureIconBoxSuccess}`}
            ></div>
          </div>
          <h3 className={styles.featureTitle}>
            Course-to-Program Outcome Mapping
          </h3>
          <p className={styles.featureDescription}>
            Map the skills from a course to a structured set of program learning
            outcomes. Useful for curriculum alignment and ensuring comprehensive
            coverage.
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={`${styles.featureIcon} ${styles.featureIconWarning}`}>
            <div
              className={`${styles.featureIconBox} ${styles.featureIconBoxWarning}`}
            ></div>
          </div>
          <h3 className={styles.featureTitle}>Ask Questions (Chatbot)</h3>
          <p className={styles.featureDescription}>
            Upload course PDFs and ask questions in natural language. The
            chatbot uses RAG (Retrieval-Augmented Generation) to give
            context-aware answers based on the actual uploaded content.
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={`${styles.featureIcon} ${styles.featureIconPrimary}`}>
            <div
              className={`${styles.featureIconBox} ${styles.featureIconBoxPrimary}`}
            ></div>
          </div>
          <h3 className={styles.featureTitle}>Save and Reuse</h3>
          <p className={styles.featureDescription}>
            All extracted data, mappings, and conversations are stored in
            MongoDB Atlas. This avoids repeated LLM calls and allows users to
            reuse and review past work.
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={`${styles.featureIcon} ${styles.featureIconInfo}`}>
            <div
              className={`${styles.featureIconBox} ${styles.featureIconBoxInfo}`}
            ></div>
          </div>
          <h3 className={styles.featureTitle}>Manage Saved Courses</h3>
          <p className={styles.featureDescription}>
            You can edit or delete previously saved courses. This makes it easy
            to correct mistakes or remove outdated outlines from your system.
          </p>
        </div>
      </div>
    </div>
  );

  // UPDATED: Course-to-Course Mapping flow replaces the old "Course Extraction" content
  const renderCourseExtraction = () => (
    <div className={styles.tabContent}>
      <h2 className={styles.sectionTitle}>Course to Course Mapping</h2>
      <p className={styles.paragraph}>
        Compare two courses side-by-side to determine equivalency. Follow the
        steps to upload PDFs, extract data, run the mapping, review differences
        and matches, then save (with edits if needed) to persist the result.
      </p>

      <div className={styles.stepsList}>
        <div className={styles.step}>
          <div className={`${styles.stepNumber} ${styles.stepNumberPrimary}`}>
            1
          </div>
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Upload Course PDF(s)</h3>
            <p className={styles.stepDescription}>
              Upload the source and target course outline PDFs (or a single file
              if only one side is available). Make sure the PDFs are
              text-selectable for best results.
            </p>
          </div>
        </div>

        <div className={styles.step}>
          <div className={`${styles.stepNumber} ${styles.stepNumberPrimary}`}>
            2
          </div>
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Extract Structured Data</h3>
            <p className={styles.stepDescription}>
              The system extracts key fields such as code, title, level, type,
              credits, hours breakdown, learning outcomes, prerequisites, and
              keywords/skills from each uploaded course.
            </p>
          </div>
        </div>

        <div className={styles.step}>
          <div className={`${styles.stepNumber} ${styles.stepNumberPrimary}`}>
            3
          </div>
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>
              Map & Compare (Matches vs Differences)
            </h3>
            <p className={styles.stepDescription}>
              Run the course-to-course mapping to see overlaps and gaps: matched
              outcomes/skills, partial matches, and clear differences
              (level/type/hours/content). Review the comparison summary and
              detailed field-by-field analysis.
            </p>
          </div>
        </div>

        <div className={styles.step}>
          <div className={`${styles.stepNumber} ${styles.stepNumberPrimary}`}>
            4
          </div>
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Review, Edit & Save</h3>
            <p className={styles.stepDescription}>
              Before persisting the mapping, edit any fields to correct possible
              LLM mistakes. Once satisfied, save to MongoDB to keep a permanent
              record and enable future reuse.
            </p>
          </div>
        </div>
      </div>

      <div className={`${styles.infoBox} ${styles.infoBoxInfo}`}>
        <h4 className={`${styles.infoTitle} ${styles.infoTitleInfo}`}>
          Tip for Best Accuracy
        </h4>
        <p className={`${styles.infoText} ${styles.infoTextInfo}`}>
          Clear headings (e.g., “Learning Outcomes”, “Hours”, “Prerequisites”)
          and well-structured PDFs improve extraction quality. You can always
          edit fields before saving to ensure correctness.
        </p>
      </div>
    </div>
  );

  const renderAcademicChat = () => (
    <div className={styles.tabContent}>
      <h2 className={styles.sectionTitle}>Academic Chat Assistant</h2>
      <p className={styles.paragraph}>
        Get accurate answers to questions about course content using uploaded
        course outlines. The assistant provides information strictly based on
        the provided documents.
      </p>

      <div className={styles.stepsList}>
        <div className={styles.step}>
          <div className={`${styles.stepNumber} ${styles.stepNumberInfo}`}>
            1
          </div>
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Upload Course Documents</h3>
            <p className={styles.stepDescription}>
              Attach course outline PDFs to provide context for your questions.
              The assistant will use these documents as the source of truth for
              answers.
            </p>
          </div>
        </div>

        <div className={styles.step}>
          <div className={`${styles.stepNumber} ${styles.stepNumberInfo}`}>
            2
          </div>
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Ask Specific Questions</h3>
            <p className={styles.stepDescription}>
              Ask questions about course objectives, prerequisites, skills,
              assessments, or any other information contained in the course
              outlines.
            </p>
          </div>
        </div>

        <div className={styles.step}>
          <div className={`${styles.stepNumber} ${styles.stepNumberInfo}`}>
            3
          </div>
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Receive Document-Based Answers</h3>
            <p className={styles.stepDescription}>
              Get precise answers based only on information from the uploaded
              documents. The assistant will not guess or assume information not
              present in the outlines.
            </p>
          </div>
        </div>
      </div>

      <div className={`${styles.infoBox} ${styles.infoBoxSuccess}`}>
        <h4 className={`${styles.infoTitle} ${styles.infoTitleSuccess}`}>
          Course-Specific Questions
        </h4>
        <p className={`${styles.infoText} ${styles.infoTextSuccess}`}>
          For questions about specific courses, the assistant provides answers
          strictly from the relevant course outline without guessing or
          summarizing.
        </p>
      </div>

      <div className={`${styles.infoBox} ${styles.infoBoxWarning}`}>
        <h4 className={`${styles.infoTitle} ${styles.infoTitleWarning}`}>
          General Academic Questions
        </h4>
        <p className={`${styles.infoText} ${styles.infoTextWarning}`}>
          For broader academic questions unrelated to specific documents, the
          assistant can provide general academic knowledge and guidance.
        </p>
      </div>
    </div>
  );

  const renderCourseMapping = () => (
    <div className={styles.tabContent}>
      <h2 className={styles.sectionTitle}>Course to Program Mapping</h2>
      <p className={styles.paragraph}>
        Analyze how course skills and learning outcomes align with program
        learning outcomes to assess curriculum coverage and identify gaps.
      </p>

      <div className={styles.stepsList}>
        <div className={styles.step}>
          <div className={`${styles.stepNumber} ${styles.stepNumberSuccess}`}>
            1
          </div>
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Provide Course Information</h3>
            <p className={styles.stepDescription}>
              Input course data including the course name and extracted
              skills/learning outcomes from the course outline.
            </p>
          </div>
        </div>

        <div className={styles.step}>
          <div className={`${styles.stepNumber} ${styles.stepNumberSuccess}`}>
            2
          </div>
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>
              Input Program Learning Outcomes
            </h3>
            <p className={styles.stepDescription}>
              Provide program learning outcomes organized by categories, with
              each level clearly identified by numbers or letters followed by
              separators (e.g., "1.", "A-", "2:").
            </p>
          </div>
        </div>

        <div className={styles.step}>
          <div className={`${styles.stepNumber} ${styles.stepNumberSuccess}`}>
            3
          </div>
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Generate Alignment Analysis</h3>
            <p className={styles.stepDescription}>
              The system performs conceptual analysis to match course skills
              with program outcomes based on intent and depth, not just keyword
              matching.
            </p>
          </div>
        </div>
      </div>

      <div className={`${styles.infoBox} ${styles.infoBoxWarning}`}>
        <h4 className={`${styles.infoTitle} ${styles.infoTitleWarning}`}>
          Mapping Approach
        </h4>
        <p className={`${styles.infoText} ${styles.infoTextWarning}`}>
          The system evaluates alignment based on conceptual meaning rather than
          surface-level similarities. Only program outcome levels that truly
          align with course skills in both intent and depth are marked as
          matched.
        </p>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className={styles.tabContent}>
      <h2 className={styles.sectionTitle}>Understanding Results</h2>
      <p className={styles.paragraph}>
        Learn how to interpret the various outputs from course extraction, chat
        responses, and program mapping analysis.
      </p>

      <div className={styles.resultSection}>
        <h3 className={styles.subsectionTitle}>Course Extraction Results</h3>
        <div className={styles.resultGrid}>
          <div className={styles.resultCard}>
            <h4 className={styles.resultTitle}>Course Classification</h4>
            <p className={styles.resultDescription}>
              Junior vs Senior level based on prerequisites and learning
              complexity. Practical vs Theoretical based on hands-on components.
            </p>
          </div>
          <div className={styles.resultCard}>
            <h4 className={styles.resultTitle}>Structured Data</h4>
            <p className={styles.resultDescription}>
              Organized information including credits, hours breakdown, learning
              outcomes, and prerequisite requirements.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.resultSection}>
        <h3 className={styles.subsectionTitle}>Chat Assistant Responses</h3>
        <div className={styles.resultGrid}>
          <div className={styles.resultCard}>
            <h4 className={styles.resultTitle}>Document-Based Answers</h4>
            <p className={styles.resultDescription}>
              Responses to course-specific questions using only information from
              uploaded course outlines.
            </p>
          </div>
          <div className={styles.resultCard}>
            <h4 className={styles.resultTitle}>General Academic Guidance</h4>
            <p className={styles.resultDescription}>
              Broader academic knowledge for questions not tied to specific
              course documents.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.resultSection}>
        <h3 className={styles.subsectionTitle}>Program Mapping Results</h3>
        <div className={styles.resultCard}>
          <h4 className={styles.resultTitle}>Alignment Analysis</h4>
          <p className={styles.resultDescription}>
            JSON output showing which program learning outcome levels are
            covered by the course and which remain unaddressed.
          </p>
          <div className={styles.codeBlock}>
            <p className={styles.codeTitle}>Result Structure:</p>
            <ul className={styles.codeList}>
              <li>• Course name and mapping results</li>
              <li>• Matched PLO levels per skill category</li>
              <li>• Detailed explanation of alignments</li>
              <li>• Categories with no matches (empty lists)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "course-extraction": // now the course-to-course mapping flow
        return renderCourseExtraction();
      case "academic-chat":
        return renderAcademicChat();
      case "course-mapping":
        return renderCourseMapping();
      case "results":
        return renderResults();
      default:
        return renderOverview();
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Platform Guide</h1>
        <p className={styles.subtitle}>
          Learn how to effectively use our academic course analysis platform for
          information extraction, content queries, and program alignment.
        </p>
      </header>

      <div className={styles.tabsContainer}>
        <div className={styles.tabsHeader}>
          <nav className={styles.tabsList}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.tab} ${
                  activeTab === tab.id ? styles.tabActive : ""
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {renderTabContent()}
      </div>
    </div>
  );
};
