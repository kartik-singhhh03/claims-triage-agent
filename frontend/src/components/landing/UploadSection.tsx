import { useState, useRef } from 'react';
import { useClaims } from '../../hooks/useClaims';
import { useToast } from '../../contexts/ToastContext';
import './UploadSection.css';

interface UploadSectionProps {
  onNavigate: (path: string) => void;
}

export default function UploadSection({ onNavigate }: UploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const { isUploading, error, uploadAndNavigate, clearError } = useClaims();
  const { addToast } = useToast();

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    const maxSize = 50 * 1024 * 1024;
    if (file.type !== 'application/pdf') {
      addToast('Please upload a PDF file', 'error');
      return false;
    }
    if (file.size > maxSize) {
      addToast('File size must be less than 50MB', 'error');
      return false;
    }
    return true;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (validateFile(file)) {
        handleUpload(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files[0]) {
      const file = files[0];
      if (validateFile(file)) {
        handleUpload(file);
      }
    }
  };

  const handleUpload = async (file: File) => {
    clearError();
    try {
      await uploadAndNavigate(file, onNavigate);
      addToast('Claim uploaded successfully! Redirecting...', 'success');
    } catch (err) {
      addToast(error || 'Failed to upload claim', 'error');
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <section className="upload-section">
      <div className="upload-container">
        <h2 className="upload-heading">
          Start Your Claims Analysis Now
        </h2>
        
        <p className="upload-description">
          Upload your claims document (PDF) to analyze severity, extract details, and route automatically.
        </p>

        <div
          className={`upload-card ${dragActive ? 'drag-active' : ''} ${isUploading ? 'uploading' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={isUploading}
            aria-label="Upload PDF file"
            className="file-input"
          />

          {isUploading ? (
            <div className="upload-loading">
              <div className="spinner"></div>
              <p>Processing your document...</p>
            </div>
          ) : (
            <>
              <div className="upload-icon">📄</div>
              <p className="upload-text">Drag & drop your PDF here</p>
              <p className="upload-alt-text">or</p>
              <button
                className="upload-button"
                onClick={openFileDialog}
                disabled={isUploading}
              >
                Browse Files
              </button>
              <p className="upload-hint">PDF files up to 50MB</p>
            </>
          )}
        </div>

        {error && (
          <div className="upload-error">
            <p>{error}</p>
          </div>
        )}
      </div>
    </section>
  );
}
