export interface Claim {
  id: string;
  claimId: string;
  claimant: string;
  lossType: string;
  claimedAmount: number;
  createdAt: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  fraudScore: number;
  queue: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'escalated';
  policyNo?: string;
  dateOfLoss?: string;
  description?: string;
  evidence?: Evidence[];
  attachments?: Attachment[];
  auditLog?: AuditEntry[];
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

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
