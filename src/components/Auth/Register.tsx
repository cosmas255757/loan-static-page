import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { type LoanOfficer } from '../../types/loanSystem';

interface RegisterProps {
  onSwitchToLogin: () => void;
  onBackToHome: () => void; // 👈 Safely integrated into your code contract schema
}

export const Register: React.FC<RegisterProps> = ({ onSwitchToLogin, onBackToHome }) => {
  const { registerUser } = useAuth();

  // Local component registration form state parameters
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage('Please completely fill out all required profile information boxes.');
      return;
    }
    // Check if the passwords match
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      return;
    }
    // Prepare type-safe object payloads linked to a unique programmatic tracker ID
    const newOfficerPayload: LoanOfficer & { password?: string } = {
      id: 'off_' + Date.now(),
      name: name,
      email: email,
      password: password
    };

    // Forward package downstream to core state machine context array
    const result = await registerUser(newOfficerPayload);

    if (!result.success) {
      setErrorMessage(result.message || 'Registration failed.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto', padding: '30px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%' }}>
      <h2 style={{ marginTop: 0, marginBottom: '20px', textAlign: 'center' }}>Create Officer Account</h2>
      
      {errorMessage && (
        <div style={{ padding: '10px', marginBottom: '15px', color: '#721c24', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '4px', fontSize: '14px' }}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#495057' }}>Full Name</label>
          <input 
            type="text" 
            placeholder="Officer Captain" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
            required 
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#495057' }}>Work Email Address</label>
          <input 
            type="email" 
            placeholder="captain@company.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
            required 
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#495057' }}>Secure Access Password</label>
          <input 
            type="password" 
            placeholder="Minimum 6 characters" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
            required 
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#495057' }}>Confirm Access Password</label>
          <input 
            type="password" 
            placeholder="Re-enter your password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
            required 
          />
        </div>

        <button 
          type="submit" 
          style={{ padding: '12px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', fontSize: '15px' }}
        >
          Register & Sign In
        </button>
      </form>

      {/* Modern Unified Navigation Helper Area */}
      <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span 
          style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline', fontWeight: '500' }} 
          onClick={onSwitchToLogin}
        >
          Already registered? Log in instead
        </span>
        
        <hr style={{ border: 0, borderBottom: '1px solid #dee2e6', margin: '4px 0' }} />
        
        <span 
          style={{ color: '#6c757d', cursor: 'pointer', fontSize: '13px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} 
          onClick={onBackToHome}
        >
          ← Back to Main Public Page
        </span>
      </div>
    </div>
  );
};
