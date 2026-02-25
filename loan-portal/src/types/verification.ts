export type VerificationType = 'identity' | 'income' | 'bank_account' | 'sanctions' | 'fraud';

export type VerificationStatus = 'pending' | 'in_progress' | 'verified' | 'failed' | 'manual_review';

export type VerificationProvider = 'persona' | 'trulioo' | 'onfido' | 'argyle' | 'plaid' | 'finicity' | 'internal';

export interface Verification {
  id: number;
  user: number;
  user_email: string;
  user_name: string;
  loan?: number;
  verification_type: VerificationType;
  verification_type_display: string;
  status: VerificationStatus;
  status_display: string;
  provider: VerificationProvider;
  provider_display: string;
  external_verification_id?: string;
  verification_url?: string;
  verified_at?: string;
  failed_reason?: string;
  reviewer_notes?: string;
  user_consent: boolean;
  consent_timestamp?: string;
  is_verified: boolean;
  requires_action: boolean;
  created_at: string;
  updated_at: string;
}

export interface VerificationCreateRequest {
  verification_type: VerificationType;
  provider: VerificationProvider;
  user_consent: boolean;
  loan?: number;
}

export interface VerificationUpdateRequest {
  status?: VerificationStatus;
  external_verification_id?: string;
  verification_url?: string;
  verification_data?: Record<string, any>;
  failed_reason?: string;
  reviewer_notes?: string;
}

export interface VerificationStats {
  total_verifications: number;
  by_status: {
    pending: number;
    in_progress: number;
    verified: number;
    failed: number;
    manual_review: number;
  };
  by_type: {
    identity: number;
    income: number;
    bank_account: number;
    sanctions: number;
    fraud: number;
  };
  by_provider: Array<{
    provider: VerificationProvider;
    count: number;
  }>;
}
