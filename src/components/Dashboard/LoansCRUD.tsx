import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { apiService } from '../../services/api';
import { type Loan, type Applicant } from '../../types/loanSystem';

export const LoansCRUD: React.FC = () => {
  const { currentUser } = useAuth();

  // Core component state lists
  const [loans, setLoans] = useState<Loan[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls form overlay popup state
  const [searchTerm, setSearchTerm] = useState(''); // Text tracking state for searching loans

  // Form handling input state buffers
  const [formId, setFormId] = useState('');
  const [applicantId, setApplicantId] = useState('');
  const [amount, setAmount] = useState('');
  const [interestRate, setInterestRate] = useState('10');
  const [durationMonths, setDurationMonths] = useState('12');
  const [status, setStatus] = useState<Loan['status']>('Pending');

  // Load contextual master dataset records for active identity logs
  const loadData = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const filteredApplicants = await apiService.getApplicants();
      const filteredLoans = await apiService.getLoans();
      setApplicants(filteredApplicants);
      setLoans(filteredLoans);
    } catch (error) {
      console.error('Failed to synchronize loan accounts database parameters:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser || !applicantId || !amount) return;

    const payload: Loan = {
      id: isEditing ? formId : 'loan_' + Date.now(),
      officerId: currentUser.id,
      applicantId,
      amount: Number(amount),
      interestRate: Number(interestRate),
      durationMonths: Number(durationMonths),
      status,
      issuedDate: isEditing
        ? loans.find(l => l.id === formId)?.issuedDate || new Date().toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0]
    };

    setLoading(true);
    try {
       await apiService.saveLoan (payload, isEditing);
      resetForm();
      await loadData();
    } catch (error) {
      console.error('Failed to commit loan entry changes to records:', error);
      setLoading(false);
    }
  };

  const handleEditInit = (loan: Loan) => {
    setIsEditing(true);
    setFormId(loan.id);
    setApplicantId(loan.applicantId);
    setAmount(String(loan.amount));
    setInterestRate(String(loan.interestRate));
    setDurationMonths(String(loan.durationMonths));
    setStatus(loan.status);
    setIsModalOpen(true); // Open the overlay dialog populated with parameters
  };

  const handleDelete = async (id: string) => {
    if (!currentUser || !window.confirm('Voiding this profile deletes all ongoing balance expectations. Proceed?')) return;
    setLoading(true);
    try {
      await apiService.deleteLoan(id);
      await loadData();
    } catch (error) {
      console.error('Failed to remove targeted loan ledger allocation profile:', error);
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setFormId('');
    setApplicantId('');
    setAmount('');
    setInterestRate('10');
    setDurationMonths('12');
    setStatus('Pending');
    setIsModalOpen(false); // Dismiss popup layer safely
  };

  // Live filter utility mapping search inputs against compiled applicant models
  const filteredLoans = loans.filter(loan => {
    const borrower = applicants.find(a => a.id === loan.applicantId);
    if (!borrower) return false;
    return (
      borrower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      borrower.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '6px', border: '1px solid #ddd', position: 'relative' }}>
      
      {/* Top Controller Layout Block: Search and Open Overlay Action Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Search loans by borrower name or email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: '400px', padding: '10px 14px', border: '1px solid #ccc', borderRadius: '4px', margin: 0 }}
        />
        
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          style={{ padding: '10px 18px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <span style={{ fontSize: '18px', lineHeight: '0' }}>+</span> Add Loan
        </button>
      </div>

      <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#333' }}>Active Loan Disbursals</h3>

      {/* Ledger Accounts Output Table Display (Hidden Loan ID Column) */}
      {loading && filteredLoans.length === 0 ? (
        <p>Updating financial parameters summary fields...</p>
      ) : filteredLoans.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          {searchTerm ? 'No loans match your search parameter criteria.' : 'No active loan documents assigned. Click the button above to add a configuration.'}
        </p>
      ) : (
        <table className="table-container" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f1f1f1', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '12px 10px' }}>Borrower</th>
              <th style={{ padding: '12px 10px' }}>Principal Capital</th>
              <th style={{ padding: '12px 10px' }}>Rate Balance</th>
              <th style={{ padding: '12px 10px' }}>Amortization Term</th>
              <th style={{ padding: '12px 10px' }}>Status</th>
              <th style={{ padding: '12px 10px' }}>Issued Date</th>
              <th style={{ padding: '12px 10px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLoans.map(loan => {
              const clientMatch = applicants.find(a => a.id === loan.applicantId);
              return (
                <tr key={loan.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px 10px', fontWeight: '500', color: '#007bff' }}>
                    {clientMatch ? clientMatch.name : 'Unknown/Archived Profile'}
                    {clientMatch && <div style={{ fontSize: '12px', color: '#666', fontWeight: 'normal' }}>{clientMatch.email}</div>}
                  </td>
                  <td style={{ padding: '12px 10px', fontWeight: 'bold' }}>${loan.amount.toLocaleString()}</td>
                  <td style={{ padding: '12px 10px' }}>{loan.interestRate}%</td>
                  <td style={{ padding: '12px 10px' }}>{loan.durationMonths} Months</td>
                  <td style={{ padding: '12px 10px' }}>
                    <span style={{
                      padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold',
                      backgroundColor: loan.status === 'Approved' ? '#d4edda' : loan.status === 'Pending' ? '#fff3cd' : loan.status === 'Fully Paid' ? '#cce5ff' : '#f8d7da',
                      color: loan.status === 'Approved' ? '#155724' : loan.status === 'Pending' ? '#856404' : loan.status === 'Fully Paid' ? '#004085' : '#721c24'
                    }}>
                      {loan.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 10px', color: '#666' }}>{loan.issuedDate}</td>
                  <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                    <button onClick={() => handleEditInit(loan)} style={{ marginRight: '6px', padding: '5px 10px', background: '#ffc107', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>Modify</button>
                    <button onClick={() => handleDelete(loan.id)} style={{ padding: '5px 10px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>Void</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* ==========================================================================
         LOAN APPLICATION OVERLAY POPUP MODAL SCREEN
         ========================================================================== */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', width: '100%', maxWidth: '480px', position: 'relative' }}>
            
            <h3 style={{ marginTop: 0, marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              {isEditing ? 'Modify Loan Configuration' : 'Disburse New Loan Package'}
            </h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Target Borrower Profile</label>
                <select value={applicantId} onChange={e => setApplicantId(e.target.value)} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} required>
                  <option value="">-- Select Applicant --</option>
                  {applicants.map(applicant => (        
                    <option key={applicant.id} value={applicant.id}>
                        {applicant.name} ({applicant.email})
                    </option>
                  ))}
                </select>
              </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Principal Loan Amount</label>
                    <input type="number" placeholder="10000" value={amount} onChange={e => setAmount(e.target.value)} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Interest Rate</label>
                    <input type="number" placeholder="5" value={interestRate} onChange={e => setInterestRate(e.target.value)} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} required />
                </div>  
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>  

                    <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Amortization Duration (Months)</label>
                    <input type="number" placeholder="12" value={durationMonths} onChange={e => setDurationMonths(e.target.value)} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} required />
                </div>  
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Loan Status</label>
                    <select value={status} onChange={e => setStatus(e.target.value as Loan['status'])} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} required>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Fully Paid">Fully Paid</option>
                        <option value="Defaulted">Defaulted</option>
                    </select>
                </div>  
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>   
                    <button type="button" onClick={resetForm} style={{ padding: '10px 16px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Cancel
                    </button>
                    <button type="submit" disabled={loading} style={{ padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>    

                        {isEditing ? 'Save Changes' : 'Confirm Disbursal'}
                    </button>
                </div>  
            </form>
          </div>
        </div>  
        )}  
    </div>
    );
};