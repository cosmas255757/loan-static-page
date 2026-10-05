import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import {type Applicant } from '../../types/loanSystem';

export const ApplicantsCRUD: React.FC = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
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

  // 🚀 CRASH-PROOF FILTERING ENGINE: Will never drop execution loops
  const filteredApplicants = applicants.filter((applicant) => {
    // Safely look at full_name with string fallback if row properties are null
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
      resetForm();
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

  const resetForm = () => {
    setEditingId(null);
    setFullName('');
    setPhone('');
    setLocation('');
    setOccupation('');
    setSex('Male');
    setRelStatus('Single');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', padding: '10px' }}>
      
      {/* LEFT: MANAGEMENT PERSISTENCE FORM */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
        <h3>{editingId ? 'Modify Applicant' : 'Register New Applicant'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px' }}>Full Name *</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px' }}>Phone Number *</label>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px' }}>Residential Location</label>
            <input type="text" value={location} onChange={e => setLocation(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px' }}>Occupation</label>
            <input type="text" value={occupation} onChange={e => setOccupation(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px' }}>Sex</label>
              <select value={sex} onChange={e => setSex(e.target.value as any)} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px' }}>Marital Status</label>
              <select value={relStatus} onChange={e => setRelStatus(e.target.value as any)} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="submit" style={{ flex: 1, padding: '10px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              {editingId ? 'Update Record' : 'Save Entry'}
            </button>
            {editingId && <button type="button" onClick={resetForm} style={{ padding: '10px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>}
          </div>
        </form>
      </div>

      {/* RIGHT: LEDGER INDEX AND SEARCH INTERFACE */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0 }}>Registered Applicants Ledger</h3>
          <input 
            type="text" 
            placeholder="Search by name or contact..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
            style={{ padding: '8px 12px', width: '250px', border: '1px solid #ccc', borderRadius: '4px' }} 
          />
        </div>

        {loading ? (
          <div>Loading list data...</div>
        ) : filteredApplicants.length === 0 ? (
          <div style={{ color: '#6c757d', textAlign: 'center', padding: '20px' }}>No matching application entries detected.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #dee2e6', background: '#f8f9fa' }}>
                <th style={{ padding: '10px' }}>Name</th>
                <th style={{ padding: '10px' }}>Contact</th>
                <th style={{ padding: '10px' }}>Location</th>
                <th style={{ padding: '10px' }}>Demographics</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplicants.map((applicant) => (
                <tr key={applicant.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{applicant.full_name}</td>
                  <td style={{ padding: '10px' }}>{applicant.phone}</td>
                  <td style={{ padding: '10px' }}>{applicant.living_location || '—'}</td>
                  <td style={{ padding: '10px', fontSize: '13px' }}>
                    {applicant.sex} • {applicant.relationship_status}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'right', display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                    <button onClick={() => startEdit(applicant)} style={{ padding: '4px 8px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => handleDelete(applicant.id)} style={{ padding: '4px 8px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Delete</button>
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
