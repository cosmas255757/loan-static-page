import {type Applicant,type Loan,type Repayment,type DashboardStats } from '../types/loanSystem';

// Global API Base Address Selector
const API_BASE_URL = import.meta.env.VITE_API_URL ||'https://loan-fe67.onrender.com' || 'http://localhost:5000/api';

// Helper shortcut to retrieve token dynamically for secure requests
const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// Generic response processor error engine
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP server exception payload: ${response.status}`);
  }
  return response.json();
};

export const apiService = {
  // ==========================================
  // APPLICANTS BACKEND CONTROLLER INJECTIONS
  // ==========================================
      // 1. GET ALL APPLICANTS (100% Correct - matches raw rows array)
      getApplicants: async (): Promise<Applicant[]> => {
        const res = await fetch(`${API_BASE_URL}/api/applicants`, {
          method: 'GET',
          headers: getAuthHeaders()
        });
        return handleResponse(res);
      },

      // 2. CREATE NEW APPLICANT (Changed to Promise<any> to accept the status payload)
      createApplicant: async (applicant: Omit<Applicant, 'id'>): Promise<any> => {
        const res = await fetch(`${API_BASE_URL}/api/applicants`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(applicant)
        });
        return handleResponse(res);
      },

      // 3. UPDATE EXISTING APPLICANT (Changed to Promise<any> to accept the status payload)
      updateApplicant: async (id: number, applicant: Partial<Applicant>): Promise<any> => {
        const res = await fetch(`${API_BASE_URL}/api/applicants/${id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(applicant)
        });
        return handleResponse(res);
      },

      // 4. DELETE AN APPLICANT (Changed to Promise<any> to accept the status payload)
      deleteApplicant: async (id: number): Promise<any> => {
        const res = await fetch(`${API_BASE_URL}/api/applicants/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        return handleResponse(res);
      },

  // ==========================================
  // LOANS BACKEND CONTROLLER INJECTIONS
  // ==========================================
  // 1. GET ALL LOANS (100% Correct - accurately matches your { count, loans } wrapping envelope)
  getLoans: async (): Promise<{ count: number; loans: Loan[] }> => {
    const res = await fetch(`${API_BASE_URL}/api/loans`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // 2. DISBURSE A NEW LOAN (Updated to Promise<any> to safely receive success data object)
  createLoan: async (loan: { applicant_id: number; amount: number }): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/api/loans`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(loan)
    });
    return handleResponse(res);
  },

  // 3. EDIT OUTSTANDING LOAN CONTRACT (Updated to Promise<any> to safely receive update data object)
  updateLoan: async (id: number, loan: { amount: number; status: string }): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/api/loans/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(loan)
    });
    return handleResponse(res);
  },

  // 4. DROP LOAN AGREEMENT (Updated to Promise<any> to safely unpack delete completion object)
  deleteLoan: async (id: number): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/api/loans/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },


  // ==========================================
  // REPAYMENTS BACKEND CONTROLLER INJECTIONS
  // ==========================================
        // 1. GET ALL REPAYMENTS (100% Correct - matches your backend wrapping envelope exactly)
    getRepayments: async (): Promise<{ count: number; repayments: Repayment[] }> => {
      const res = await fetch(`${API_BASE_URL}/api/repayments`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },

    // 2. CREATE A REPAYMENT RECORD (Updated to Promise<any> to safely unpack success message & metrics)
    createRepayment: async (repayment: { loan_id: number; amount_paid: number; payment_date: string }): Promise<any> => {
      const res = await fetch(`${API_BASE_URL}/api/repayments`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(repayment)
      });
      return handleResponse(res);
    },

    // 3. EDIT REPAYMENT TRANSACTION (Updated to Promise<any> to handle incoming replacement row payload)
    updateRepayment: async (id: number, repayment: { amount_paid: number; payment_date: string }): Promise<any> => {
      const res = await fetch(`${API_BASE_URL}/api/repayments/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(repayment)
      });
      return handleResponse(res);
    },

    // 4. DROP REPAYMENT LOG (Updated to Promise<any> to unpack the deleted verification payload)
    deleteRepayment: async (id: number): Promise<any> => {
      const res = await fetch(`${API_BASE_URL}/api/repayments/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },


  // ==========================================
  // DASHBOARD ADVANCED CHRONOLOGICAL STATISTICS
  // ==========================================
  getDashboardMetrics: async (): Promise<DashboardStats> => {
    const res = await fetch(`${API_BASE_URL}/api/stats/dashboard`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  }
};