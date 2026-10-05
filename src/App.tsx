import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import { ApplicantsCRUD } from './components/Dashboard/ApplicantsCRUD';
import { LoansCRUD } from './components/Dashboard/LoansCRUD';
import { RepaymentsCRUD } from './components/Dashboard/RepaymentsCRUD';
import { apiService } from './services/api';

// Internal Extended Dashboard Metrics Schema (Matches Backend Controller Shape)
interface AdvancedDashboardStats {
  box1: {
    totalApplicants: number;
    activeLoans: number;
    overdueApplicants: number;
    overduePercentage: number;
  };
  box2: { today: number; week: number; month: number; year: number; };
  box3: { today: number; week: number; month: number; year: number; };
  box4: {
    collectionRate: number;
    outstandingRate: number;
    totalLoaned: number;
    totalCollected: number;
  };
}

export const MainDashboardLayout: React.FC = () => {
  const { currentUser, logoutUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'applicants' | 'loans' | 'repayments'>('dashboard');
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);

  // Initialize with proper defaults so it never renders 'undefined' values
  const [metrics, setMetrics] = useState<AdvancedDashboardStats>({
    box1: { totalApplicants: 0, activeLoans: 0, overdueApplicants: 0, overduePercentage: 0 },
    box2: { today: 0, week: 0, month: 0, year: 0 },
    box3: { today: 0, week: 0, month: 0, year: 0 },
    box4: { collectionRate: 0, outstandingRate: 0, totalLoaned: 0, totalCollected: 0 },
  });

  // 🚀 CLEAN & BULLETPROOF METRICS: Directly consumes pre-calculated server variables
   const evaluateMetrics = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const response = await apiService.getDashboardMetrics();
      
      // 🚀 FIXED: Directly verify and use the flat DashboardStats object
      if (response) {
        setMetrics({
          box1: {
            totalApplicants: response.totalApplicants || 0,
            activeLoans: response.totalLoansIssued || 0,
            overdueApplicants: 0,
            overduePercentage: 0
          },
          box2: { today: 0, week: 0, month: 0, year: response.totalVolume || 0 },
          box3: { today: 0, week: 0, month: 0, year: response.totalCollected || 0 },
          box4: {
            collectionRate: 0,
            outstandingRate: 0,
            totalLoaned: response.totalVolume || 0,
            totalCollected: response.pendingCollections || 0
          }
        });
      }
    } catch (err) {
      console.error("Failed syncing aggregated metrics payload:", err);
    } finally {
      setLoading(false);
    }
  };


  // ⚡ Runs only when mounting or when user session shifts
  useEffect(() => {
    if (currentUser) evaluateMetrics();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f4f6f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {authView === 'login' ? (
          <Login onSwitchToRegister={() => setAuthView('register')} />
        ) : (
          <Register onSwitchToLogin={() => setAuthView('login')} />
        )}
      </div>
    );
  }

  // Handle workspace components conditionally
  const renderTabContent = () => {
    switch (activeTab) {
      case 'applicants':
        return <ApplicantsCRUD />;
      case 'loans':
        return <LoansCRUD />;
      case 'repayments':
        return <RepaymentsCRUD />;
      case 'dashboard':
      default:
        return (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* --- METRIC GRID CONTAINERS --- */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              
              <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #dee2e6' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#6c757d' }}>Total Portfolio</h4>
                <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{metrics.box1.activeLoans} Active Loans</p>
                <small style={{ color: '#6c757d' }}>Total Applicants: {metrics.box1.totalApplicants}</small>
              </div>

              <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #dee2e6' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#6c757d' }}>Disbursed (Today)</h4>
                <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>${metrics.box2.today.toLocaleString()}</p>
                <small style={{ color: '#28a745' }}>This Month: ${metrics.box2.month.toLocaleString()}</small>
              </div>

              <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #dee2e6' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#6c757d' }}>Collections (Today)</h4>
                <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>${metrics.box3.today.toLocaleString()}</p>
                <small style={{ color: '#007bff' }}>This Month: ${metrics.box3.month.toLocaleString()}</small>
              </div>

              <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #dee2e6' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#6c757d' }}>Outstanding Exposure</h4>
                <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>${metrics.box4.totalCollected.toLocaleString()}</p>
                <small style={{ color: '#6c757d' }}>Total Balance Remaining</small>
              </div>

            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ backgroundColor: '#fff', borderBottom: '1px solid #dee2e6', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0 }}>Loan Officer Portal</h2>
          <small>Active Account: <strong>{currentUser.name}</strong></small>
        </div>
        <nav style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setActiveTab('dashboard')} style={{ padding: '8px 14px', backgroundColor: activeTab === 'dashboard' ? '#007bff' : '#f8f9fa', color: activeTab === 'dashboard' ? '#fff' : '#333', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>Dashboard</button>
          <button onClick={() => setActiveTab('applicants')} style={{ padding: '8px 14px', backgroundColor: activeTab === 'applicants' ? '#007bff' : '#f8f9fa', color: activeTab === 'applicants' ? '#fff' : '#333', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>User Management</button>
          <button onClick={() => setActiveTab('loans')} style={{ padding: '8px 14px', backgroundColor: activeTab === 'loans' ? '#007bff' : '#f8f9fa', color: activeTab === 'loans' ? '#fff' : '#333', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>Loans</button>
          <button onClick={() => setActiveTab('repayments')} style={{ padding: '8px 14px', backgroundColor: activeTab === 'repayments' ? '#007bff' : '#f8f9fa', color: activeTab === 'repayments' ? '#fff' : '#333', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>Repayments</button>
          <button onClick={logoutUser} style={{ padding: '8px 14px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px' }}>Logout</button>
        </nav>
      </header>

      <main style={{ padding: '20px' }}>
        {loading && activeTab === 'dashboard' ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>Syncing server infrastructure data...</div>
        ) : (
          renderTabContent()
        )}
      </main>
    </div>
  );
};
