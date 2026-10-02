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
  id: string;
  officerId: string; // Links this applicant to a specific Loan Officer
  name: string;
  email: string;
  phone: string;
  livingLocation: string; 
  occupation: string;     
  sex: 'Male' | 'Female' | 'Other'; 
  relationStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed'; // New field
  createdAt: string; // Format: YYYY-MM-DD
}

// Details a capital loan package assigned to an applicant
export interface Loan {
  id: string;
  officerId: string; // Ensures account-level isolation for data segregation
  applicantId: string; // Links back to the structural Applicant entity
  amount: number;
  interestRate: number; // Stored as a flat integer/float percentage value (e.g., 12.5 for 12.5%)
  durationMonths: number;
  status: 'Pending' | 'Approved' | 'Fully Paid' | 'Defaulted';
  issuedDate: string; // Format: YYYY-MM-DD
}

// Captures a transactional installment repayment history item
export interface Repayment {
  id: string;
  officerId: string;
  loanId: string;
  amountPaid: number;
  paymentDate: string; // Format: YYYY-MM-DD
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
