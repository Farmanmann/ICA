// src/lib/api/services/loanService.ts

import { apiClient, getFormDataHeaders } from '../client';

export interface Loan {
  id: number;
  borrower_name: string;
  email: string;
  phone: string;
  address: string;
  loan_type: 'murabaha' | 'ijarah' | 'musharakah';
  loan_type_display: string;
  amount: number;
  term: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  status_display: string;
  purpose: string;
  purpose_display: string;
  property_address: string;
  property_value: number;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: number;
  vehicle_value: number;
  employment_status: string;
  annual_income: number;
  credit_score: number;
  monthly_payment: number;
  created_at: string;
  updated_at: string;
  due_date: string;
}

export interface LoanDetail extends Loan {
  total_paid: number;
  remaining_balance: number;
  payments: Payment[];
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

export interface CreateLoanData {
  borrower_name: string;
  email: string;
  phone: string;
  address?: string;
  loan_type: 'murabaha' | 'ijarah' | 'musharakah';
  amount: number;
  term: number;
  purpose: string;
  property_address?: string;
  property_value?: number;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_year?: number;
  vehicle_value?: number;
  employment_status?: string;
  annual_income?: number;
  credit_score?: number;
}

export interface LoanDocument {
  id: number;
  loan: number;
  document_type: string;
  document_type_display: string;
  file: string;
  file_url: string;
  uploaded_at: string;
  notes: string;
}

export interface Payment {
  id: number;
  loan: number;
  loan_borrower: string;
  amount: number;
  payment_date: string;
  status: 'pending' | 'completed' | 'failed';
  status_display: string;
  payment_method: string;
  payment_method_display: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface LoanOptions {
  loan_types: { value: string; label: string }[];
  purposes: { value: string; label: string }[];
}

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

/**
 * Loan Service - All loan-related API calls
 */
export const loanService = {
  /**
   * Get loan options (types and purposes)
   */
  async getLoanOptions(): Promise<LoanOptions> {
    try {
      const response = await apiClient.get('/loan-options/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new loan application
   */
  async createLoan(data: CreateLoanData): Promise<Loan> {
    try {
      const response = await apiClient.post('/loans/', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all loans for current user
   */
  async getMyLoans(): Promise<Loan[]> {
    try {
      const response = await apiClient.get('/loans/my_loans/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all loans (admin/general)
   */
  async getAllLoans(
    filters?: {
      status?: string;
      loan_type?: string;
      purpose?: string;
      page?: number;
    }
  ): Promise<{
    count: number;
    next: string | null;
    previous: string | null;
    results: Loan[];
  }> {
    try {
      const response = await apiClient.get('/loans/', { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get loan details by ID
   */
  async getLoanById(id: number): Promise<LoanDetail> {
    try {
      const response = await apiClient.get(`/loans/${id}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update loan
   */
  async updateLoan(id: number, data: Partial<CreateLoanData>): Promise<Loan> {
    try {
      const response = await apiClient.put(`/loans/${id}/`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete loan
   */
  async deleteLoan(id: number): Promise<void> {
    try {
      await apiClient.delete(`/loans/${id}/`);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get loan statistics
   */
  async getLoanStats(id: number): Promise<LoanStats> {
    try {
      const response = await apiClient.get(`/loans/${id}/stats/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Approve loan (admin only)
   */
  async approveLoan(id: number): Promise<LoanDetail> {
    try {
      const response = await apiClient.post(`/loans/${id}/approve/`);
      return response.data.loan;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Reject loan (admin only)
   */
  async rejectLoan(id: number): Promise<LoanDetail> {
    try {
      const response = await apiClient.post(`/loans/${id}/reject/`);
      return response.data.loan;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Upload document for a loan
   */
  async uploadDocument(
    loanId: number,
    file: File,
    documentType: string,
    notes: string = ''
  ): Promise<LoanDocument> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', documentType);
      if (notes) {
        formData.append('notes', notes);
      }

      const response = await apiClient.post(
        `/loans/${loanId}/upload_document/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...getFormDataHeaders(),
          },
        }
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get loan statistics overview
   */
  async getLoansStatistics(): Promise<any> {
    try {
      const response = await apiClient.get('/loans/statistics/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Calculate loan monthly payment
   */
  async calculateLoan(amount: number, term: number): Promise<any> {
    try {
      const response = await apiClient.post('/calculator/', {
        amount,
        term,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default loanService;