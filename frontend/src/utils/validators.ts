export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidatorResult {
  isValid: boolean;
  errors: ValidationError[];
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePolicyNumber(policyNumber: string): boolean {
  return policyNumber.trim().length >= 3 && policyNumber.trim().length <= 50;
}

export function validateFullName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 100;
}

export function validateClaimForm(data: {
  fullName?: string;
  email?: string;
  policyNumber?: string;
  dateOfLoss?: string;
  claimType?: string;
  description?: string;
}): ValidatorResult {
  const errors: ValidationError[] = [];

  if (!data.fullName || !validateFullName(data.fullName)) {
    errors.push({
      field: 'fullName',
      message: 'Full name is required (2-100 characters)',
    });
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.push({
      field: 'email',
      message: 'Valid email is required',
    });
  }

  if (!data.policyNumber || !validatePolicyNumber(data.policyNumber)) {
    errors.push({
      field: 'policyNumber',
      message: 'Policy number is required (3-50 characters)',
    });
  }

  if (!data.dateOfLoss) {
    errors.push({
      field: 'dateOfLoss',
      message: 'Date of loss is required',
    });
  }

  if (!data.claimType) {
    errors.push({
      field: 'claimType',
      message: 'Claim type is required',
    });
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.push({
      field: 'description',
      message: 'Description is required (at least 10 characters)',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validatePdfFile(file: File): ValidatorResult {
  const errors: ValidationError[] = [];
  const maxSize = 50 * 1024 * 1024;

  if (file.type !== 'application/pdf') {
    errors.push({
      field: 'file',
      message: 'Only PDF files are allowed',
    });
  }

  if (file.size > maxSize) {
    errors.push({
      field: 'file',
      message: 'File size must be less than 50MB',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
