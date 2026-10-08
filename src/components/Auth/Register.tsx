import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface RegisterProps {
  onSwitchToLogin: () => void;
  onBackToHome: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onSwitchToLogin, onBackToHome }) => {
  const { registerUser } = useAuth();

  // Local component registration form state parameters
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage('Please completely fill out all required profile information boxes.');
      setIsSubmitting(false);
      return;
    }
    
    // Check if the passwords match
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      setIsSubmitting(false);
      return;
    }

    try {
      // 🌟 PERFECT ALIGNMENT WITH CONTROLLER: Send full_name inside the JSON package
      const registrationPayload = {
        full_name: name,
        email: email,
        password: password
      };

      // Forward package downstream to core auth context array
      const result = await registerUser(registrationPayload as any);

      if (!result.success) {
        setErrorMessage(result.message || 'Registration failed.');
      }
    } catch (error) {
      console.error("Registration crash intercept:", error);
      setErrorMessage('A database network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ 
      boxSizing: 'border-box',
      width: '92%', 
      maxWidth: '400px', 
      margin: '40px auto', 
      padding: 'max(20px, 3vw)', 
      border: '1px solid #dee2e6', 
      borderRadius: '8px', 
      backgroundColor: '#fff', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
    }}>
      <h2 style={{ marginTop: 0, marginBottom: '20px', textAlign: 'center', color: '#212529', fontSize: '1.6rem', fontWeight: '700' }}>Create Officer Account</h2>
      
      {errorMessage && (
        <div style={{ padding: '10px', marginBottom: '15px', color: '#721c24', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '4px', fontSize: '14px', wordBreak: 'break-word' }}>
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
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', width: '100%', boxSizing: 'border-box' }}
            disabled={isSubmitting}
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
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', width: '100%', boxSizing: 'border-box' }}
            disabled={isSubmitting}
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
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', width: '100%', boxSizing: 'border-box' }}
            disabled={isSubmitting}
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
            background: isSubmitting ? '#7cb98a' : '#28a745', 
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
          {isSubmitting ? 'Creating Account...' : 'Register & Sign In'}
        </button>
      </form>

      {/* Navigation Helper Area */}
      <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span 
          style={{ 
            color: isSubmitting ? '#6c757d' : '#007bff', 
            cursor: isSubmitting ? 'not-allowed' : 'pointer', 
            textDecoration: 'underline', 
            fontWeight: '500' 
          }} 
          onClick={() => !isSubmitting && onSwitchToLogin()}
        >
          Already registered? Log in instead
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
