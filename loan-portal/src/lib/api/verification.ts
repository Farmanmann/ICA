import {
  Verification,
  VerificationCreateRequest,
  VerificationUpdateRequest,
  VerificationStats
} from '@/types/verification';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function getMyVerifications(token: string): Promise<Verification[]> {
  const response = await fetch(`${API_URL}/verifications/my_verifications/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch verifications');
  }

  return response.json();
}

export async function getVerification(id: number, token?: string): Promise<Verification> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/verifications/${id}/`, {
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch verification');
  }

  return response.json();
}

export async function initiateVerification(
  data: VerificationCreateRequest,
  token: string
): Promise<Verification> {
  const response = await fetch(`${API_URL}/verifications/initiate/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to initiate verification');
  }

  return response.json();
}

export async function updateVerificationStatus(
  id: number,
  data: VerificationUpdateRequest,
  token: string
): Promise<Verification> {
  const response = await fetch(`${API_URL}/verifications/${id}/update_status/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update verification status');
  }

  return response.json();
}

export async function approveVerification(
  id: number,
  notes: string,
  token: string
): Promise<{ message: string; verification: Verification }> {
  const response = await fetch(`${API_URL}/verifications/${id}/approve/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ notes }),
  });

  if (!response.ok) {
    throw new Error('Failed to approve verification');
  }

  return response.json();
}

export async function rejectVerification(
  id: number,
  reason: string,
  notes: string,
  token: string
): Promise<{ message: string; verification: Verification }> {
  const response = await fetch(`${API_URL}/verifications/${id}/reject/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reason, notes }),
  });

  if (!response.ok) {
    throw new Error('Failed to reject verification');
  }

  return response.json();
}

export async function getVerificationStats(token: string): Promise<VerificationStats> {
  const response = await fetch(`${API_URL}/verifications/statistics/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch verification statistics');
  }

  return response.json();
}
