export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  CLAIMS: {
    UPLOAD: '/api/claims/upload',
    LIST: '/api/claims',
    GET: (id: string) => `/api/claims/${id}`,
    REASSIGN: (id: string) => `/api/claims/${id}/reassign`,
    GET_PDF: (id: string, fileName: string) => `/api/claims/${id}/pdf/${fileName}`,
  },
  QUEUES: {
    LIST: '/api/queues',
    GET: (id: string) => `/api/queues/${id}`,
  },
  RULES: {
    LIST: '/api/rules',
    CREATE: '/api/rules',
    UPDATE: (id: string) => `/api/rules/${id}`,
  },
};
