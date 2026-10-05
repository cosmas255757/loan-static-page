// ==========================================
// AUTH & ACCOUNT TYPES
// ==========================================

// Defines a Loan Officer account profile
export interface LoanOfficer {
  id: string;
  name: string;
  email: string;
}

// Global Authentication context state contract
export interface AuthContextType {
  currentUser: LoanOfficer | null;
  registerUser: (userData: LoanOfficer & { password?: string }) => Promise<{ success: boolean; message?: string }>; // Added Promise<...>
  loginUser: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;               // Added Promise<...>
  logoutUser: () => void;
}


// ==========================================
// CORE DOMAIN ENTITY DATA MODELS
// ==========================================

// Represents an individual applicant registered under a Loan Officer
// Replace the Applicant interface block inside src/types/loanSystem.ts
export interface Applicant {
  id: number;
  full_name: string; 
  phone?: string;
  living_location?: string;
  occupation?: string;
  sex?: 'Male' | 'Female' | 'Other';
  relationship_status?: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  user_id?: number;
  created_at?: string;
}

// Details a capital loan package assigned to an applicant
export interface Loan {
  id: number;
  applicant_id: number;
  applicant_name?: string; 
  amount: number;
  status: 'pending' | 'active' | 'Approved' | 'Defaulted' | string;
  created_at: string;      
  user_id?: number;
}


// Captures a transactional installment repayment history item
export interface Repayment {
  id: number;
  loan_id: number;
  applicant_name?: string;       
  amount_paid: number;           
  original_loan_amount?: number; 
  amount_left?: number;         
  payment_date: string;         
  user_id?: number;
}

// ==========================================
// SYSTEM ANALYTICS Kpis
// ==========================================

// Aggregated values computed dynamically on the Dashboard header module
export interface DashboardStats {
  totalApplicants: number;
  totalLoansIssued: number;
  totalVolume: number; // Sum total principal capital issued
  totalCollected: number; // Cumulative sum of all repayment logs
  pendingCollections: number; // Remaining outstanding balance exposure
}
