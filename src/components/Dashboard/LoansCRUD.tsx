import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { type Loan, type Applicant } from '../../types/loanSystem';

export const LoansCRUD: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

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

      // 💡 FIXED: Safely read the array from the backend wrapping envelope { count, loans }
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

  // 🚀 CRASH-PROOF FILTER ENGINE: Prevents undefined toLowerCase loops
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
      resetForm();
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

  const resetForm = () => {
    setEditingId(null);
    setAmount('');
    setStatus('active');
    setApplicantId('');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', padding: '10px' }}>
      
      {/* LEFT: MANAGEMENT CONTROLLER FORM */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
        <h3>{editingId ? 'Modify Loan Terms' : 'Issue New Capital'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '4px' }}>Target Applicant Account</label>
            <select 
              value={applicantId} 
              onChange={e => setApplicantId(e.target.value ? Number(e.target.value) : '')}
              disabled={!!editingId}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: editingId ? '#e9ecef' : '#fff' }}
            >
              <option value="">-- Choose Profile --</option>
              {applicants.map(app => (
                <option key={app.id} value={app.id}>{app.full_name} (ID: {app.id})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px' }}>Principal Capital Amount (\$) *</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>

          {editingId && (
            <div>
              <label style={{ display: 'block', marginBottom: '4px' }}>Contract Compliance Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="Approved">Approved</option>
                <option value="Defaulted">Defaulted</option>
              </select>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="submit" style={{ flex: 1, padding: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              {editingId ? 'Commit Modifications' : 'Disburse Assets'}
            </button>
            {editingId && <button type="button" onClick={resetForm} style={{ padding: '10px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>}
          </div>
        </form>
      </div>

      {/* RIGHT: LEDGER INDEX AND SEARCH INTERFACE */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0 }}>Active Portfolio Loans Ledger</h3>
          <input 
            type="text" 
            placeholder="Search by client or compliance status..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
            style={{ padding: '8px 12px', width: '260px', border: '1px solid #ccc', borderRadius: '4px' }} 
          />
        </div>

        {loading ? (
          <div>Analyzing database records...</div>
        ) : filteredLoans.length === 0 ? (
          <div style={{ color: '#6c757d', textAlign: 'center', padding: '20px' }}>No contractual loan records located.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #dee2e6', background: '#f8f9fa' }}>
                <th style={{ padding: '10px' }}>Contract ID</th>
                <th style={{ padding: '10px' }}>Applicant</th>
                <th style={{ padding: '10px' }}>Issued Value</th>
                <th style={{ padding: '10px' }}>Status</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.map((loan) => (
                <tr key={loan.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '10px', color: '#6c757d' }}>#00{loan.id}</td>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{loan.applicant_name || `Applicant ID: ${loan.applicant_id}`}</td>
                  <td style={{ padding: '10px', color: '#28a745', fontWeight: '500' }}>\${Number(loan.amount).toLocaleString()}</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{
                      padding: '3px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold',
                      background: loan.status === 'Defaulted' ? '#f8d7da' : loan.status === 'active' ? '#cce5ff' : '#e2e3e5',
                      color: loan.status === 'Defaulted' ? '#721c24' : loan.status === 'active' ? '#004085' : '#383d41'
                    }}>
                      {loan.status}
                    </span>
                  </td>
                  <td style={{ padding: '10px', textAlign: 'right', display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                    <button onClick={() => startEdit(loan)} style={{ padding: '4px 8px', background: '#ffc107', color: '#212529', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => handleDelete(loan.id)} style={{ padding: '4px 8px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Delete</button>
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
