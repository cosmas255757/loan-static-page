import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { type Repayment, type Loan } from '../../types/loanSystem';

export const RepaymentsCRUD: React.FC = () => {
  const [repayments, setRepayments] = useState<Repayment[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Modal display toggle state
  const [isModalOpen, setIsModalOpen] = useState(false);

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

      // SAFE UNPACKING: Pull array values cleanly from the controller envelope { repayments: [] }
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

  // CRASH-PROOF FILTER ENGINE: Prevents undefined toLowerCase loops
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
      closeAndResetForm();
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
    setIsModalOpen(true); // Open form modal box upon selection
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

  const closeAndResetForm = () => {
    setEditingId(null);
    setAmountPaid('');
    setLoanId(''); 
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      
      {/* HEADER CONTROLS VIEWPORT */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '20px', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ margin: 0, color: '#212529' }}>Collections & Repayments Ledger</h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6c757d' }}>Track incoming collections, transaction clearing dates, and active exposures</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Search by client account name..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
            style={{ padding: '10px 14px', width: '280px', border: '1px solid #ced4da', borderRadius: '6px', fontSize: '14px' }} 
          />
          <button 
            onClick={() => setIsModalOpen(true)}
            style={{ padding: '10px 16px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 4px rgba(40,167,69,0.15)' }}
          >
            + Post Repayment
          </button>
        </div>
      </div>

            {/* FULL WIDTH LEDGER WORKSPACE TABLE */}
      <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #dee2e6', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#28a745' }}>Analyzing database records...</div>
        ) : filteredRepayments.length === 0 ? (
          <div style={{ color: '#6c757d', textAlign: 'center', padding: '40px', fontSize: '15px' }}>No recorded collection transactions located.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #dee2e6', background: '#f8f9fa', color: '#495057' }}>
                  <th style={{ padding: '14px 16px', fontWeight: '600' }}>Client Name</th>
                  <th style={{ padding: '14px 16px', fontWeight: '600' }}>Amount Paid</th>
                  <th style={{ padding: '14px 16px', fontWeight: '600' }}>Amount Left</th>
                  <th style={{ padding: '14px 16px', fontWeight: '600' }}>Clearing Date</th>
                  <th style={{ padding: '14px 16px', fontWeight: '600', textAlign: 'right' }}>Actions Workspace</th>
                </tr>
              </thead>
              <tbody>
                {filteredRepayments.map((repayment) => (
                  <tr key={repayment.id} style={{ borderBottom: '1px solid #eee', transition: 'background 0.15s' }}>
                    <td style={{ padding: '14px 16px', fontWeight: '600', color: '#212529' }}>
                      {repayment.applicant_name || `Loan Ref: #${repayment.loan_id}`}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#28a745', fontWeight: '600' }}>
                      TSH {Number(repayment.amount_paid).toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#dc3545', fontWeight: '600' }}>
                      TSH {Number(repayment.amount_left).toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#495057' }}>
                      {repayment.payment_date ? repayment.payment_date.split('T')[0] : '—'}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <button 
                        onClick={() => startEdit(repayment)}
                        style={{ padding: '6px 12px', background: '#fff', color: '#007bff', border: '1px solid #007bff', borderRadius: '4px', marginRight: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '13px' }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(repayment.id)}
                        style={{ padding: '6px 12px', background: '#fff', color: '#dc3545', border: '1px solid #dc3545', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', fontSize: '13px' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* OVERLAY MODAL: TRANSACTION COLLECTIONS MANAGEMENT PANEL */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1050 }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '460px', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', border: '1px solid #dee2e6', position: 'relative' }}>
            
            {/* Modal Box Close Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e9ecef', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#212529' }}>
                {editingId ? '📝 Modify Collection Record' : '💵 Post Capital Repayment Entry'}
              </h3>
              <button 
                onClick={closeAndResetForm}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6c757d', padding: '0 5px' }}
              >
                &times;
              </button>
            </div>

            {/* Input fields form validation panel */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '500', color: '#495057' }}>Target Loan Contract Reference</label>
                <select
                  value={loanId}
                  onChange={e => setLoanId(e.target.value ? Number(e.target.value) : '')}
                  disabled={!!editingId}
                  required
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #ced4da', borderRadius: '6px', background: editingId ? '#e9ecef' : '#fff', boxSizing: 'border-box' }}
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
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '500', color: '#495057' }}>Collected Capital Amount (TSH) *</label>
                <input
                  type="number"
                  value={amountPaid}
                  onChange={e => setAmountPaid(e.target.value)}
                  placeholder="e.g. 50,000"
                  required
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #ced4da', borderRadius: '6px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '500', color: '#495057' }}>Transaction Clearing Date *</label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={e => setPaymentDate(e.target.value)}
                  required
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #ced4da', borderRadius: '6px', boxSizing: 'border-box' }}
                />
              </div>

              {/* Form Actions Footer Panel */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '15px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={closeAndResetForm}
                  style={{ padding: '10px 16px', background: '#f8f9fa', color: '#495057', border: '1px solid #ced4da', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '14px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 20px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', boxShadow: '0 2px 4px rgba(40,167,69,0.2)' }}
                >
                  {editingId ? 'Commit Adjustments' : 'Post Payment Entry'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  )
};
