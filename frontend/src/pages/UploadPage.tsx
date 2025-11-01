import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadCard from '../components/upload/UploadCard';
import UploadProgressModal from '../components/upload/UploadProgressModal';
import { useUpload } from '../hooks/useUpload';
import { validateClaimForm } from '../utils/validators';
import { useToast } from '../contexts/ToastContext';
import './UploadPage.css';

interface ClaimFormData {
  fullName: string;
  email: string;
  policyNumber: string;
  dateOfLoss: string;
  claimType: string;
  description: string;
}

const CLAIM_TYPES = [
  { value: 'vehicle_damage', label: 'Vehicle Damage' },
  { value: 'property_loss', label: 'Property Loss' },
  { value: 'theft', label: 'Theft' },
  { value: 'injury', label: 'Personal Injury' },
  { value: 'other', label: 'Other' },
];

export default function UploadPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { isUploading, progress, uploadFiles } = useUpload();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [claimId, setClaimId] = useState<string | null>(null);

  const [formData, setFormData] = useState<ClaimFormData>({
    fullName: '',
    email: '',
    policyNumber: '',
    dateOfLoss: '',
    claimType: '',
    description: '',
  });

  const [files, setFiles] = useState<{
    acord: File | null;
    policeReport: File | null;
    lossAssessment: File | null;
    supporting: File | null;
  }>({
    acord: null,
    policeReport: null,
    lossAssessment: null,
    supporting: null,
  });

  const [expandedSection, setExpandedSection] = useState<string | null>('acord');

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelect = (fileType: string, file: File) => {
    setFiles((prev) => ({
      ...prev,
      [fileType]: file,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateClaimForm(formData);
    if (!validation.isValid) {
      validation.errors.forEach((error) => {
        addToast(error.message, 'error');
      });
      return;
    }

    if (!files.acord) {
      addToast('ACORD/FNOL form is required', 'error');
      return;
    }

    const formDataToSend = new FormData();
    
    formDataToSend.append('full_name', formData.fullName);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('policy_number', formData.policyNumber);
    formDataToSend.append('date_of_loss', formData.dateOfLoss);
    formDataToSend.append('claim_type', formData.claimType);
    formDataToSend.append('description', formData.description);
    
    formDataToSend.append('files', files.acord);
    if (files.policeReport) formDataToSend.append('files', files.policeReport);
    if (files.lossAssessment) formDataToSend.append('files', files.lossAssessment);
    if (files.supporting) formDataToSend.append('files', files.supporting);

    setIsModalOpen(true);

    try {
      const result = await uploadFiles(formDataToSend);
      if (result) {
        setClaimId(result.claim_id);
        setUploadComplete(true);
      }
    } catch (error) {
      setIsModalOpen(false);
      addToast('Upload failed. Please try again.', 'error');
    }
  };

  const handleViewClaim = () => {
    if (claimId) {
      setIsModalOpen(false);
      navigate(`/claim/${claimId}`);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-page-container">
        <div className="upload-page-header">
          <h1 className="upload-page-title">File Your Insurance Claim</h1>
          <p className="upload-page-subtitle">
            Complete the form below and upload your claim documents. We'll analyze and route your claim automatically.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          {/* Claimant Details Section */}
          <div className="form-section">
            <h2 className="form-section-title">Claimant Details</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleFormChange}
                  placeholder="John Doe"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email <span className="required">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="john@example.com"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="policyNumber" className="form-label">
                  Policy Number <span className="required">*</span>
                </label>
                <input
                  id="policyNumber"
                  type="text"
                  name="policyNumber"
                  value={formData.policyNumber}
                  onChange={handleFormChange}
                  placeholder="POL-123456"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="dateOfLoss" className="form-label">
                  Date of Loss <span className="required">*</span>
                </label>
                <input
                  id="dateOfLoss"
                  type="date"
                  name="dateOfLoss"
                  value={formData.dateOfLoss}
                  onChange={handleFormChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="claimType" className="form-label">
                  Claim Type <span className="required">*</span>
                </label>
                <select
                  id="claimType"
                  name="claimType"
                  value={formData.claimType}
                  onChange={handleFormChange}
                  className="form-input"
                >
                  <option value="">Select claim type...</option>
                  {CLAIM_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="description" className="form-label">
                  Claim Description <span className="required">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Please describe your claim in detail..."
                  rows={4}
                  className="form-input"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="form-section">
            <h2 className="form-section-title">Upload Documents</h2>
            <p className="form-section-subtitle">
              Please upload all relevant documents. ACORD/FNOL form is required.
            </p>

            <div className="accordion-section">
              <div className="accordion-item">
                <button
                  type="button"
                  className={`accordion-header ${expandedSection === 'acord' ? 'active' : ''}`}
                  onClick={() =>
                    setExpandedSection(expandedSection === 'acord' ? null : 'acord')
                  }
                >
                  <span className="accordion-title">ACORD / FNOL Form</span>
                  <span className="accordion-icon">
                    {files.acord && <span className="file-indicator">✓</span>}
                    <span className="chevron">›</span>
                  </span>
                </button>
                {expandedSection === 'acord' && (
                  <div className="accordion-content">
                    <UploadCard
                      title="Upload ACORD/FNOL Form"
                      description="Please upload the completed ACORD form or FNOL (First Notice of Loss)"
                      isRequired={true}
                      selectedFile={files.acord}
                      onFileSelect={(file) => handleFileSelect('acord', file)}
                    />
                  </div>
                )}
              </div>

              <div className="accordion-item">
                <button
                  type="button"
                  className={`accordion-header ${expandedSection === 'policeReport' ? 'active' : ''}`}
                  onClick={() =>
                    setExpandedSection(
                      expandedSection === 'policeReport' ? null : 'policeReport'
                    )
                  }
                >
                  <span className="accordion-title">Police Report</span>
                  <span className="accordion-icon">
                    {files.policeReport && <span className="file-indicator">✓</span>}
                    <span className="chevron">›</span>
                  </span>
                </button>
                {expandedSection === 'policeReport' && (
                  <div className="accordion-content">
                    <UploadCard
                      title="Upload Police Report"
                      description="(Optional) Police report or incident documentation"
                      isRequired={false}
                      selectedFile={files.policeReport}
                      onFileSelect={(file) => handleFileSelect('policeReport', file)}
                    />
                  </div>
                )}
              </div>

              <div className="accordion-item">
                <button
                  type="button"
                  className={`accordion-header ${expandedSection === 'lossAssessment' ? 'active' : ''}`}
                  onClick={() =>
                    setExpandedSection(
                      expandedSection === 'lossAssessment' ? null : 'lossAssessment'
                    )
                  }
                >
                  <span className="accordion-title">Loss Assessment / Survey Report</span>
                  <span className="accordion-icon">
                    {files.lossAssessment && <span className="file-indicator">✓</span>}
                    <span className="chevron">›</span>
                  </span>
                </button>
                {expandedSection === 'lossAssessment' && (
                  <div className="accordion-content">
                    <UploadCard
                      title="Upload Loss Assessment or Survey Report"
                      description="(Optional) Professional assessment or survey documentation"
                      isRequired={false}
                      selectedFile={files.lossAssessment}
                      onFileSelect={(file) =>
                        handleFileSelect('lossAssessment', file)
                      }
                    />
                  </div>
                )}
              </div>

              <div className="accordion-item">
                <button
                  type="button"
                  className={`accordion-header ${expandedSection === 'supporting' ? 'active' : ''}`}
                  onClick={() =>
                    setExpandedSection(
                      expandedSection === 'supporting' ? null : 'supporting'
                    )
                  }
                >
                  <span className="accordion-title">Supporting Documents</span>
                  <span className="accordion-icon">
                    {files.supporting && <span className="file-indicator">✓</span>}
                    <span className="chevron">›</span>
                  </span>
                </button>
                {expandedSection === 'supporting' && (
                  <div className="accordion-content">
                    <UploadCard
                      title="Upload Supporting Documents"
                      description="(Optional) Photos, invoices, receipts, or other supporting documentation"
                      isRequired={false}
                      selectedFile={files.supporting}
                      onFileSelect={(file) => handleFileSelect('supporting', file)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn-submit"
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Submit Claim'}
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/')}
            >
              Back Home
            </button>
          </div>
        </form>
      </div>

      <UploadProgressModal
        isOpen={isModalOpen}
        isComplete={uploadComplete}
        progress={progress}
        claimId={claimId || undefined}
        onClose={() => {
          setIsModalOpen(false);
          setUploadComplete(false);
        }}
        onViewClaim={handleViewClaim}
      />
    </div>
  );
}
