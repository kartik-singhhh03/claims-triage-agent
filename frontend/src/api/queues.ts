export interface Queue {
  id: string;
  name: string;
  count: number;
  avgTriageTime: number;
  severity?: 'high' | 'medium' | 'low';
  members?: QueueMember[];
  autoAssign?: boolean;
  topClaims?: string[];
}

export interface QueueMember {
  id: string;
  name: string;
  email: string;
  availability: 'available' | 'busy' | 'offline';
  assignedClaimCount: number;
}

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function fetchQueues() {
  const response = await fetch(`${BASE_URL}/api/queues`);
  if (!response.ok) {
    throw new Error('Failed to fetch queues');
  }
  return response.json();
}

export async function fetchQueue(id: string) {
  const response = await fetch(`${BASE_URL}/api/queues/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch queue');
  }
  return response.json();
}

export async function updateQueueAutoAssign(id: string, autoAssign: boolean) {
  const response = await fetch(`${BASE_URL}/api/queues/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ auto_assign: autoAssign }),
  });
  if (!response.ok) {
    throw new Error('Failed to update queue');
  }
  return response.json();
}
