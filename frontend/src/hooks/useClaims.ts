import { useState, useCallback } from 'react';
import { uploadClaim, getClaimById } from '../api/claims';

interface ClaimData {
  claim_id: string;
  severity: string;
  summary: string;
  status: string;
  [key: string]: unknown;
}

interface UseClaimsReturn {
  isLoading: boolean;
  isUploading: boolean;
  error: string | null;
  claimData: ClaimData | null;
  uploadAndNavigate: (file: File, onNavigate: (path: string) => void) => Promise<void>;
  fetchClaimDetails: (claimId: string) => Promise<ClaimData | null>;
  clearError: () => void;
}

export function useClaims(): UseClaimsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [claimData, setClaimData] = useState<ClaimData | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const uploadAndNavigate = useCallback(
    async (file: File, onNavigate: (path: string) => void) => {
      setIsUploading(true);
      setError(null);
      try {
        const response = await uploadClaim(file);
        const claimId = response.claim_id;
        
        if (!claimId) {
          throw new Error('No claim ID returned from upload');
        }

        onNavigate(`/dashboard?claim_id=${claimId}`);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed';
        setError(message);
        console.error('Upload error:', err);
      } finally {
        setIsUploading(false);
      }
    },
    []
  );

  const fetchClaimDetails = useCallback(async (claimId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getClaimById(claimId);
      setClaimData(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch claim details';
      setError(message);
      console.error('Fetch claim error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    isUploading,
    error,
    claimData,
    uploadAndNavigate,
    fetchClaimDetails,
    clearError,
  };
}
