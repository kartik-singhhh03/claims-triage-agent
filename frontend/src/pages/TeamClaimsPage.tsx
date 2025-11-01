import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchClaims, Claim } from '../api/claims';
import { formatDate, getSeverityLabel } from '../utils/helpers';
import Badge from '../components/shared/Badge';
import './TeamClaimsPage.css';

export default function TeamClaimsPage() {
  const navigate = useNavigate();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState<string>('');
  const [filterQueue, setFilterQueue] = useState<string>('');

  useEffect(() => {
    const loadClaims = async () => {
      setIsLoading(true);
      try {
        const response = await fetchClaims({
          limit: 50,
          offset: 0,
        });
        setClaims(response.items);
      } catch (error) {
        console.error('Failed to load claims:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadClaims();
  }, []);

  const filteredClaims = claims.filter((claim) => {
    if (filterSeverity && getSeverityLabel(claim.severity_score) !== filterSeverity) {
      return false;
    }
    if (filterQueue && claim.routed_queue !== filterQueue) {
      return false;
    }
    return true;
  });

  const queues = Array.from(new Set(claims.map((c) => c.routed_queue))).sort();
  const severities = ['low', 'medium', 'high'];

  return (
    <div className="team-claims-page">
      <div className="page-header">
        <h1 className="page-title">Claims Management</h1>
        <p className="page-subtitle">Track and manage all incoming claims</p>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label className="filter-label">Severity</label>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="filter-select"
          >
            <option value="">All Severities</option>
            {severities.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Queue</label>
          <select
            value={filterQueue}
            onChange={(e) => setFilterQueue(e.target.value)}
            className="filter-select"
          >
            <option value="">All Queues</option>
            {queues.map((q) => (
              <option key={q} value={q}>
                {q.charAt(0).toUpperCase() + q.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-info">
          <p>
            Showing <strong>{filteredClaims.length}</strong> of{' '}
            <strong>{claims.length}</strong> claims
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading claims...</p>
        </div>
      ) : filteredClaims.length === 0 ? (
        <div className="empty-state">
          <p>No claims found matching your filters</p>
        </div>
      ) : (
        <div className="claims-table-container">
          <table className="claims-table">
            <thead>
              <tr>
                <th>Claim ID</th>
                <th>Claimant</th>
                <th>Loss Type</th>
                <th>Amount</th>
                <th>Severity</th>
                <th>Fraud Score</th>
                <th>Queue</th>
                <th>Status</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredClaims.map((claim) => (
                <tr key={claim.id} className="claim-row">
                  <td className="claim-id-cell">
                    <code>{claim.claim_id}</code>
                  </td>
                  <td>{claim.claimant}</td>
                  <td>{claim.loss_type}</td>
                  <td className="amount-cell">
                    ${claim.claimed_amount.toLocaleString()}
                  </td>
                  <td>
                    <Badge
                      variant="severity"
                      severity={getSeverityLabel(claim.severity_score)}
                    />
                  </td>
                  <td className="score-cell">
                    {Math.round(claim.fraud_score * 100)}%
                  </td>
                  <td className="queue-cell">{claim.routed_queue}</td>
                  <td>
                    <Badge variant="status" status={claim.status as any} />
                  </td>
                  <td className="date-cell">{formatDate(claim.created_at)}</td>
                  <td className="action-cell">
                    <button
                      className="view-btn"
                      onClick={() => navigate(`/claim/${claim.claim_id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
