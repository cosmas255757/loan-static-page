import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import {type Repayment, type Loan } from '../../types/loanSystem';

export const RepaymentsCRUD: React.FC = () => {
  const [repayments, setRepayments] = useState<Repayment[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Form Field States
  const [loanId, setLoanId] = useState<number | ''>('');
  const [amountPaid, setAmountPaid] = useState('');
const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      // Parallel fetch execution prevents network delays
      const [repaymentsResponse, loansResponse] = await Promise.all([
        apiService.getRepayments(),
        apiService.getLoans()
      ]);

      // 💡 SAFE UNPACKING: Pull array values cleanly from the controller envelope { repayments: [] }
      if (repaymentsResponse && Array.isArray(repaymentsResponse.repayments)) {
        setRepayments(repaymentsResponse.repayments);
      } else if (Array.isArray(repaymentsResponse)) {
        setRepayments(repaymentsResponse);
      } else {
        setRepayments([]);
      }

      // Extract loans payload array safely as well
      if (loansResponse && Array.isArray(loansResponse.loans)) {
        setLoans(loansResponse.loans);
      } else if (Array.isArray(loansResponse)) {
        setLoans(loansResponse);
      } else {
        setLoans([]);
      }
    } catch (err) {
      console.error("Failed executing core synchronization loop:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 🚀 CRASH-PROOF FILTER ENGINE: Prevents undefined toLowerCase loops
  const filteredRepayments = repayments.filter((repayment) => {
    const applicantTarget = repayment?.applicant_name || '';
    const cleanSearch = searchTerm.toLowerCase();
    return applicantTarget.toLowerCase().includes(cleanSearch);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amountPaid || isNaN(Number(amountPaid))) return alert('Provide a valid numeric payment amount.');
    if (!paymentDate) return alert('Please select a payment date.');

    try {
      if (editingId) {
        await apiService.updateRepayment(editingId, {
          amount_paid: Number(amountPaid),
          payment_date: paymentDate
        });
        alert('Repayment entry adjusted.');
      } else {
        if (!loanId) return alert('Please link this payment to an active loan contract.');
        await apiService.createRepayment({
          loan_id: Number(loanId),
          amount_paid: Number(amountPaid),
          payment_date: paymentDate
        });
        alert('Repayment transaction successfully posted.');
      }
      resetForm();
      loadData();
    } catch (err) {
      console.error("Write transaction rejected by database instance:", err);
    }
  };

const startEdit = (repayment: Repayment) => {
  setEditingId(Number(repayment.id)); 
  
  setAmountPaid(String(repayment.amount_paid));
  
  setLoanId(Number(repayment.loan_id));
  
  if (repayment.payment_date) {
    setPaymentDate(repayment.payment_date.split('T')[0]);
  }
};


  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this collection record permanently?")) return;
    try {
      await apiService.deleteRepayment(id);
      loadData();
    } catch (err) {
      console.error("Deletion cycle interrupted:", err);
    }
  };

 const resetForm = () => {
  setEditingId(null);
  setAmountPaid('');
  setLoanId(''); 
  setPaymentDate(new Date().toISOString().split('T')[0]);
};


  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', padding: '10px' }}>
      
      {/* LEFT: MANAGEMENT CONTROLLER FORM */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
        <h3>{editingId ? 'Modify Collection Record' : 'Post Capital Repayment'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '4px' }}>Target Loan Contract Reference</label>
            <select 
              value={loanId} 
              onChange={e => setLoanId(e.target.value ? Number(e.target.value) : '')}
              disabled={!!editingId}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: editingId ? '#e9ecef' : '#fff' }}
            >
              <option value="">-- Choose Contract --</option>
              {loans.map(loan => (
                <option key={loan.id} value={loan.id}>
                  Contract #{loan.id} — {loan.applicant_name || `Applicant ID: ${loan.applicant_id}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px' }}>Collected Capital Amount (\$)*</label>
            <input type="number" value={amountPaid} onChange={e => setAmountPaid(e.target.value)} placeholder="0.00" style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px' }}>Transaction Clearing Date *</label>
            <input type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="submit" style={{ flex: 1, padding: '10px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              {editingId ? 'Commit Adjustments' : 'Post Payment Entry'}
            </button>
            {editingId && <button type="button" onClick={resetForm} style={{ padding: '10px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>}
          </div>
        </form>
      </div>

      {/* RIGHT: LEDGER INDEX AND SEARCH INTERFACE */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0 }}>Collections & Repayments Ledger</h3>
          <input 
            type="text" 
            placeholder="Search by client account name..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
            style={{ padding: '8px 12px', width: '250px', border: '1px solid #ccc', borderRadius: '4px' }} 
          />
        </div>

        {loading ? (
          <div>Analyzing database records...</div>
        ) : filteredRepayments.length === 0 ? (
          <div style={{ color: '#6c757d', textAlign: 'center', padding: '20px' }}>No recorded collection transactions located.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #dee2e6', background: '#f8f9fa' }}>
                <th style={{ padding: '10px' }}>Receipt</th>
                <th style={{ padding: '10px' }}>Client</th>
                <th style={{ padding: '10px' }}>Amount Paid</th>
                <th style={{ padding: '10px' }}>Remaining Exposure</th>
                <th style={{ padding: '10px' }}>Date</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRepayments.map((repayment) => (
                <tr key={repayment.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '10px', color: '#6c757d' }}>#REC{repayment.id}</td>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{repayment.applicant_name || `Loan Reference: #${repayment.loan_id}`}</td>
                  <td style={{ padding: '10px', color: '#28a745', fontWeight: '500' }}>\${Number(repayment.amount_paid).toLocaleString()}</td>
                  <td style={{ padding: '10px', color: '#dc3545' }}>
                    {repayment.amount_left !== undefined ? `\${Number(repayment.amount_left).toLocaleString()}` : '—'}
                  </td>
                  <td style={{ padding: '10px', fontSize: '13px' }}>
                    {repayment.payment_date ? repayment.payment_date.split('T')[0] : '—'}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'right', display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                    <button onClick={() => startEdit(repayment)} style={{ padding: '4px 8px', background: '#ffc107', color: '#212529', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Edit</button>
                      <button 
                        onClick={() => handleDelete(Number(repayment.id))} 
                        style={{ padding: '4px 8px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                      >
                        Delete
                      </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};
