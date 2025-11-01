import { API_BASE, API_ENDPOINTS } from './config';

export interface Claim {
  id: string;
  claim_id: string;
  claimant: string;
  loss_type: string;
  claimed_amount: number;
  created_at: string;
  severity_score: number;
  fraud_score: number;
  routed_queue: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'escalated';
  policy_no?: string;
  date_of_loss?: string;
  summary?: string;
  description?: string;
  evidence?: Evidence[];
  attachments?: Attachment[];
  audit_log?: AuditEntry[];
  extracted?: {
    policy_no?: string;
    claimant?: string;
    date_of_loss?: string;
    claimed_amount?: number;
    loss_type?: string;
  };
  rationale?: string;
  routing?: {
    recommended_queue?: string;
    assignee?: string;
  };
}

export interface Evidence {
  id: string;
  source: string;
  page?: number;
  snippet: string;
  rationale?: string;
  confidence?: number;
}

export interface Attachment {
  id: string;
  filename: string;
  url: string;
  type: string;
  size: number;
}

export interface AuditEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details?: string;
}

export interface ClaimsFilter {
  q?: string;
  queue?: string;
  severity?: string;
  fraudScore?: {
    min: number;
    max: number;
  };
  dateRange?: {
    from: string;
    to: string;
  };
  limit?: number;
  offset?: number;
}

export interface ClaimsListResponse {
  total: number;
  items: Claim[];
}

// Demo data generator
const generateDemoClaim = (id: string): Claim => ({
  id,
  claim_id: `CLM-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
  claimant: `Claimant ${id}`,
  loss_type: ['vehicle_damage', 'property_loss', 'theft', 'injury'][
    Math.floor(Math.random() * 4)
  ],
  claimed_amount: Math.floor(Math.random() * 50000) + 5000,
  created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  severity_score: Math.random(),
  fraud_score: Math.random(),
  routed_queue: ['urgent', 'standard', 'auto-approved'][Math.floor(Math.random() * 3)],
  status: ['pending', 'in_progress', 'resolved'][Math.floor(Math.random() * 3)],
  policy_no: `POL-${Math.floor(Math.random() * 999999)}`,
  date_of_loss: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0],
  summary: 'Vehicle collision claim with multiple parties involved',
  description: 'Comprehensive claim description with all relevant details',
  evidence: [
    {
      id: '1',
      source: 'police_report.pdf',
      page: 2,
      snippet: 'Driver reports broken leg',
      rationale: 'High injury severity indicator',
    },
    {
      id: '2',
      source: 'fnol_form.pdf',
      page: 1,
      snippet: 'Estimated repair cost $12,500',
      rationale: 'Significant damage amount',
    },
  ],
  extracted: {
    policy_no: `POL-${Math.floor(Math.random() * 999999)}`,
    claimant: `Claimant ${id}`,
    date_of_loss: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    claimed_amount: Math.floor(Math.random() * 50000) + 5000,
    loss_type: 'vehicle_damage',
  },
  routing: {
    recommended_queue: 'auto_major',
    assignee: 'adjuster_09',
  },
});

export async function fetchClaims(filters: ClaimsFilter = {}) {
  const params = new URLSearchParams();

  if (filters.q) params.append('q', filters.q);
  if (filters.queue) params.append('queue', filters.queue);
  if (filters.severity) params.append('severity', filters.severity);
  if (filters.fraudScore) {
    params.append('fraud_score_min', filters.fraudScore.min.toString());
    params.append('fraud_score_max', filters.fraudScore.max.toString());
  }
  if (filters.dateRange) {
    params.append('date_from', filters.dateRange.from);
    params.append('date_to', filters.dateRange.to);
  }
  params.append('limit', (filters.limit || 25).toString());
  params.append('offset', (filters.offset || 0).toString());

  const response = await fetch(`${BASE_URL}/api/claims?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch claims');
  }
  return response.json();
}

export async function fetchClaim(id: string) {
  const response = await fetch(`${BASE_URL}/api/claims/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch claim');
  }
  return response.json();
}

export async function reassignClaim(
  id: string,
  queueId: string,
  note?: string
) {
  const response = await fetch(`${BASE_URL}/api/claims/${id}/reassign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ queue_id: queueId, note }),
  });
  if (!response.ok) {
    throw new Error('Failed to reassign claim');
  }
  return response.json();
}

export async function addNoteToClai(id: string, note: string) {
  const response = await fetch(`${BASE_URL}/api/claims/${id}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: note }),
  });
  if (!response.ok) {
    throw new Error('Failed to add note');
  }
  return response.json();
}

export async function escalateClaim(id: string, reason?: string) {
  const response = await fetch(`${BASE_URL}/api/claims/${id}/escalate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
  });
  if (!response.ok) {
    throw new Error('Failed to escalate claim');
  }
  return response.json();
}

export async function uploadClaim(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${BASE_URL}/api/claims/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Upload failed');
  }

  return response.json();
}

export async function getClaimById(id: string) {
  const response = await fetch(`${BASE_URL}/api/claims/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch claim details');
  }
  return response.json();
}
