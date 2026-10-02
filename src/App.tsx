import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import { ApplicantsCRUD } from './components/Dashboard/ApplicantsCRUD';
import { LoansCRUD } from './components/Dashboard/LoansCRUD';
import { RepaymentsCRUD } from './components/Dashboard/RepaymentsCRUD';
import { apiService } from './services/api';

// Chart JS Extensions Configuration
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Internal Extended Dashboard Metrics Schema
interface AdvancedDashboardStats {
  box1: {
    totalApplicants: number;
    activeLoans: number;
    overdueApplicants: number;
    overduePercentage: number;
  };
  box2: {
    today: number;
    week: number;
    month: number;
    year: number;
  };
  box3: {
    today: number;
    week: number;
    month: number;
    year: number;
  };
  box4: {
    collectionRate: number;
    outstandingRate: number;
    totalLoaned: number;
    totalCollected: number;
  };
  chartData: {
    labels: string[];
    loaningRates: number[];
    repaymentRates: number[];
  };
}

const MainDashboardLayout: React.FC = () => {
  const { currentUser, logoutUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'applicants' | 'loans' | 'repayments'>('dashboard');
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);

  const [metrics, setMetrics] = useState<AdvancedDashboardStats>({
    box1: { totalApplicants: 0, activeLoans: 0, overdueApplicants: 0, overduePercentage: 0 },
    box2: { today: 0, week: 0, month: 0, year: 0 },
    box3: { today: 0, week: 0, month: 0, year: 0 },
    box4: { collectionRate: 0, outstandingRate: 0, totalLoaned: 0, totalCollected: 0 },
    chartData: { labels: [], loaningRates: [], repaymentRates: [] }
  });

  const evaluateMetrics = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const applicants = await apiService.getApplicants();
      const loans = await apiService.getLoans();
      const repayments = await apiService.getRepayments();

      const now = new Date();
      const formatToday = now.toISOString().split('T')[0];

      // Helper function to detect if a specific date falls within this week
      const isThisWeek = (dateStr: string) => {
        const target = new Date(dateStr);
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0,0,0,0);
        return target >= startOfWeek && target <= now;
      };

      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      // --- BOX 1 CALCULATIONS ---
      const overdueLoans = loans.filter(l => l.status === 'Defaulted');
      const overduePercent = applicants.length > 0 ? (overdueLoans.length / applicants.length) * 100 : 0;

      // --- BOX 2 CALCULATIONS (LOANS) ---
      let loanedToday = 0, loanedWeek = 0, loanedMonth = 0, loanedYear = 0;
      loans.forEach(l => {
        const d = new Date(l.issuedDate);
        if (l.issuedDate === formatToday) loanedToday += l.amount;
        if (isThisWeek(l.issuedDate)) loanedWeek += l.amount;
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) loanedMonth += l.amount;
        if (d.getFullYear() === currentYear) loanedYear += l.amount;
      });

      // --- BOX 3 CALCULATIONS (REPAYMENTS) ---
      let paidToday = 0, paidWeek = 0, paidMonth = 0, paidYear = 0;
      repayments.forEach(r => {
        const d = new Date(r.paymentDate);
        if (r.paymentDate === formatToday) paidToday += r.amountPaid;
        if (isThisWeek(r.paymentDate)) paidWeek += r.amountPaid;
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) paidMonth += r.amountPaid;
        if (d.getFullYear() === currentYear) paidYear += r.amountPaid;
      });

      // --- BOX 4 CALCULATIONS (%) ---
      const totalLoanedSum = loans.reduce((sum, l) => sum + l.amount, 0);
      const totalCollectedSum = repayments.reduce((sum, r) => sum + r.amountPaid, 0);
      const collectionRate = totalLoanedSum > 0 ? (totalCollectedSum / totalLoanedSum) * 100 : 0;
      const outstandingRate = Math.max(0, 100 - collectionRate);

      // --- GRAPH TREND GENERATION (Last 6 Months) ---
      const labels: string[] = [];
      const loaningRates: number[] = [];
      const repaymentRates: number[] = [];

      for (let i = 5; i >= 0; i--) {
        const tempDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const mLabel = tempDate.toLocaleString('default', { month: 'short' });
        labels.push(mLabel);

        const mLoans = loans.filter(l => {
          const d = new Date(l.issuedDate);
          return d.getMonth() === tempDate.getMonth() && d.getFullYear() === tempDate.getFullYear();
        });
        const mRepayments = repayments.filter(r => {
          const d = new Date(r.paymentDate);
          return d.getMonth() === tempDate.getMonth() && d.getFullYear() === tempDate.getFullYear();
        });

        loaningRates.push(mLoans.reduce((sum, l) => sum + l.amount, 0));
        repaymentRates.push(mRepayments.reduce((sum, r) => sum + r.amountPaid, 0));
      }

      setMetrics({
        box1: { totalApplicants: applicants.length, activeLoans: loans.filter(l => l.status === 'Approved').length, overdueApplicants: overdueLoans.length, overduePercentage: overduePercent },
        box2: { today: loanedToday, week: loanedWeek, month: loanedMonth, year: loanedYear },
        box3: { today: paidToday, week: paidWeek, month: paidMonth, year: paidYear },
        box4: { collectionRate, outstandingRate, totalLoaned: totalLoanedSum, totalCollected: totalCollectedSum },
        chartData: { labels, loaningRates, repaymentRates }
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) evaluateMetrics();
  }, [currentUser, activeTab]);

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

  // Chart UI Data Structure Setup
  const graphDataConfig = {
    labels: metrics.chartData.labels,
    datasets: [
      {
        label: 'Disbursement Volume ($)',
        data: metrics.chartData.loaningRates,
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Collected Capital ($)',
        data: metrics.chartData.repaymentRates,
        borderColor: '#28a745',
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        tension: 0.3,
        fill: true,
      }
    ]
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
          <button onClick={() => setActiveTab('loans')} style={{ padding: '8px 14px', backgroundColor: activeTab === 'loans' ? '#007bff' : '#f8f9fa', color: activeTab === 'loans' ? '#fff' : '#333', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>Loan Management</button>
          <button onClick={() => setActiveTab('repayments')} style={{ padding: '8px 14px', backgroundColor: activeTab === 'repayments' ? '#007bff' : '#f8f9fa', color: activeTab === 'repayments' ? '#fff' : '#333', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>Installments Logger</button>
          <button onClick={logoutUser} style={{ padding: '8px 14px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Log Out</button>
        </nav>
      </header>

      <main style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        {activeTab === 'dashboard' && (
          <div>
            <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Performance Indicators Grid</h3>
            
            {loading ? <p>Recompiling transactional parameters...</p> : (
              <div>


                {/* --- STATISTICS 4-BOXES BLOCK --- */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                  
                  {/* BOX 1: Account Counts & Expirations */}
                  <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '6px', border: '1px solid #ddd', borderTop: '4px solid #17a2b8' }}>
                    <h5 style={{ margin: '0 0 10px 0', color: '#17a2b8' }}>Portfolio Volume</h5>
                    <div style={{ fontSize: '14px', margin: '5px 0' }}>Applicants Registered: <strong>{metrics.box1.totalApplicants}</strong></div>
                    <div style={{ fontSize: '14px', margin: '5px 0' }}>Active Loans Issued: <strong>{metrics.box1.activeLoans}</strong></div>
                    <div style={{ fontSize: '14px', margin: '5px 0', color: '#dc3545' }}>Overdue Profiles: <strong>{metrics.box1.overdueApplicants} ({metrics.box1.overduePercentage.toFixed(1)}%)</strong></div>
                  </div>

                  {/* BOX 2: Loaning Aggregations */}
                  <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '6px', border: '1px solid #ddd', borderTop: '4px solid #007bff' }}>
                    <h5 style={{ margin: '0 0 10px 0', color: '#007bff' }}>Capital Loaned Volume</h5>
                    <div style={{ fontSize: '14px', margin: '4px 0' }}>Today: <strong>${metrics.box2.today.toLocaleString()}</strong></div>
                    <div style={{ fontSize: '14px', margin: '4px 0' }}>This Week: <strong>${metrics.box2.week.toLocaleString()}</strong></div>
                    <div style={{ fontSize: '14px', margin: '4px 0' }}>This Month: <strong>${metrics.box2.month.toLocaleString()}</strong></div>
                    <div style={{ fontSize: '14px', margin: '4px 0' }}>This Year: <strong>${metrics.box2.year.toLocaleString()}</strong></div>
                  </div>

                  {/* BOX 3: Recoveries Aggregations */}
                  <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '6px', border: '1px solid #ddd', borderTop: '4px solid #28a745' }}>
                    <h5 style={{ margin: '0 0 10px 0', color: '#28a745' }}>Recoveries & Remittances</h5>
                    <div style={{ fontSize: '14px', margin: '4px 0' }}>Today: <strong>${metrics.box3.today.toLocaleString()}</strong></div>
                    <div style={{ fontSize: '14px', margin: '4px 0' }}>This Week: <strong>${metrics.box3.week.toLocaleString()}</strong></div>
                    <div style={{ fontSize: '14px', margin: '4px 0' }}>This Month: <strong>${metrics.box3.month.toLocaleString()}</strong></div>
                    <div style={{ fontSize: '14px', margin: '4px 0' }}>This Year: <strong>${metrics.box3.year.toLocaleString()}</strong></div>
                  </div>

                  {/* BOX 4: Comparative Ratios (%) */}
                  <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '6px', border: '1px solid #ddd', borderTop: '4px solid #ffc107' }}>
                    <h5 style={{ margin: '0 0 10px 0', color: '#856404' }}>Collection Recovery Ratio</h5>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#28a745', marginTop: '10px' }}>{metrics.box4.collectionRate.toFixed(1)}%</div>
                    <small style={{ color: '#666', display: 'block', marginBottom: '10px' }}>Collected vs Total Disbursed Capital</small>
                    <div style={{ fontSize: '13px', color: '#555' }}>Remaining Portfolio Risk Rate: <strong>{metrics.box4.outstandingRate.toFixed(1)}%</strong></div>
                  </div>
                  
                </div>

                {/* --- LIVE LINE GRAPH SYSTEM PANEL --- */}
                <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '6px', border: '1px solid #ddd' }}>
                  <h4 style={{ marginTop: 0, marginBottom: '15px' }}>Financial Volume Issuance vs Remittance Rates</h4>
                  <div style={{ width: '100%', height: '350px', position: 'relative' }}>
                    <Line data={graphDataConfig} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'applicants' && <ApplicantsCRUD />}
        {activeTab === 'loans' && <LoansCRUD />}
        {activeTab === 'repayments' && <RepaymentsCRUD />}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainDashboardLayout />
    </AuthProvider>
  );
}
