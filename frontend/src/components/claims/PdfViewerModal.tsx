import Modal from '../shared/Modal';
import './PdfViewerModal.css';

interface PdfViewerModalProps {
  isOpen: boolean;
  pdfUrl?: string;
  fileName?: string;
  onClose: () => void;
}

export default function PdfViewerModal({
  isOpen,
  pdfUrl,
  fileName,
  onClose,
}: PdfViewerModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={fileName}
      size="large"
      closeButton={true}
    >
      <div className="pdf-viewer-container">
        {pdfUrl ? (
          <>
            <iframe
              src={`${pdfUrl}#toolbar=1`}
              className="pdf-iframe"
              title={fileName}
            ></iframe>
            <div className="pdf-footer">
              <a
                href={pdfUrl}
                download={fileName}
                className="pdf-download-btn"
              >
                Download PDF
              </a>
            </div>
          </>
        ) : (
          <div className="pdf-placeholder">
            <p>PDF not available</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
