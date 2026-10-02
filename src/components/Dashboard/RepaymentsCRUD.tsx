import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { apiService } from '../../services/api';
import { type Repayment, type Loan, type Applicant } from '../../types/loanSystem';

export const RepaymentsCRUD: React.FC = () => {
  const { currentUser } = useAuth();

  // Core component state lists
  const [repayments, setRepayments] = useState<Repayment[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [searchTerm, setSearchTerm] = useState(''); 

  // Form handling input state buffers
  const [formId, setFormId] = useState('');
  const [loanId, setLoanId] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentDate, setPaymentDate] = useState('');

  // Fetch contextual master datasets from the API layer
  const loadData = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const filteredApplicants = await apiService.getApplicants();
      const filteredLoans = await apiService.getLoans();
      const filteredRepayments = await apiService.getRepayments();

      setApplicants(filteredApplicants);
      setLoans(filteredLoans);
      setRepayments(filteredRepayments);
    } catch (error) {
      console.error('Failed to synchronize payment collection ledgers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser || !loanId || !amountPaid) return;

    const payload: Repayment = {
      id: isEditing ? formId : 'pay_' + Date.now(),
      officerId: currentUser.id,
      loanId,
      amountPaid: Number(amountPaid),
      paymentDate: paymentDate || new Date().toISOString().split('T')[0]
    };

    setLoading(true);
    try {
      await apiService.saveRepayment    (payload, isEditing);

      // Dynamic Automation: Update matching Loan status if it is fully paid off
      const matchedLoan = loans.find(l => l.id === loanId);
      if (matchedLoan) {
        // Calculate all payments for this specific loan *before* this new submit finishes
        const otherPayments = repayments.filter(r => r.loanId === loanId && r.id !== formId);
        const dynamicTotalPaid = otherPayments.reduce((sum, r) => sum + r.amountPaid, 0) + Number(amountPaid);
        
        if (dynamicTotalPaid >= matchedLoan.amount) {
          await apiService.saveLoan({ ...matchedLoan, status: 'Fully Paid' }, false);
        } else if (matchedLoan.status === 'Fully Paid') {
          // If edited to a lower amount, restore to active tracking state
          await apiService.saveLoan({ ...matchedLoan, status: 'Approved' }, false);
        }
      }

      resetForm();
      await loadData();
    } catch (error) {
      console.error('Failed to log remittance transaction details:', error);
      setLoading(false);
    }
  };

  const handleEditInit = (repayment: Repayment) => {
    setIsEditing(true);
    setFormId(repayment.id);
    setLoanId(repayment.loanId);
    setAmountPaid(String(repayment.amountPaid));
    setPaymentDate(repayment.paymentDate);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!currentUser || !window.confirm('Are you sure you want to permanently delete this collection record?')) return;
    setLoading(true);
    try {
      await apiService.deleteRepayment(id);
      await loadData();
    } catch (error) {
      console.error('Failed to remove transaction log entry:', error);
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setFormId('');
    setLoanId('');
    setAmountPaid('');
    setPaymentDate('');
    setIsModalOpen(false); 
  };

  // Filter transaction records by matching search string to borrower names or emails
  const filteredRepayments = repayments.filter(repayment => {
    const loanObj = loans.find(l => l.id === repayment.loanId);
    const clientObj = loanObj ? applicants.find(a => a.id === loanObj.applicantId) : null;
    if (!clientObj) return false;
    return (
      clientObj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clientObj.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Helper utility to calculate total paid *up to and including* a given payment date context
  const calculateLoanProgress = (targetLoan: Loan | undefined) => {
    if (!targetLoan) return { amountLeft: 0, statusText: 'Unknown' };
    
    // Sum total paid across all time for this specific loan file
    const loanPayments = repayments.filter(r => r.loanId === targetLoan.id);
    const cumulativePaid = loanPayments.reduce((sum, r) => sum + r.amountPaid, 0);
    const amountLeft = Math.max(0, targetLoan.amount - cumulativePaid);
    
    let statusText = 'In Progress';
    if (targetLoan.status === 'Defaulted') {
      statusText = 'Overdue';
    } else if (amountLeft <= 0) {
      statusText = 'Fully Paid';
    }

    return { amountLeft, statusText };
  };

  return (
    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '6px', border: '1px solid #ddd', position: 'relative' }}>
      
      {/* Top Search Controls & Action Modal Trigger */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Search collections by borrower name or email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: '400px', padding: '10px 14px', border: '1px solid #ccc', borderRadius: '4px', margin: 0 }}
        />
        
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          style={{ padding: '10px 18px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <span style={{ fontSize: '18px', lineHeight: '0' }}>+</span> Log Installment
        </button>
      </div>

      <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#333' }}>Repayment Transaction Tracking Ledger</h3>

      {/* Transaction Log Table Output View */}
      {loading && filteredRepayments.length === 0 ? (
        <p>Updating transactional ledgers fields...</p>
      ) : filteredRepayments.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          {searchTerm ? 'No collections match your criteria.' : 'No installment records mapped. Click the log button above to add records.'}
        </p>
      ) : (
        <table className="table-container" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f1f1f1', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '12px 10px' }}>Applicant Name</th>
              <th style={{ padding: '12px 10px' }}>Reference Loan ID</th>
              <th style={{ padding: '12px 10px' }}>Amount Paid</th>
              <th style={{ padding: '12px 10px' }}>Amount Left</th>
              <th style={{ padding: '12px 10px' }}>Clearing Date</th>
              <th style={{ padding: '12px 10px' }}>Status</th>
              <th style={{ padding: '12px 10px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRepayments.map(item => {
              const matchedLoan = loans.find(l => l.id === item.loanId);
              const matchedClient = matchedLoan ? applicants.find(a => a.id === matchedLoan.applicantId) : null;
              const { amountLeft, statusText } = calculateLoanProgress(matchedLoan);

              return (
                <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px 10px', fontWeight: '500', color: '#007bff' }}>
                    {matchedClient ? matchedClient.name : 'Unknown Profile'}
                    {matchedClient && <div style={{ fontSize: '12px', color: '#666', fontWeight: 'normal' }}>{matchedClient.email}</div>}
                  </td>
                  <td style={{ padding: '12px 10px', fontSize: '13px', fontFamily: 'monospace', color: '#555' }}>
                    {item.loanId}
                  </td>
                  <td style={{ padding: '12px 10px', color: '#28a745', fontWeight: 'bold' }}>
                    +${item.amountPaid.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 10px', color: '#dc3545', fontWeight: '500' }}>
                    ${amountLeft.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 10px', color: '#666' }}>{item.paymentDate}</td>
                  <td style={{ padding: '12px 10px' }}>
                    <span style={{
                      padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold',
                      backgroundColor: statusText === 'Fully Paid' ? '#d4edda' : statusText === 'In Progress' ? '#cce5ff' : '#f8d7da',
                      color: statusText === 'Fully Paid' ? '#155724' : statusText === 'In Progress' ? '#004085' : '#721c24'
                    }}>
                      {statusText}
                    </span>
                  </td>
                      <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                    <button onClick={() => handleEditInit(item)} style={{ marginRight: '6px', padding: '5px 10px', background: '#ffc107', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>Edit</button>
                    <button onClick={() => handleDelete(item.id)} style={{ padding: '5px 10px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* ==========================================================================
         REPAYMENT MODAL OVERLAY POPUP
         ========================================================================== */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', width: '100%', maxWidth: '450px', position: 'relative' }}>
            
            <h3 style={{ marginTop: 0, marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              {isEditing ? 'Modify Installment Parameters' : 'Log Collection Installment'}
            </h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Target Loan Account Profile</label>
                <select value={loanId} onChange={e => setLoanId(e.target.value)} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} required>
                  <option value="">-- Choose Loan File --</option>
                  {loans.map(loan => {
                    const client = applicants.find(a => a.id === loan.applicantId);
                    return (
                      <option key={loan.id} value={loan.id}>
                        {client ? client.name : 'Unknown User'} (Principal: ${loan.amount} | ID: {loan.id.substring(0,8)}...)
                      </option>
                    );
                  })}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Amount Settled ($)</label>
                <input type="number" placeholder="500" value={amountPaid} onChange={e => setAmountPaid(e.target.value)} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} required />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Collection Remittance Date</label>
                <input type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} required />
              </div>
              
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={resetForm} style={{ padding: '10px 16px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={loading} style={{ padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                  {isEditing ? 'Save Revisions' : 'Confirm Collection'}
                </button>
              </div>
            </form>
            
          </div>
        </div>
      )}
    </div>
  );
};
