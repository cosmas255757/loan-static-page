import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { type Loan, type Applicant } from '../../types/loanSystem';

export const LoansCRUD: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Modal toggle state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Field States
  const [applicantId, setApplicantId] = useState<number | 'Selected' | ''>('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('active');
  const [editingId, setEditingId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      // Parallelize calls to maximize performance speed
      const [loansResponse, applicantsData] = await Promise.all([
        apiService.getLoans(),
        apiService.getApplicants()
      ]);

      // Safely read the array from the backend wrapping envelope { count, loans }
      if (loansResponse && Array.isArray(loansResponse.loans)) {
        setLoans(loansResponse.loans);
      } else if (Array.isArray(loansResponse)) {
        setLoans(loansResponse);
      } else {
        setLoans([]);
      }

      setApplicants(Array.isArray(applicantsData) ? applicantsData : []);
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
  const filteredLoans = loans.filter((loan) => {
    const nameTarget = loan?.applicant_name || '';
    const statusTarget = loan?.status || '';
    const cleanSearch = searchTerm.toLowerCase();

    return (
      nameTarget.toLowerCase().includes(cleanSearch) ||
      statusTarget.toLowerCase().includes(cleanSearch)
    );
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return alert('Provide a valid numerical amount.');

    try {
      if (editingId) {
        await apiService.updateLoan(editingId, {
          amount: Number(amount),
          status: status
        });
        alert('Loan terms adjusted successfully.');
      } else {
        if (!applicantId || applicantId === 'Selected') return alert('Please link an active applicant.');
        await apiService.createLoan({
          applicant_id: Number(applicantId),
          amount: Number(amount)
        });
        alert('Disbursement logged into system.');
      }
      closeAndResetForm();
      loadData();
    } catch (err) {
      console.error("Write transaction rejected by database instance:", err);
    }
  };

  const startEdit = (loan: Loan) => {
    setEditingId(loan.id);
    setAmount(String(loan.amount));
    setStatus(loan.status);
    setApplicantId(loan.applicant_id || '');
    setIsModalOpen(true); // Launch modal automatically upon editing selection
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Drop this loan contract entirely?")) return;
    try {
      await apiService.deleteLoan(id);
      loadData();
    } catch (err) {
      console.error("Deletion cycle interrupted:", err);
    }
  };

  const closeAndResetForm = () => {
    setEditingId(null);
    setAmount('');
    setStatus('active');
    setApplicantId('');
    setIsModalOpen(false);
  };

  // Helper styling function to cleanly display color status badges
  const getStatusBadgeStyle = (loanStatus: string) => {
    const baseStyle = { padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' as const };
    switch (loanStatus?.toLowerCase()) {
      case 'active':
      case 'approved':
        return { ...baseStyle, backgroundColor: '#d4edda', color: '#155724' };
      case 'pending':
        return { ...baseStyle, backgroundColor: '#fff3cd', color: '#856404' };
      case 'defaulted':
        return { ...baseStyle, backgroundColor: '#f8d7da', color: '#721c24' };
      default:
        return { ...baseStyle, backgroundColor: '#e2e3e5', color: '#383d41' };
    }
  };

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      
      {/* HEADER CONTROLS VIEWPORT */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '20px', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ margin: 0, color: '#212529' }}>Active Portfolio Loans Ledger</h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6c757d' }}>Monitor balances, status configurations, and credit disbursements</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Search by client or compliance status..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
            style={{ padding: '10px 14px', width: '280px', border: '1px solid #ced4da', borderRadius: '6px', fontSize: '14px' }} 
          />
          <button 
            onClick={() => setIsModalOpen(true)}
            style={{ padding: '10px 16px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 4px rgba(0,123,255,0.15)' }}
          >
            + Issue New Loan
          </button>
        </div>
      </div>

      {/* FULL WIDTH LEDGER WORKSPACE TABLE */}
      <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #dee2e6', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#007bff' }}>Analyzing database records...</div>
        ) : filteredLoans.length === 0 ? (
          <div style={{ color: '#6c757d', textAlign: 'center', padding: '40px', fontSize: '15px' }}>No contractual loan records located.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #dee2e6', background: '#f8f9fa', color: '#495057' }}>
                  <th style={{ padding: '14px 16px', fontWeight: '600' }}>Applicant Name</th>
                  <th style={{ padding: '14px 16px', fontWeight: '600' }}>Issued Value</th>
                  <th style={{ padding: '14px 16px', fontWeight: '600' }}>Compliance Status</th>
                  <th style={{ padding: '14px 16px', fontWeight: '600', textAlign: 'right' }}>Actions Workspace</th>
                </tr>
              </thead>
              <tbody>
                {filteredLoans.map((loan) => (
                  <tr key={loan.id} style={{ borderBottom: '1px solid #eee', transition: 'background 0.15s' }}>
                    <td style={{ padding: '14px 16px', fontWeight: '600', color: '#212529' }}>
                      {loan.applicant_name || `Applicant ID: ${loan.applicant_id}`}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#28a745', fontWeight: '600' }}>
                      TZS {Number(loan.amount).toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={getStatusBadgeStyle(loan.status)}>
                        {loan.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <button 
                        onClick={() => startEdit(loan)}
                        style={{ padding: '6px 12px', background: '#fff', color: '#007bff', border: '1px solid #007bff', borderRadius: '4px', marginRight: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '13px' }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(loan.id)}
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
      {/* OVERLAY MODAL: ASSET MANAGEMENT FORM BOX */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1050 }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '460px', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', border: '1px solid #dee2e6', position: 'relative' }}>
            
            {/* Modal Close Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e9ecef', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#212529' }}>
                {editingId ? '📝 Modify Loan Contract Terms' : '💰 Issue New Capital Disbursement'}
              </h3>
              <button 
                onClick={closeAndResetForm}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6c757d', padding: '0 5px' }}
              >
                &times;
              </button>
            </div>

            {/* Input fields form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '500', color: '#495057' }}>Target Applicant Account</label>
                <select
                  value={applicantId}
                  onChange={e => setApplicantId(e.target.value ? Number(e.target.value) : '')}
                  disabled={!!editingId}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #ced4da', borderRadius: '6px', background: editingId ? '#e9ecef' : '#fff', boxSizing: 'border-box' }}
                >
                  <option value="">-- Choose Profile --</option>
                  {applicants.map(app => (
                    <option key={app.id} value={app.id}>
                      {app.full_name} (ID: {app.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '500', color: '#495057' }}>Principal Capital Amount (TZS) *</label>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="e.g. 500,000"
                  required
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #ced4da', borderRadius: '6px', boxSizing: 'border-box' }}
                />
              </div>

              {editingId && (
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '500', color: '#495057' }}>Contract Compliance Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #ced4da', borderRadius: '6px', background: '#fff', boxSizing: 'border-box' }}
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="Approved">Approved</option>
                    <option value="Defaulted">Defaulted</option>
                  </select>
                </div>
              )}

              {/* Form Action Controls */}
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
                  style={{ padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', boxShadow: '0 2px 4px rgba(0,123,255,0.2)' }}
                >
                  {editingId ? 'Commit Modifications' : 'Disburse Assets'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  )
};
