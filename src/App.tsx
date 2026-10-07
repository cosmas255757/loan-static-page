import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import { ApplicantsCRUD } from './components/Dashboard/ApplicantsCRUD';
import { LoansCRUD } from './components/Dashboard/LoansCRUD';
import { RepaymentsCRUD } from './components/Dashboard/RepaymentsCRUD';
import { apiService } from './services/api';

// Internal Extended Dashboard Metrics Schema (Matches Backend Postgres Stats Output Exactly)
interface AdvancedDashboardStats {
  loaned_this_year: number;
  loaned_this_month: number;
  loaned_this_week: number;
  loaned_today: number;
  collected_this_year: number;
  collected_this_month: number;
  collected_today: number;
  collected_this_week: number;
  total_applicants: number;
  pending_loans_count: number;
  active_loans_count: number;
  total_outstanding_balance: number;
}

export const MainDashboardLayout: React.FC = () => {
  const { currentUser, logoutUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'applicants' | 'loans' | 'repayments'>('dashboard');
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);

  // Initialize state with flawless schema structures
  const [metrics, setMetrics] = useState<AdvancedDashboardStats>({
    loaned_this_year: 0,
    loaned_this_month: 0,
    loaned_this_week: 0,
    loaned_today: 0,
    collected_this_year: 0,
    collected_this_month: 0,
    collected_today: 0,
    collected_this_week: 0,
    total_applicants: 0,
    pending_loans_count: 0,
    active_loans_count: 0,
    total_outstanding_balance: 0
  });

  // RAPID METRICS EVALUATION: Directly maps the optimized server data payload
  const evaluateMetrics = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      // 1. Fetch response from apiService
      const response = await apiService.getDashboardMetrics() as any;
      
      // 2. Safely extract the inner data object returned by your controller
      const serverData = response?.data;
      
      if (serverData) {
        setMetrics({
          loaned_this_year: Number(serverData.loaned_this_year) || 0,
          loaned_this_month: Number(serverData.loaned_this_month) || 0,
          loaned_this_week: Number(serverData.loaned_this_week) || 0,
          loaned_today: Number(serverData.loaned_today) || 0,
          collected_this_year: Number(serverData.collected_this_year) || 0,
          collected_this_month: Number(serverData.collected_this_month) || 0,
          collected_today: Number(serverData.collected_today) || 0,
          collected_this_week: Number(serverData.collected_this_week) || 0,
          total_applicants: Number(serverData.total_applicants) || 0,
          pending_loans_count: Number(serverData.pending_loans_count) || 0,
          active_loans_count: Number(serverData.active_loans_count) || 0,
          total_outstanding_balance: Number(serverData.total_outstanding_balance) || 0
        });
      }
    } catch (err) {
      console.error("Dashboard database metrics synchronization failure:", err);
    } finally {
      setLoading(false);
    }
  };


  // ⚡ Runs only when mounting or when user session logs in
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

  // Handle dashboard sub-tabs workspace conditionally
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
            
            {/* --- 4 BOX METRIC DISPLAY GRID --- */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              
              {/* 📦 BOX 1: APPLICANTS DATA OVERVIEW */}
                            {/* 📦 BOX 1: APPLICANTS DATA OVERVIEW */}
              <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #dee2e6' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#495057', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Applicants Ledger</h4>
                <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#212529' }}>{metrics.total_applicants.toLocaleString()}</p>
                <div style={{ marginTop: '10px', fontSize: '13px', color: '#495057', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>Active Loans: <strong>{metrics.active_loans_count}</strong></div>
                  <div>Pending Contracts: <strong>{metrics.pending_loans_count}</strong></div>
                  <div style={{ borderTop: '1px solid #f1f3f5', marginTop: '4px', paddingTop: '4px', color: '#6c757d' }}>
                    Outstanding: <strong>TZS {metrics.total_outstanding_balance.toLocaleString()}</strong>
                  </div>
                </div>
              </div>


              {/* 📦 BOX 2: LOANS VOLUME AND CONTRACT STATS */}
                <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #dee2e6' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#007bff', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Loan Issuance
                  </h4>
                  <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#007bff' }}>
                    TZS {metrics.loaned_today.toLocaleString()}
                  </p>
                  <div style={{ marginTop: '10px', fontSize: '13px', color: '#495057', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div>This Week: <strong>TZS {metrics.loaned_this_week.toLocaleString()}</strong></div>
                    <div>This Month: <strong>TZS {metrics.loaned_this_month.toLocaleString()}</strong></div>
                    <div style={{ borderTop: '1px solid #f1f3f5', marginTop: '4px', paddingTop: '4px', color: '#6c757d' }}>
                      {metrics.active_loans_count} Active • {metrics.pending_loans_count} Pending Contracts
                    </div>
                  </div>
                </div>

              {/* 📦 BOX 3: REPAYMENTS AND PORTFOLIO COLLECTIONS */}
              <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #dee2e6' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#28a745', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Collections Activity</h4>
                <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#28a745' }}>TZS {metrics.collected_today.toLocaleString()}</p>
                <div style={{ marginTop: '10px', fontSize: '13px', color: '#495057', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>This Week: <strong>TZS {metrics.collected_this_week.toLocaleString()}</strong></div>
                  <div>This Month: <strong>TZS {metrics.collected_this_month.toLocaleString()}</strong></div>
                  <div>This Year: <strong>TZS {metrics.collected_this_year.toLocaleString()}</strong></div>
                </div>
              </div>

              {/* 📦 BOX 4: ACTIVE OUTSTANDING EXPOSURE BALANCE */}
              <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #dee2e6' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#dc3545', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Outstanding Exposure</h4>
                <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#dc3545' }}>TZS {metrics.total_outstanding_balance.toLocaleString()}</p>
                <div style={{ marginTop: '10px', fontSize: '13px', color: '#6c757d' }}>
                  <span>Total Capital Out in the Field</span>
                </div>
              </div>
              {/* 📦 BOX 5: PROJECTED PROFIT (20% OF TOTAL OUTSTANDING BALANCE) */}
              <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #dee2e6' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#17a2b8', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Projected Profit (20%)</h4>
                <div style={{ marginTop: '10px', fontSize: '13px', color: '#495057', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>From This Month: <strong>TZS {(metrics.loaned_this_month * 0.2).toLocaleString()}</strong></div>
                  <div>From This Week: <strong>TZS {(metrics.loaned_this_week * 0.2).toLocaleString()}</strong></div>
                  <div style={{ borderTop: '1px solid #f1f3f5', marginTop: '4px', paddingTop: '4px', color: '#6c757d' }}>
                    Based on 20% yield of active outstanding exposure
                  </div>
                </div>
              </div>

            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', fontFamily: 'Arial, sans-serif', position: 'relative' }}>
      {/* Global CSS Injector to handle pure responsive display rules */}
      <style>{`
        /* Desktop Defaults */
        .desktop-nav { display: flex !important; }
        .mobile-hamburger { display: none !important; }
        .mobile-dropdown { display: none !important; }

        /* Mobile Screens (Phones and Tablets) */
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-hamburger { display: flex !important; }
          .mobile-dropdown { display: ${isMenuOpen ? 'flex' : 'none'} !important; }
        }
      `}</style>

      <header style={{ 
        backgroundColor: '#fff', 
        borderBottom: '1px solid #dee2e6', 
        padding: '12px 20px', 
        display: 'flex', 
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: 'center',
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ flexShrink: 0 }}>
          <h2 style={{ margin: 0, fontSize: '1.3rem', whiteSpace: 'nowrap' }}>Loan Officer Portal</h2>
          <small style={{ fontSize: '0.85rem', display: 'block' }}>Active Account: <strong>{currentUser.name}</strong></small>
        </div>

        {/* 1. COMPUTER NAVIGATION (Hidden on mobile) */}
        <nav className="desktop-nav" style={{ 
          alignItems: 'center',
          gap: '8px', 
          flexWrap: 'nowrap'
        }}>
          <button onClick={() => setActiveTab('dashboard')} style={{ padding: '8px 14px', backgroundColor: activeTab === 'dashboard' ? '#007bff' : '#f8f9fa', color: activeTab === 'dashboard' ? '#fff' : '#333', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap' }}>Dashboard</button>
          <button onClick={() => setActiveTab('applicants')} style={{ padding: '8px 14px', backgroundColor: activeTab === 'applicants' ? '#007bff' : '#f8f9fa', color: activeTab === 'applicants' ? '#fff' : '#333', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap' }}>User Management</button>
          <button onClick={() => setActiveTab('loans')} style={{ padding: '8px 14px', backgroundColor: activeTab === 'loans' ? '#007bff' : '#f8f9fa', color: activeTab === 'loans' ? '#fff' : '#333', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap' }}>Loans</button>
          <button onClick={() => setActiveTab('repayments')} style={{ padding: '8px 14px', backgroundColor: activeTab === 'repayments' ? '#007bff' : '#f8f9fa', color: activeTab === 'repayments' ? '#fff' : '#333', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap' }}>Repayments</button>
          <button onClick={logoutUser} style={{ padding: '8px 14px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap' }}>Logout</button>
        </nav>

        {/* 2. THREE LINES HAMBURGER BUTTON (Hidden on computer) */}
        <button 
          className="mobile-hamburger" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '24px',
            height: '18px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            boxSizing: 'border-box'
          }}
        >
          <span style={{ width: '100%', height: '3px', backgroundColor: '#333', borderRadius: '2px' }}></span>
          <span style={{ width: '100%', height: '3px', backgroundColor: '#333', borderRadius: '2px' }}></span>
          <span style={{ width: '100%', height: '3px', backgroundColor: '#333', borderRadius: '2px' }}></span>
        </button>
      </header>

      {/* 3. MOBILE MENU DROPDOWN (Pops open on mobile when three lines are clicked) */}
      <nav className="mobile-dropdown" style={{
        position: 'absolute',
        top: '70px', 
        right: 0,
        width: '50%',
        backgroundColor: 'transparent',
        borderBottom: '1px solid #dee2e6',
        flexDirection: 'column',
        padding: '10px 20px',
        gap: '10px',
        boxSizing: 'border-box',
        zIndex: 5,
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.05)'
      }}>
        <button onClick={() => { setActiveTab('dashboard'); setIsMenuOpen(false); }} style={{ padding: '10px', backgroundColor: activeTab === 'dashboard' ? '#007bff' : '#f8f9fa', color: activeTab === 'dashboard' ? '#fff' : '#333', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', width: '100%', textAlign: 'left' }}>Dashboard</button>
        <button onClick={() => { setActiveTab('applicants'); setIsMenuOpen(false); }} style={{ padding: '10px', backgroundColor: activeTab === 'applicants' ? '#007bff' : '#f8f9fa', color: activeTab === 'applicants' ? '#fff' : '#333', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', width: '100%', textAlign: 'left' }}>User Management</button>
        <button onClick={() => { setActiveTab('loans'); setIsMenuOpen(false); }} style={{ padding: '10px', backgroundColor: activeTab === 'loans' ? '#007bff' : '#f8f9fa', color: activeTab === 'loans' ? '#fff' : '#333', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', width: '100%', textAlign: 'left' }}>Loans</button>
        <button onClick={() => { setActiveTab('repayments'); setIsMenuOpen(false); }} style={{ padding: '10px', backgroundColor: activeTab === 'repayments' ? '#007bff' : '#f8f9fa', color: activeTab === 'repayments' ? '#fff' : '#333', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', width: '100%', textAlign: 'left' }}>Repayments</button>
        <button onClick={() => { logoutUser(); setIsMenuOpen(false); }} style={{ padding: '10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%', textAlign: 'left' }}>Logout</button>
      </nav>


              <main style={{ padding: '20px' }}>
        {loading && activeTab === 'dashboard' ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
            Syncing server infrastructure data...
          </div>
        ) : (
          renderTabContent()
        )}
      </main>
    </div>
  );
};

export default MainDashboardLayout;
