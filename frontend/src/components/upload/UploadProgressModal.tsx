import Modal from '../shared/Modal';
import './UploadProgressModal.css';

interface UploadProgressModalProps {
  isOpen: boolean;
  isComplete: boolean;
  progress: {
    loaded: number;
    total: number;
  } | null;
  claimId?: string;
  onClose: () => void;
  onViewClaim?: () => void;
}

export default function UploadProgressModal({
  isOpen,
  isComplete,
  progress,
  claimId,
  onClose,
  onViewClaim,
}: UploadProgressModalProps) {
  const progressPercent = progress ? (progress.loaded / progress.total) * 100 : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="small" closeButton={false}>
      {!isComplete ? (
        <div className="upload-progress-content">
          <div className="progress-icon">📤</div>
          <h2 className="progress-title">Uploading Documents...</h2>
          <p className="progress-text">Please wait while we process your claim documents</p>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="progress-percent">{Math.round(progressPercent)}%</p>
        </div>
      ) : (
        <div className="upload-success-content">
          <div className="success-icon">✓</div>
          <h2 className="success-title">Upload Successful!</h2>
          <p className="success-text">Your claim has been received and is being processed</p>

          {claimId && (
            <div className="claim-id-box">
              <p className="claim-id-label">Claim ID</p>
              <p className="claim-id-value">{claimId}</p>
            </div>
          )}

          <button className="btn-primary-modal" onClick={onViewClaim}>
            View Claim Details →
          </button>
          <button className="btn-secondary-modal" onClick={onClose}>
            Done
          </button>
        </div>
      )}
    </Modal>
  );
}
