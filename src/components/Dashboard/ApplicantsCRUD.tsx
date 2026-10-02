import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { apiService } from '../../services/api';
import { type Applicant } from '../../types/loanSystem';

export const ApplicantsCRUD: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Component states
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [searchTerm, setSearchTerm] = useState(''); 

  // Isolated form input state trackers
  const [formId, setFormId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [livingLocation, setLivingLocation] = useState('');
  const [occupation, setOccupation] = useState('');
  const [sex, setSex] = useState<Applicant['sex']>('Male');
  const [relationStatus, setRelationStatus] = useState<Applicant['relationStatus']>('Single');

  // Fetch only applicants registered by this loan officer
  const loadApplicants = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await apiService.getApplicants();
      setApplicants(data);
    } catch (error) {
      console.error('Failed to load applicant profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplicants();
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser || !name || !email) return;

    const payload: Applicant = {
      id: isEditing ? formId : 'app_' + Date.now(),
      officerId: currentUser.id,
      name,
      email,
      phone,
      livingLocation,
      occupation,
      sex,
      relationStatus,
      createdAt: isEditing 
        ? applicants.find(a => a.id === formId)?.createdAt || new Date().toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0]
    };

    setLoading(true);
    try {
      await apiService.saveApplicant (payload, isEditing);
      resetForm();
      await loadApplicants();
    } catch (error) {
      console.error('Failed to save applicant:', error);
      setLoading(false);
    }
  };

  const handleEditInit = (applicant: Applicant) => {
    setIsEditing(true);
    setFormId(applicant.id);
    setName(applicant.name);
    setEmail(applicant.email);
    setPhone(applicant.phone);
    setLivingLocation(applicant.livingLocation || '');
    setOccupation(applicant.occupation || '');
    setSex(applicant.sex || 'Male');
    setRelationStatus(applicant.relationStatus || 'Single');
    setIsModalOpen(true); 
  };

  const handleDelete = async (id: string) => {
    if (!currentUser || !window.confirm('Are you sure you want to completely remove this applicant profile?')) return;
    setLoading(true);
    try {
      await apiService.deleteApplicant(id);
      await loadApplicants();
    } catch (error) {
      console.error('Failed to purge applicant profile:', error);
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setFormId('');
    setName('');
    setEmail('');
    setPhone('');
    setLivingLocation('');
    setOccupation('');
    setSex('Male');
    setRelationStatus('Single');
    setIsModalOpen(false); 
  };

  const filteredApplicants = applicants.filter(applicant => 
    applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    applicant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Common label style for the form inside the modal
  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#333'
  };

  // Common input style for the form inside the modal
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginBottom: '15px',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '6px', border: '1px solid #ddd', position: 'relative' }}>
      
      {/* Top Controls Search & Add Actions Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Search applicants by name or email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: '400px', padding: '10px 14px', border: '1px solid #ccc', borderRadius: '4px', margin: 0 }}
        />
        
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          style={{ padding: '10px 18px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <span style={{ fontSize: '18px', lineHeight: '0' }}>+</span> Add Applicant
        </button>
      </div>

      <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#333' }}>Registered Applicants Registry</h3>

      {/* Profile Table Layout Display */}
      {loading && filteredApplicants.length === 0 ? (
        <p>Syncing registry details...</p>
      ) : filteredApplicants.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          {searchTerm ? 'No results match your search parameters.' : 'No applicants added yet. Click the + button above to register profiles.'}
        </p>
      ) : (
        <table className="table-container" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f1f1f1', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '12px 10px' }}>Full Name / Email</th>
              <th style={{ padding: '12px 10px' }}>Phone Number</th>
              <th style={{ padding: '12px 10px' }}>Location</th>
              <th style={{ padding: '12px 10px' }}>Occupation</th>
              <th style={{ padding: '12px 10px' }}>Sex</th>
              <th style={{ padding: '12px 10px' }}>Relation Status</th>
              <th style={{ padding: '12px 10px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplicants.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px 10px', fontWeight: '500', color: '#007bff' }}>
                  {item.name}
                  <div style={{ fontSize: '12px', color: '#666', fontWeight: 'normal' }}>{item.email}</div>
                </td>
                <td style={{ padding: '12px 10px' }}>{item.phone}</td>
                <td style={{ padding: '12px 10px' }}>{item.livingLocation}</td>
                <td style={{ padding: '12px 10px' }}>{item.occupation}</td>
                <td style={{ padding: '12px 10px' }}><span style={{ textTransform: 'capitalize' }}>{item.sex}</span></td>
                <td style={{ padding: '12px 10px' }}><span style={{ textTransform: 'capitalize' }}>{item.relationStatus}</span></td>
                <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                  <button onClick={() => handleEditInit(item)} style={{ marginRight: '6px', padding: '5px 10px', background: '#ffc107', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>Edit</button>
                  <button onClick={() => handleDelete(item.id)} style={{ padding: '5px 10px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ==========================================================================
         EXPANDED MODAL OVERLAY POPUP LAYER
         ========================================================================== */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h4 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              {isEditing ? 'Modify Applicant Profile' : 'Register New Applicant'}
            </h4>
            
            <form onSubmit={handleSubmit}>
              <label style={labelStyle}>Full Name *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />

              <label style={labelStyle}>Email Address *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />

              <label style={labelStyle}>Phone Number</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />

              <label style={labelStyle}>Living Location</label>
              <input type="text" value={livingLocation} onChange={(e) => setLivingLocation(e.target.value)} style={inputStyle} />

              <label style={labelStyle}>Occupation</label>
              <input type="text" value={occupation} onChange={(e) => setOccupation(e.target.value)} style={inputStyle} />

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Sex</label>   
                    <select value={sex} onChange={(e) => setSex(e.target.value as Applicant['sex'])} style={inputStyle}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Relation Status</label>
                    <select value={relationStatus} onChange={(e) => setRelationStatus(e.target.value as Applicant['relationStatus'])} style={inputStyle}>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                    </select>
                </div>
              </div>    

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>   
                    <button type="button" onClick={resetForm} style={{ padding: '8px 14px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>

                    <button type="submit" style={{ padding: '8px 14px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>{isEditing ? 'Update Profile' : 'Add Applicant'}</button>
                </div>
            </form> 
            </div>
        </div>
      )}
    </div>
  );
}