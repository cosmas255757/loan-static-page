import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { type Applicant } from '../../types/loanSystem';

export const ApplicantsCRUD: React.FC = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Modal toggle state
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form States
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [occupation, setOccupation] = useState('');
  const [sex, setSex] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [relStatus, setRelStatus] = useState<'Single' | 'Married' | 'Divorced' | 'Widowed'>('Single');
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const data = await apiService.getApplicants();
      setApplicants(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed fetching client ledger:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  // CRASH-PROOF FILTERING ENGINE
  const filteredApplicants = applicants.filter((applicant) => {
    const nameTarget = applicant?.full_name || '';
    const phoneTarget = applicant?.phone || '';
    const cleanSearch = searchTerm.toLowerCase();

    return (
      nameTarget.toLowerCase().includes(cleanSearch) ||
      phoneTarget.toLowerCase().includes(cleanSearch)
    );
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return alert('Full Name and Phone are required.');

    const payload = {
      full_name: fullName,
      phone,
      living_location: location,
      occupation,
      sex,
      relationship_status: relStatus
    };

    try {
      if (editingId) {
        await apiService.updateApplicant(editingId, payload);
        alert('Applicant record modified successfully.');
      } else {
        await apiService.createApplicant(payload);
        alert('New applicant entry recorded.');
      }
      closeAndResetForm();
      fetchApplicants();
    } catch (err) {
      console.error("Persistence write failed:", err);
    }
  };

  const startEdit = (applicant: Applicant) => {
    setEditingId(applicant.id);
    setFullName(applicant.full_name || '');
    setPhone(applicant.phone || '');
    setLocation(applicant.living_location || '');
    setOccupation(applicant.occupation || '');
    setSex(applicant.sex || 'Male');
    setRelStatus(applicant.relationship_status || 'Single');
    setIsModalOpen(true); // Pop open the registration box overlay on edit execution
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to drop this record?")) return;
    try {
      await apiService.deleteApplicant(id);
      fetchApplicants();
    } catch (err) {
      console.error("Drop sequence failed:", err);
    }
  };

  const closeAndResetForm = () => {
    setEditingId(null);
    setFullName('');
    setPhone('');
    setLocation('');
    setOccupation('');
    setSex('Male');
    setRelStatus('Single');
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      
      {/* HEADER CONTROLS VIEWPORT */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '20px', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ margin: 0, color: '#212529' }}>Registered Applicants Ledger</h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6c757d' }}>Manage and monitor verified system client profiles</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Search by name or contact..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
            style={{ padding: '10px 14px', width: '280px', border: '1px solid #ced4da', borderRadius: '6px', fontSize: '14px' }} 
          />
          <button 
            onClick={() => setIsModalOpen(true)}
            style={{ padding: '10px 16px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 4px rgba(0,123,255,0.15)' }}
          >
            + Register Applicant
          </button>
        </div>
      </div>

      {/* FULL WIDTH LEDGER WORKSPACE TABLE */}
      <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #dee2e6', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#007bff' }}>Loading ledger database content...</div>
        ) : filteredApplicants.length === 0 ? (
          <div style={{ color: '#6c757d', textAlign: 'center', padding: '40px', fontSize: '15px' }}>No matching application entries detected in the database core.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #dee2e6', background: '#f8f9fa', color: '#495057' }}>
                  <th style={{ padding: '14px 16px', fontWeight: '600' }}>Full Name</th>
                  <th style={{ padding: '14px 16px', fontWeight: '600' }}>Phone Number</th>
                  <th style={{ padding: '14px 16px', fontWeight: '600' }}>Location</th>
                  <th style={{ padding: '14px 16px', fontWeight: '600' }}>Occupation</th>
                  <th style={{ padding: '14px 16px', fontWeight: '600' }}>Demographics</th>
                  <th style={{ padding: '14px 16px', fontWeight: '600', textAlign: 'right' }}>Actions Workspace</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplicants.map((applicant) => (
                  <tr key={applicant.id} style={{ borderBottom: '1px solid #eee', transition: 'background 0.15s' }}>
                    <td style={{ padding: '14px 16px', fontWeight: '500', color: '#212529' }}>{applicant.full_name}</td>
                    <td style={{ padding: '14px 16px', color: '#495057' }}>{applicant.phone}</td>
                    <td style={{ padding: '14px 16px', color: '#6c757d' }}>{applicant.living_location || '—'}</td>
                    <td style={{ padding: '14px 16px', color: '#6c757d' }}>{applicant.occupation || '—'}</td>
                    <td style={{ padding: '14px 16px', color: '#495057' }}>
                      <span style={{ background: '#f1f3f5', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', marginRight: '6px' }}>{applicant.sex}</span>
                      <span style={{ background: '#e8f0fe', color: '#1a73e8', padding: '3px 8px', borderRadius: '4px', fontSize: '12px' }}>{applicant.relationship_status}</span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <button 
                        onClick={() => startEdit(applicant)}
                        style={{ padding: '6px 12px', background: '#fff', color: '#007bff', border: '1px solid #007bff', borderRadius: '4px', marginRight: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '13px' }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(applicant.id)}
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

      {/* OVERLAY MODAL: REGISTRATION & EDITING BOX */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1050 }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '500px', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', border: '1px solid #dee2e6', position: 'relative', animation: 'fadeIn 0.2s ease-out' }}>
            
            {/* Modal Close Icon Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e9ecef', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#212529' }}>
                {editingId ? '📝 Modify Applicant Ledger Record' : '👤 Register New System Applicant'}
              </h3>
              <button 
                onClick={closeAndResetForm}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6c757d', padding: '0 5px' }}
              >
                &times;
              </button>
            </div>

            {/* Persistence Operations Input Subsystem */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '500', color: '#495057' }}>Full Name *</label>
                <input 
                  type="text" 
                  value={fullName} 
                  onChange={e => setFullName(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #ced4da', borderRadius: '6px', boxSizing: 'border-box' }} 
                  placeholder="John Doe" 
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '500', color: '#495057' }}>Phone Number *</label>
                <input 
                  type="text" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #ced4da', borderRadius: '6px', boxSizing: 'border-box' }} 
                  placeholder="e.g. +255..." 
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '500', color: '#495057' }}>Residential Location</label>
                <input 
                  type="text" 
                  value={location} 
                  onChange={e => setLocation(e.target.value)} 
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #ced4da', borderRadius: '6px', boxSizing: 'border-box' }} 
                  placeholder="Dar es Salaam, Upanga" 
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '500', color: '#495057' }}>Occupation</label>
                <input 
                  type="text" 
                  value={occupation} 
                  onChange={e => setOccupation(e.target.value)} 
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #ced4da', borderRadius: '6px', boxSizing: 'border-box' }} 
                  placeholder="Business Operator" 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '500', color: '#495057' }}>Sex</label>
                  <select 
                    value={sex} 
                    onChange={e => setSex(e.target.value as any)} 
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #ced4da', borderRadius: '6px', background: '#fff' }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '500', color: '#495057' }}>Marital Status</label>
                  <select 
                    value={relStatus} 
                    onChange={e => setRelStatus(e.target.value as any)} 
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #ced4da', borderRadius: '6px', background: '#fff' }}
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
              </div>

              {/* Action Operations Control Panel */}
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
                  {editingId ? 'Save Changes' : 'Record Entry'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
</div>
  );
}