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
  getApplicants: async (): Promise<Applicant[]> => {
    // Maps to: GET /api/applicants
    const res = await fetch(`${API_BASE_URL}/applicants`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  saveApplicant: async (applicant: Applicant, isEdit: boolean): Promise<void> => {
    // Maps to: POST /api/applicants OR PUT /api/applicants/:id
    const url = isEdit ? `${API_BASE_URL}/applicants/${applicant.id}` : `${API_BASE_URL}/applicants`;
    const res = await fetch(url, {
      method: isEdit ? 'PUT' : 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(applicant)
    });
    return handleResponse(res);
  },

  deleteApplicant: async (id: string): Promise<void> => {
    // Maps to: DELETE /api/applicants/:id
    const res = await fetch(`${API_BASE_URL}/applicants/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // ==========================================
  // LOANS BACKEND CONTROLLER INJECTIONS
  // ==========================================
  getLoans: async (): Promise<Loan[]> => {
    // Maps to: GET /api/loans
    const res = await fetch(`${API_BASE_URL}/loans`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  saveLoan: async (loan: Loan, isEdit: boolean): Promise<void> => {
    // Maps to: POST /api/loans OR PUT /api/loans/:id
    const url = isEdit ? `${API_BASE_URL}/loans/${loan.id}` : `${API_BASE_URL}/loans`;
    const res = await fetch(url, {
      method: isEdit ? 'PUT' : 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(loan)
    });
    return handleResponse(res);
  },

  deleteLoan: async (id: string): Promise<void> => {
    // Maps to: DELETE /api/loans/:id
    const res = await fetch(`${API_BASE_URL}/loans/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // ==========================================
  // REPAYMENTS BACKEND CONTROLLER INJECTIONS
  // ==========================================
  getRepayments: async (): Promise<Repayment[]> => {
    // Maps to: GET /api/repayments
    const res = await fetch(`${API_BASE_URL}/repayments`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  saveRepayment: async (repayment: Repayment, isEdit: boolean): Promise<void> => {
    // Maps to: POST /api/repayments OR PUT /api/repayments/:id
    const url = isEdit ? `${API_BASE_URL}/repayments/${repayment.id}` : `${API_BASE_URL}/repayments`;
    const res = await fetch(url, {
      method: isEdit ? 'PUT' : 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(repayment)
    });
    return handleResponse(res);
  },

  deleteRepayment: async (id: string): Promise<void> => {
    // Maps to: DELETE /api/repayments/:id
    const res = await fetch(`${API_BASE_URL}/repayments/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // ==========================================
  // DASHBOARD ADVANCED CHRONOLOGICAL STATISTICS
  // ==========================================
  getDashboardMetrics: async (): Promise<DashboardStats> => {
    // FIXED: Changed endpoint from `${API_BASE_URL}/dashboard` to point to your actual backend geometry
    const res = await fetch(`${API_BASE_URL}/stats/dashboard`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  }
};