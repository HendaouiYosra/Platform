
import { TrendingUp, BookOpen, CheckCircle, Clock } from "lucide-react";
import "./ComparisonMetrics.css";

interface ComparisonMetricsProps {
  skillSimilarity: number;
  descriptionSimilarity: number;
  combinedScore: number;
  hoursRatio: number;
  course1Hours: number;
  course2Hours: number;
}

const ComparisonMetrics = ({ 
  skillSimilarity, 
  descriptionSimilarity, 
  combinedScore, 
  hoursRatio,
  course1Hours,
  course2Hours
}: ComparisonMetricsProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'score-green';
    if (score >= 40) return 'score-yellow';
    return 'score-red';
  };

  const formatValue = (value: string | number) => {
    if (!value || value === '' || value === 0) {
      return <span className="text-gray">Not specified</span>;
    }
    return value;
  };

  return (
    <div className="comparison-metrics">
      <div className="metrics-grid">
        <div className="metric-card">
          <TrendingUp className="metric-icon metric-icon-blue" />
          <h4 className="metric-title">Skill Similarity</h4>
          <p className={`metric-value ${getScoreColor(skillSimilarity)}`}>
            {skillSimilarity.toFixed(1)}%
          </p>
        </div>

        <div className="metric-card">
          <BookOpen className="metric-icon metric-icon-purple" />
          <h4 className="metric-title">Content Similarity</h4>
          <p className={`metric-value ${getScoreColor(descriptionSimilarity)}`}>
            {descriptionSimilarity.toFixed(1)}%
          </p>
        </div>

        <div className="metric-card">
          <CheckCircle className="metric-icon metric-icon-green" />
          <h4 className="metric-title">Overall Score</h4>
          <p className={`metric-value ${getScoreColor(combinedScore)}`}>
            {combinedScore.toFixed(1)}%
          </p>
        </div>

        <div className="metric-card">
          <Clock className="metric-icon metric-icon-orange" />
          <h4 className="metric-title">Hours Ratio</h4>
          <p className="metric-value-gray">
            {hoursRatio ? hoursRatio.toFixed(1) : 'N/A'}
          </p>
        </div>
      </div>

      <div className="hours-comparison-card">
        <h4 className="detail-title">Course Hours Comparison</h4>
        <div className="hours-details">
          <div className="detail-row">
            <span className="detail-label">Course 1 Hours:</span>
            <span className="hours-value-blue">{formatValue(course1Hours)}h</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Course 2 Hours:</span>
            <span className="hours-value-purple">{formatValue(course2Hours)}h</span>
          </div>
          <div className="detail-row detail-row-border">
            <span className="detail-label">Hours Ratio:</span>
            <span className="hours-ratio">
              {hoursRatio ? hoursRatio.toFixed(2) : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonMetrics;
