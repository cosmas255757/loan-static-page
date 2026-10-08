import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface LoginProps {
  onSwitchToRegister: () => void;
  onBackToHome: () => void;
  onLoginSuccess?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSwitchToRegister, onBackToHome, onLoginSuccess }) => {
  const { loginUser } = useAuth();
  
  // Local state parameters matching inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    if (!email || !password) {
      setErrorMessage('Please fill in all credential tracking fields.');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await loginUser(email, password);
      
      if (result && result.success) {
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        setErrorMessage(result?.message || 'Invalid credentials.');
      }
    } catch (error) {
      console.error("Authentication crash intercept:", error);
      setErrorMessage('A network server synchronization error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ 
      boxSizing: 'border-box',
      width: '92%',
      maxWidth: '400px', 
      margin: '60px auto', 
      padding: 'max(20px, 3vw)', 
      border: '1px solid #dee2e6', 
      borderRadius: '8px', 
      backgroundColor: '#fff', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)' 
    }}>
      <h2 style={{ marginTop: 0, marginBottom: '20px', textAlign: 'center', color: '#212529', fontSize: '1.6rem', fontWeight: '700' }}>Welcome Back Officer</h2>
      
      {errorMessage && (
        <div style={{ padding: '10px', marginBottom: '15px', color: '#721c24', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '4px', fontSize: '14px', wordBreak: 'break-word' }}>
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
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', width: '100%', boxSizing: 'border-box' }}
            disabled={isSubmitting}
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
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', width: '100%', boxSizing: 'border-box' }}
            disabled={isSubmitting}
            required 
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          style={{ 
            padding: '12px', 
            background: isSubmitting ? '#52a1ff' : '#007bff', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '4px', 
            fontWeight: 'bold', 
            cursor: isSubmitting ? 'not-allowed' : 'pointer', 
            marginTop: '10px', 
            fontSize: '15px',
            width: '100%',
            transition: 'background 0.2s',
            boxSizing: 'border-box'
          }}
        >
          {isSubmitting ? 'Authenticating...' : 'Authenticate Account'}
        </button>
      </form>

      {/* Navigation Helper Space */}
      <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span 
          style={{ 
            color: isSubmitting ? '#6c757d' : '#007bff', 
            cursor: isSubmitting ? 'not-allowed' : 'pointer', 
            textDecoration: 'underline', 
            fontWeight: '500' 
          }} 
          onClick={() => !isSubmitting && onSwitchToRegister()}
        >
          New Officer? Register here
        </span>
        
        <hr style={{ border: 0, borderBottom: '1px solid #dee2e6', margin: '4px 0' }} />
        
        <span 
          style={{ 
            color: '#6c757d', 
            cursor: isSubmitting ? 'not-allowed' : 'pointer', 
            fontSize: '13px', 
            fontWeight: '600', 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }} 
          onClick={() => !isSubmitting && onBackToHome()}
        >
          ← Back to Main Public Page
        </span>
      </div>
    </div>
  );
};
