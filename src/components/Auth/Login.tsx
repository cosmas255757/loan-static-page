import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

// Clean, single TypeScript contract configuration
interface LoginProps {
  onSwitchToRegister: () => void;
  onBackToHome: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSwitchToRegister, onBackToHome }) => {
  const { loginUser } = useAuth();
  
  // Local state buffers for handling inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please fill in all credential tracking fields.');
      return;
    }

    // Call the context layer to authenticate credentials
    const result = await loginUser(email, password);
    
    if (!result.success) {
      setErrorMessage(result.message || 'Invalid credentials.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto', padding: '30px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%' }}>
      <h2 style={{ marginTop: 0, marginBottom: '20px', textAlign: 'center', color: '#212529' }}>Welcome Back Officer</h2>
      
      {errorMessage && (
        <div style={{ padding: '10px', marginBottom: '15px', color: '#721c24', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '4px', fontSize: '14px' }}>
          {errorMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#495057' }}>Officer Email</label>
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
          <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#495057' }}>Access Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
            required 
          />
        </div>

        <button 
          type="submit" 
          style={{ padding: '12px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', fontSize: '15px' }}
        >
          Authenticate Account
        </button>
      </form>

      {/* Navigation Helper Space */}
      <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span 
          style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline', fontWeight: '500' }} 
          onClick={onSwitchToRegister}
        >
          New Officer? Register here
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
