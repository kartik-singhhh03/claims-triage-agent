export interface Rule {
  id: string;
  name: string;
  description?: string;
  condition: RuleCondition;
  action: RuleAction;
  priority: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RuleCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'gt' | 'lt' | 'contains' | 'in_list';
  value: any;
  combineWith?: 'and' | 'or';
  nested?: RuleCondition[];
}

export interface RuleAction {
  type: 'route' | 'escalate' | 'flag' | 'notify';
  target?: string;
  message?: string;
}

export interface RulePreview {
  matchCount: number;
  sampleClaimIds: string[];
}

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function fetchRules() {
  const response = await fetch(`${BASE_URL}/api/rules`);
  if (!response.ok) {
    throw new Error('Failed to fetch rules');
  }
  return response.json();
}

export async function fetchRule(id: string) {
  const response = await fetch(`${BASE_URL}/api/rules/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch rule');
  }
  return response.json();
}

export async function createRule(rule: Omit<Rule, 'id' | 'createdAt' | 'updatedAt'>) {
  const response = await fetch(`${BASE_URL}/api/rules`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rule),
  });
  if (!response.ok) {
    throw new Error('Failed to create rule');
  }
  return response.json();
}

export async function updateRule(
  id: string,
  rule: Partial<Rule>
) {
  const response = await fetch(`${BASE_URL}/api/rules/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rule),
  });
  if (!response.ok) {
    throw new Error('Failed to update rule');
  }
  return response.json();
}

export async function deleteRule(id: string) {
  const response = await fetch(`${BASE_URL}/api/rules/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete rule');
  }
  return response.json();
}

export async function previewRule(rule: Omit<Rule, 'id' | 'createdAt' | 'updatedAt'>): Promise<RulePreview> {
  const response = await fetch(`${BASE_URL}/api/rules/preview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rule),
  });
  if (!response.ok) {
    throw new Error('Failed to preview rule');
  }
  return response.json();
}
