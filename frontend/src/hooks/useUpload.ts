import { useState, useCallback } from 'react';
import { API_BASE, API_ENDPOINTS } from '../api/config';
import { useToast } from '../contexts/ToastContext';

interface UploadProgress {
  loaded: number;
  total: number;
}

interface UploadResult {
  claim_id: string;
  status: string;
  severity: string;
  summary: string;
  created_at: string;
  [key: string]: unknown;
}

interface UseUploadReturn {
  isUploading: boolean;
  progress: UploadProgress | null;
  error: string | null;
  uploadFiles: (formData: FormData) => Promise<UploadResult | null>;
  clearError: () => void;
  resetProgress: () => void;
}

export function useUpload(): UseUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(null);
  }, []);

  const uploadFiles = useCallback(
    async (formData: FormData): Promise<UploadResult | null> => {
      setIsUploading(true);
      setError(null);
      setProgress({ loaded: 0, total: 100 });

      try {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            setProgress({
              loaded: event.loaded,
              total: event.total,
            });
          }
        });

        return new Promise((resolve, reject) => {
          xhr.onload = () => {
            if (xhr.status === 200 || xhr.status === 201) {
              try {
                const response = JSON.parse(xhr.responseText);
                addToast('Files uploaded successfully!', 'success');
                setProgress({ loaded: 100, total: 100 });
                setIsUploading(false);
                resolve(response);
              } catch (e) {
                reject(new Error('Invalid response from server'));
              }
            } else {
              try {
                const errorData = JSON.parse(xhr.responseText);
                reject(new Error(errorData.detail || 'Upload failed'));
              } catch {
                reject(new Error('Upload failed with status ' + xhr.status));
              }
            }
          };

          xhr.onerror = () => {
            reject(new Error('Network error during upload'));
          };

          xhr.ontimeout = () => {
            reject(new Error('Upload timeout'));
          };

          xhr.open('POST', `${API_BASE}${API_ENDPOINTS.CLAIMS.UPLOAD}`);
          xhr.send(formData);
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed';
        setError(message);
        addToast(message, 'error');
        setIsUploading(false);
        return null;
      }
    },
    [addToast]
  );

  return {
    isUploading,
    progress,
    error,
    uploadFiles,
    clearError,
    resetProgress,
  };
}
