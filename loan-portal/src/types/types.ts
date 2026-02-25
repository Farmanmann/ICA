// src/types/index.ts

export interface ApiError {
  message: string;
  status: number;
  details?: Record<string, any>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// ============= AUTH TYPES =============
export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_superuser: boolean;
}

export interface UserProfile {
  id: number;
  user: User;
  role: UserRole;
  phone: string;
  address: string;
  date_of_birth?: string;
  national_id: string;
  employment_status?: string;
  annual_income?: number;
  credit_score?: number;
  created_at: string;
  updated_at: string;
}

export type UserRole = 'borrower' | 'lender' | 'admin';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name?: string;
  last_name?: string;
  role: UserRole;
  phone?: string;
}

// ============= LOAN TYPES =============
export type LoanType = 'murabaha' | 'ijarah' | 'musharakah';
export type LoanStatus = 'Pending' | 'Approved' | 'Rejected';
export type LoanPurpose = 'property' | 'car' | 'renovation' | 'business' | 'other';
export type EmploymentStatus = 'employed' | 'self-employed' | 'retired' | 'other';

export interface Loan {
  id: number;
  borrower_id?: number;
  borrower_name: string;
  email: string;
  phone: string;
  address: string;
  loan_type: LoanType;
  loan_type_display: string;
  amount: number;
  term: number; // in months
  status: LoanStatus;
  status_display: string;
  purpose: LoanPurpose;
  purpose_display: string;
  property_address?: string;
  property_value?: number;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_year?: number;
  vehicle_value?: number;
  employment_status?: EmploymentStatus;
  annual_income?: number;
  credit_score?: number;
  monthly_payment: number;
  created_at: string;
  updated_at: string;
  due_date?: string;
}

export interface LoanDetail extends Loan {
  total_paid: number;
  remaining_balance: number;
  payments: Repayment[];
  documents: LoanDocument[];
  stats: LoanStats;
}

export interface LoanStats {
  monthly_payment: number;
  total_paid: number;
  remaining_balance: number;
  payment_progress: number;
  payments_count: number;
  next_payment_due: string;
}

export interface CreateLoanRequest {
  borrower_name: string;
  email: string;
  phone: string;
  address?: string;
  loan_type: LoanType;
  amount: number;
  term: number;
  purpose: LoanPurpose;
  property_address?: string;
  property_value?: number;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_year?: number;
  vehicle_value?: number;
  employment_status?: EmploymentStatus;
  annual_income?: number;
  credit_score?: number;
}

export interface LoanOptions {
  loan_types: Array<{ value: LoanType; label: string }>;
  purposes: Array<{ value: LoanPurpose; label: string }>;
}

// ============= DOCUMENT TYPES =============
export type DocumentType = 'id' | 'proof_income' | 'bank_statement' | 'property_docs' | 'other';

export interface LoanDocument {
  id: number;
  loan: number;
  document_type: DocumentType;
  document_type_display: string;
  file: string;
  file_url: string;
  uploaded_at: string;
  notes: string;
}

export interface UploadDocumentRequest {
  file: File;
  document_type: DocumentType;
  notes?: string;
}

// ============= PAYMENT TYPES =============
export type PaymentStatus = 'pending' | 'completed' | 'failed';
export type PaymentMethod = 'bank_transfer' | 'credit_card' | 'debit_card';

export interface Repayment {
  id: number;
  loan: number;
  loan_borrower: string;
  amount: number;
  payment_date: string;
  status: PaymentStatus;
  status_display: string;
  payment_method: PaymentMethod;
  payment_method_display: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface MakePaymentRequest {
  loan: number;
  amount: number;
  payment_method: PaymentMethod;
  notes?: string;
}

// ============= DASHBOARD TYPES =============
export interface DashboardStats {
  total_loans: number;
  active_loans: number;
  pending_loans: number;
  rejected_loans: number;
  total_borrowed: number;
  total_paid: number;
  total_remaining: number;
  payment_progress: number;
}

export interface LoansStatistics {
  total_loans: number;
  approved: number;
  pending: number;
  rejected: number;
  total_disbursed: number;
  average_loan_size: number;
  loans_by_term: Array<{ term: number; count: number }>;
  loans_by_purpose: Array<{ purpose: string; count: number }>;
}

// ============= PAGINATION TYPES =============
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ============= FORM TYPES =============
export interface LoanApplicationFormData {
  step1: {
    borrower_name: string;
    email: string;
    phone: string;
    address: string;
    loan_type: LoanType;
    purpose: LoanPurpose;
  };
  step2: {
    property_address?: string;
    property_value?: number;
    vehicle_make?: string;
    vehicle_model?: string;
    vehicle_year?: number;
    vehicle_value?: number;
  };
  step3: {
    amount: number;
    term: number;
    employment_status?: EmploymentStatus;
    annual_income?: number;
    credit_score?: number;
  };
  step4: {
    documents: Array<{
      file: File;
      document_type: DocumentType;
      notes?: string;
    }>;
  };
}