import Badge from '../shared/Badge';
import './ClaimDetailSection.css';

interface Claim {
  id: string;
  claim_id?: string;
  severity: string;
  summary?: string;
  status?: string;
  severity_score?: number;
  fraud_score?: number;
  extracted?: {
    policy_no?: string;
    claimant?: string;
    date_of_loss?: string;
    claimed_amount?: number;
    loss_type?: string;
  };
  rationale?: string;
  evidence?: Array<{
    source: string;
    page?: number;
    span?: string;
    text?: string;
  }>;
  routing?: {
    recommended_queue?: string;
    assignee?: string;
  };
  [key: string]: unknown;
}

interface ClaimDetailSectionProps {
  claim: Claim;
  isLoading?: boolean;
}

function getSeverityColor(severity: string): 'low' | 'medium' | 'high' | 'critical' {
  const lower = severity.toLowerCase();
  if (lower === 'high' || lower === 'critical') return 'high';
  if (lower === 'medium') return 'medium';
  return 'low';
}

export default function ClaimDetailSection({ claim, isLoading }: ClaimDetailSectionProps) {
  const claimId = claim.claim_id || claim.id;
  const severity = getSeverityColor(claim.severity);
  const fraudScore = claim.fraud_score ? Math.round(claim.fraud_score * 100) : 0;
  const extracted = claim.extracted || {};

  if (isLoading) {
    return (
      <div className="claim-detail-section">
        <div className="claim-loading">
          <div className="spinner"></div>
          <p>Loading claim details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="claim-detail-section">
      <div className="claim-header">
        <div className="claim-title-section">
          <h1 className="claim-title">Claim #{claimId}</h1>
          <div className="claim-badges">
            <Badge variant="severity" severity={severity} />
            <Badge variant="fraud" value={fraudScore} />
            {claim.status && (
              <Badge variant="status" status={claim.status as any} />
            )}
          </div>
        </div>
      </div>

      <div className="claim-content">
        <div className="claim-main">
          {claim.summary && (
            <div className="claim-section">
              <h2 className="section-title">Summary</h2>
              <p className="section-text">{claim.summary}</p>
            </div>
          )}

          <div className="claim-section">
            <h2 className="section-title">Extracted Information</h2>
            <div className="claim-fields">
              {extracted.policy_no && (
                <div className="claim-field">
                  <span className="field-label">Policy #</span>
                  <span className="field-value">{extracted.policy_no}</span>
                </div>
              )}
              {extracted.claimant && (
                <div className="claim-field">
                  <span className="field-label">Claimant</span>
                  <span className="field-value">{extracted.claimant}</span>
                </div>
              )}
              {extracted.loss_type && (
                <div className="claim-field">
                  <span className="field-label">Loss Type</span>
                  <span className="field-value">{extracted.loss_type}</span>
                </div>
              )}
              {extracted.date_of_loss && (
                <div className="claim-field">
                  <span className="field-label">Date of Loss</span>
                  <span className="field-value">{extracted.date_of_loss}</span>
                </div>
              )}
              {extracted.claimed_amount && (
                <div className="claim-field">
                  <span className="field-label">Claimed Amount</span>
                  <span className="field-value">
                    ${extracted.claimed_amount.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {claim.rationale && (
            <div className="claim-section">
              <h2 className="section-title">AI Rationale</h2>
              <p className="section-text">{claim.rationale}</p>
            </div>
          )}

          {claim.evidence && claim.evidence.length > 0 && (
            <div className="claim-section">
              <h2 className="section-title">Evidence</h2>
              <div className="evidence-list">
                {claim.evidence.map((item, idx) => (
                  <div key={idx} className="evidence-item">
                    <div className="evidence-source">
                      <span className="source-file">📄 {item.source}</span>
                      {item.page && <span className="source-page">Page {item.page}</span>}
                    </div>
                    {item.span && (
                      <p className="evidence-text">"{item.span}"</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="claim-sidebar">
          <div className="sidebar-card">
            <h3 className="sidebar-title">Severity Analysis</h3>
            <div className="severity-display">
              <div className="severity-score">
                <span className="score-value">
                  {claim.severity_score ? (claim.severity_score * 100).toFixed(0) : 'N/A'}
                </span>
                <span className="score-unit">%</span>
              </div>
              <div className="severity-bar">
                <div
                  className={`bar-fill bar-${severity}`}
                  style={{
                    width: `${(claim.severity_score || 0) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="sidebar-card">
            <h3 className="sidebar-title">Fraud Risk</h3>
            <div className="fraud-display">
              <div className="fraud-score">
                <span className="score-value">{fraudScore}</span>
                <span className="score-unit">%</span>
              </div>
              <div className="fraud-bar">
                <div
                  className="bar-fill bar-fraud"
                  style={{
                    width: `${fraudScore}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {claim.routing && (
            <div className="sidebar-card">
              <h3 className="sidebar-title">Routing</h3>
              <div className="routing-info">
                {claim.routing.recommended_queue && (
                  <div className="routing-item">
                    <span className="routing-label">Queue</span>
                    <span className="routing-value">
                      {claim.routing.recommended_queue}
                    </span>
                  </div>
                )}
                {claim.routing.assignee && (
                  <div className="routing-item">
                    <span className="routing-label">Assignee</span>
                    <span className="routing-value">{claim.routing.assignee}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
