import { useState,  } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {type LoanOfficer } from '../../types/loanSystem';

interface RegisterProps {
  onSwitchToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onSwitchToLogin }) => {
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
    <div style={{ maxWidth: '400px', margin: '60px auto', padding: '30px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff' }}>
      <h2 style={{ marginTop: 0, marginBottom: '20px', textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}>Create Officer Account</h2>
      
      {errorMessage && (
        <div style={{ padding: '10px', marginBottom: '15px', color: '#721c24', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '4px' }}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Full Name</label>
          <input 
            type="text" 
            placeholder="Officer Captain" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            required 
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Work Email Address</label>
          <input 
            type="email" 
            placeholder="captain@company.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            required 
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Secure Access Password</label>
          <input 
            type="password" 
            placeholder="Minimum 6 characters" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            required 
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Confirm Access Password</label>
        <input 
            type="password" 
            placeholder="Re-enter your password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            required 
        />
        </div>
        <button 
          type="submit" 
          style={{ padding: '12px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
        >
          Register & Sign In
        </button>
      </form>

      <div style={{marginTop: '20px', textAlign: 'center' }}>
        <button 
          onClick={onSwitchToLogin} 
          style={{ background: 'none', border: 'none', color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}
        >
          Already registered? Log in instead
        </button>
      </div>
    </div>
  );
};

