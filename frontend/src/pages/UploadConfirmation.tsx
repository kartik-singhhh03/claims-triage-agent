import { useNavigate, useLocation } from 'react-router-dom';
import './UploadConfirmation.css';

interface LocationState {
  claimId?: string;
}

export default function UploadConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const claimId = state?.claimId || 'CLM-UNKNOWN';

  return (
    <div className="upload-confirmation">
      <div className="confirmation-container">
        <div className="confirmation-icon">✓</div>
        <h1 className="confirmation-title">Upload Successful!</h1>
        <p className="confirmation-subtitle">
          Your claim has been received and is being processed
        </p>

        <div className="claim-id-display">
          <p className="claim-id-label">Your Claim ID</p>
          <p className="claim-id-number">{claimId}</p>
          <p className="claim-id-info">
            Keep this ID for your records and future reference
          </p>
        </div>

        <div className="confirmation-message">
          <p>
            We've received your claim documents and they are being analyzed by our AI-powered system.
            You can track your claim status in the Team Panel or check back here for updates.
          </p>
        </div>

        <div className="confirmation-actions">
          <button
            className="btn-primary"
            onClick={() => navigate(`/claim/${claimId}`)}
          >
            View Claim Details
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigate('/team')}
          >
            Team Panel
          </button>
          <button
            className="btn-outline"
            onClick={() => navigate('/')}
          >
            Back Home
          </button>
        </div>

        <div className="confirmation-footer">
          <p>Next Steps:</p>
          <ul>
            <li>Our AI system will analyze your documents within minutes</li>
            <li>Fraud detection and severity scoring will be performed</li>
            <li>Your claim will be automatically routed to the appropriate team</li>
            <li>You can monitor progress in the Team Panel</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
