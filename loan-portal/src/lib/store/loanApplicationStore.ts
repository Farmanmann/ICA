// src/lib/store/loanApplicationStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LoanApplicationStep1 {
  borrower_name: string;
  email: string;
  phone: string;
  address: string;
  loan_type: 'murabaha' | 'ijarah' | 'musharakah';
  purpose: string;
}

export interface LoanApplicationStep2 {
  property_address?: string;
  property_value?: number;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_year?: number;
  vehicle_value?: number;
}

export interface LoanApplicationStep3 {
  amount: number;
  term: number;
  employment_status?: string;
  annual_income?: number;
  credit_score?: number;
}

export interface LoanApplicationStep4 {
  documents: File[];
}

export interface LoanApplicationData
  extends LoanApplicationStep1,
    LoanApplicationStep2,
    LoanApplicationStep3,
    LoanApplicationStep4 {
  id?: number; // Loan ID after creation
}

export interface LoanApplicationState {
  // State
  currentStep: number;
  formData: Partial<LoanApplicationData>;
  submitting: boolean;
  error: string | null;

  // Actions
  setStep: (step: number) => void;
  setFormData: (data: Partial<LoanApplicationData>) => void;
  updateFormData: (data: Partial<LoanApplicationData>) => void;
  setSubmitting: (submitting: boolean) => void;
  setError: (error: string | null) => void;
  nextStep: () => void;
  previousStep: () => void;
  reset: () => void;
  getFormDataForSubmission: () => Partial<LoanApplicationData>;
}

const initialState: Partial<LoanApplicationData> = {
  borrower_name: '',
  email: '',
  phone: '',
  address: '',
  loan_type: 'murabaha',
  purpose: '',
  property_address: '',
  property_value: undefined,
  vehicle_make: '',
  vehicle_model: '',
  vehicle_year: undefined,
  vehicle_value: undefined,
  amount: undefined,
  term: undefined,
  employment_status: '',
  annual_income: undefined,
  credit_score: undefined,
  documents: [],
};

export const useLoanApplicationStore = create<LoanApplicationState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentStep: 1,
      formData: { ...initialState },
      submitting: false,
      error: null,

      // Set current step
      setStep: (step: number) => {
        if (step >= 1 && step <= 5) {
          set({ currentStep: step });
        }
      },

      // Set all form data
      setFormData: (data: Partial<LoanApplicationData>) => {
        set({ formData: { ...initialState, ...data } });
      },

      // Update specific form data
      updateFormData: (data: Partial<LoanApplicationData>) => {
        set((state) => ({
          formData: {
            ...state.formData,
            ...data,
          },
        }));
      },

      // Set submitting state
      setSubmitting: (submitting: boolean) => {
        set({ submitting });
      },

      // Set error
      setError: (error: string | null) => {
        set({ error });
      },

      // Go to next step
      nextStep: () => {
        set((state) => {
          if (state.currentStep < 5) {
            return { currentStep: state.currentStep + 1 };
          }
          return state;
        });
      },

      // Go to previous step
      previousStep: () => {
        set((state) => {
          if (state.currentStep > 1) {
            return { currentStep: state.currentStep - 1 };
          }
          return state;
        });
      },

      // Reset to initial state
      reset: () => {
        set({
          currentStep: 1,
          formData: { ...initialState },
          submitting: false,
          error: null,
        });
      },

      // Get form data without documents for API submission
      getFormDataForSubmission: () => {
        const { documents, ...dataForSubmission } = get().formData;
        return dataForSubmission;
      },
    }),
    {
      name: 'loan-application-storage', // localStorage key
      partialize: (state) => ({
        currentStep: state.currentStep,
        formData: {
          ...state.formData,
          documents: [], // Don't persist files
        },
      }),
    }
  )
);

// Helper hooks
export const useCurrentLoanApplicationStep = () => {
  return useLoanApplicationStore((state) => state.currentStep);
};

export const useLoanApplicationFormData = () => {
  return useLoanApplicationStore((state) => state.formData);
};

export const useLoanApplicationSubmitting = () => {
  return useLoanApplicationStore((state) => state.submitting);
};

export const useLoanApplicationError = () => {
  return useLoanApplicationStore((state) => state.error);
};