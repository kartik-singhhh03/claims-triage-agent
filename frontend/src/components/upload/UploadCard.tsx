import { useState, useRef } from 'react';
import { validatePdfFile } from '../../utils/validators';
import { formatFileSize } from '../../utils/helpers';
import { useToast } from '../../contexts/ToastContext';
import './UploadCard.css';

interface UploadCardProps {
  title: string;
  description?: string;
  isRequired?: boolean;
  onFileSelect: (file: File) => void;
  maxSize?: number;
  selectedFile?: File | null;
}

export default function UploadCard({
  title,
  description,
  isRequired = false,
  onFileSelect,
  maxSize = 50 * 1024 * 1024,
  selectedFile,
}: UploadCardProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      handleFile(e.currentTarget.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const validation = validatePdfFile(file);
    if (!validation.isValid) {
      validation.errors.forEach((error) => {
        addToast(error.message, 'error');
      });
      return;
    }

    if (file.size > maxSize) {
      addToast(`File size must be less than ${formatFileSize(maxSize)}`, 'error');
      return;
    }

    onFileSelect(file);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="upload-card-wrapper">
      <div className="upload-card-header">
        <h3 className="upload-card-title">
          {title}
          {isRequired && <span className="required-badge">*</span>}
        </h3>
        {description && <p className="upload-card-description">{description}</p>}
      </div>

      {selectedFile ? (
        <div className="upload-card-selected">
          <div className="selected-file-icon">✓</div>
          <div className="selected-file-info">
            <p className="selected-file-name">{selectedFile.name}</p>
            <p className="selected-file-size">{formatFileSize(selectedFile.size)}</p>
          </div>
          <button
            type="button"
            className="remove-file-btn"
            onClick={() => {
              if (fileInputRef.current) fileInputRef.current.value = '';
              onFileSelect(null as any);
            }}
          >
            ✕
          </button>
        </div>
      ) : (
        <div
          className={`upload-card-drop ${dragActive ? 'active' : ''}`}
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
            className="file-input"
          />
          <div className="upload-card-content">
            <div className="upload-icon">📄</div>
            <p className="upload-text">Drag & drop PDF here</p>
            <p className="upload-divider">or</p>
            <button
              type="button"
              className="upload-btn"
              onClick={openFileDialog}
            >
              Browse Files
            </button>
            <p className="upload-hint">PDF up to {formatFileSize(maxSize)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
