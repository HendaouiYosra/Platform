"use client";
import "./MappingResult.css";

interface ComparisonField {
  source: string;
  target: string;
  similarity: string;
}

interface KeywordsAndSkills {
  shared_keywords: string[];
  missing_in_source: string[];
  extra_in_source: string[];
}

interface LearningOutcomes {
  matched: string[];
  unmatched: string[];
}

interface Comparison {
  level?: ComparisonField;
  type?: ComparisonField;
  credit?: ComparisonField;
  hours_breakdown?: ComparisonField;
  keywords_and_skills?: KeywordsAndSkills;
  learning_outcomes?: LearningOutcomes;
}

interface MappingData {
  decision: string;
  Comments: string;
  comparison: Comparison;
}

interface MappingResultProps {
  data: MappingData;
}

const MappingResult = ({ data }: MappingResultProps) => {
  const { decision, Comments, comparison = {} } = data;

  const {
    level = { source: "", target: "", similarity: "" },
    type = { source: "", target: "", similarity: "" },
    credit = { source: "", target: "", similarity: "" },
    hours_breakdown = { source: "", target: "", similarity: "" },
    keywords_and_skills = {
      shared_keywords: [],
      missing_in_source: [],
      extra_in_source: [],
    },
    learning_outcomes = {
      matched: [],
      unmatched: [],
    },
  } = comparison;
 

const getDecisionClass = (decision: string) => {
  const lower = decision.toLowerCase();

  if (lower.includes("not approved") || lower.includes("not a university level") || lower.includes("wrong department") || lower.includes("additional information")) {
    return "rejected";
  }

  if (lower.includes("unspecified credit")) {
    return "unspecified";
  }

  if (lower.includes("approve as the course equivalent requested")) {
    return "approved";
  }

  return "rejected"; // default fallback
};
const decisionClass = getDecisionClass(decision);

  return (
    <div className="mapping-result-layout">
      <div className={`decision-card ${decisionClass}`}>
        <h3 className="decision-title" >{decision}</h3>
        <div className={`comment-box ${decisionClass}`}>
          <strong>Comments:</strong> {Comments}
        </div>
      </div>

      <h4 className="section-title">Detailed Comparison</h4>
      <div className="comparison-cards">
        {/* Level */}
        <div className="comparison-box">
          <div className="box-title">
            <div></div>
            
            Level
          </div>
          <div className="row">
            <span>Source:</span>
            <span
              className={`tag value ${
                level.source?.toLowerCase().includes("junior")
                  ? "junior"
                  : level.source?.toLowerCase().includes("senior")
                  ? "senior"
                  : ""
              }`}
            >
              {level.source || "N/A"}
            </span>
          </div>
          <div className="row">
            <span>Target:</span>
            <span className="tag value">{level.target || "N/A"}</span>
          </div>
          <div
            className={`tag match-status ${level.similarity?.toLowerCase()}`}
          >
            {level.similarity || "N/A"}
          </div>
        </div>

        {/* Type */}
        <div className="comparison-box">
          <div className="box-title"> Type</div>
          <div className="row">
            <span>Source:</span>
            <span
              className={`tag value ${
                type.source?.toLowerCase().includes("practical")
                  ? "practical"
                  : type.source?.toLowerCase().includes("theoretical")
                  ? "theoretical"
                  : ""
              }`}
            >
              {type.source || "N/A"}
            </span>
          </div>
          <div className="row">
            <span>Target:</span>
            <span className="tag value">{type.target || "N/A"}</span>
          </div>
          <div className={`tag match-status ${type.similarity?.toLowerCase()}`}>
            {type.similarity || "N/A"}
          </div>
        </div>

        {/* Credit */}
        <div className="comparison-box">
          <div className="box-title"> Credit</div>
          <div className="row">
            <span>Source:</span>
            <span className="tag value">{credit.source || "N/A"}</span>
          </div>
          <div className="row">
            <span>Target:</span>
            <span className="tag value">{credit.target || "N/A"}</span>
          </div>
          <div
            className={`tag match-status ${credit.similarity?.toLowerCase()}`}
          >
            {credit.similarity || "N/A"}
          </div>
        </div>

        {/* Hours */}
        <div className="comparison-box">
          <div className="box-title"> Hours</div>
          <div className="row">
            <span>Source:</span>
            <span className="tag value">{hours_breakdown.source || "N/A"}</span>
          </div>
          <div className="row">
            <span>Target:</span>
            <span className="tag value">{hours_breakdown.target || "N/A"}</span>
          </div>
          <div
            className={`tag match-status ${hours_breakdown.similarity?.toLowerCase()}`}
          >
            {hours_breakdown.similarity || "N/A"}
          </div>
        </div>
      </div>

      <h4 className="section-title">Keyword & Skill Comparison</h4>
      <div className="keyword-columns">
        <div className="keyword-box">
          <div className="box-title">
            Shared Keywords ({keywords_and_skills.shared_keywords.length})
          </div>
          <ul>
            {keywords_and_skills.shared_keywords.map((kw, idx) => (
              <li key={idx} className="shared">
                {kw}
              </li>
            ))}
          </ul>
        </div>

        <div className="keyword-box">
          <div className="box-title">
            Missing in Source ({keywords_and_skills.missing_in_source.length})
          </div>
          <ul>
            {keywords_and_skills.missing_in_source.map((kw, idx) => (
              <li key={idx} className="missing">
                {kw}
              </li>
            ))}
          </ul>
        </div>

        <div className="keyword-box">
          <div className="box-title">
            Extra in Source ({keywords_and_skills.extra_in_source.length})
          </div>
          <ul>
            {keywords_and_skills.extra_in_source.map((kw, idx) => (
              <li key={idx} className="extra">
                {kw}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h4 className="section-title">Learning Outcomes</h4>
      <div className="outcome-columns">
        <div className="outcome-box">
          <div className="box-title">
            Matched Outcomes ({learning_outcomes.matched.length})
          </div>
          {learning_outcomes.matched.length === 0 ? (
            <p className="dimmed">No matched learning outcomes found.</p>
          ) : (
            <ul>
              {learning_outcomes.matched.map((lo, idx) => (
                <li key={idx}>{lo}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="outcome-box">
          <div className="box-title">
            Unmatched Outcomes ({learning_outcomes.unmatched.length})
          </div>
          {learning_outcomes.unmatched.length === 0 ? (
            <p className="dimmed">No unmatched outcomes found.</p>
          ) : (
            <ul>
              {learning_outcomes.unmatched.map((lo, idx) => (
                <li key={idx} className="unmatched">
                  {lo}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default MappingResult;
