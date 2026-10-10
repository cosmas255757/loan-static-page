import React from 'react';

interface PublicPageProps {
  onNavigateToLogin: () => void;
}

export const PublicPage: React.FC<PublicPageProps> = ({ onNavigateToLogin }) => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', fontFamily: 'Arial, sans-serif', color: '#333' }}>
      
      {/* 1. PUBLIC HEADER / NAVIGATION BAR */}
      <header style={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #dee2e6',
        padding: '16px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div>
          <h2 style={{ margin: 0, color: '#007bff', fontSize: '1.5rem', fontWeight: 'bold' }}>Captain Microfinance</h2>
          <small style={{ color: '#6c757d', fontWeight: '500' }}>Navigating Your Journey to Financial Freedom</small>
        </div>
        <button 
          onClick={onNavigateToLogin}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,123,255,0.2)',
            transition: 'background 0.2s'
          }}
        >
          Officer Dashboard Login
        </button>
      </header>

      {/* 2. HERO ENGAGEMENT AREA */}
      <section style={{
        padding: '60px 20px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
        color: '#fff'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: 'max(2rem, 3.5vw)', margin: '0 0 20px 0', fontWeight: '800', lineHeight: '1.2' }}>
            Smart Credit and Investment Solutions
          </h1>
          <p style={{ fontSize: 'max(1.1rem, 1.4vw)', opacity: 0.9, lineHeight: '1.6', margin: '0 0 30px 0' }}>
            At Captain Microfinance, we offer premium business credit facilities, strategic investment partnerships, and transactional advisory tools for buying and selling local enterprises.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>

            <button 
              onClick={onNavigateToLogin}
              style={{ padding: '14px 28px', backgroundColor: '#fff', color: '#0056b3', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}
            >
              Portal Workspace Access
            </button>
          </div>
        </div>
      </section>

      {/* 3. CORE STRATEGY: MISSION & VISION */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '50px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <h3 style={{ color: '#007bff', marginTop: 0, fontSize: '1.4rem', fontWeight: '700' }}>🎯 Our Mission</h3>
          <p style={{ margin: 0, color: '#495057', lineHeight: '1.6', fontSize: '14px' }}>
            To supply localized micro-credit resources, foster valuable investment networks, and drive commercial fluidities by helping entrepreneurs scale up operations or unlock values via trading viable community assets safely.
          </p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <h3 style={{ color: '#28a745', marginTop: 0, fontSize: '1.4rem', fontWeight: '700' }}>👁️ Our Vision</h3>
          <p style={{ margin: 0, color: '#495057', lineHeight: '1.6', fontSize: '14px' }}>
            To become Tanzania's most responsive ecosystem where local business owners seamlessly acquire alternative startup expansion funding and access trustworthy brokerage workflows.
          </p>
        </div>
      </section>

      {/* 4. SERVICES OVERVIEW GRID */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 20px 60px 20px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', margin: '0 0 40px 0', fontWeight: '700' }}>Our Financial Services</h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '25px'
        }}>
          {/* Service 1 */}
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', border: '1px solid #dee2e6', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>💼</div>
            <h3 style={{ margin: '0 0 10px 0', color: '#007bff' }}>Business Loans</h3>
            <p style={{ margin: 0, color: '#6c757d', lineHeight: '1.5', fontSize: '14px' }}>
              Secure tailored, fast, and transparent credit options designed specifically for small and medium-scale merchants to buy retail stock, upgrade tools, or handle working capital gaps.
            </p>
          </div>

          {/* Service 2 */}
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', border: '1px solid #dee2e6', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>🤝</div>
            <h3 style={{ margin: '0 0 10px 0', color: '#007bff' }}>Investment Partnership</h3>
            <p style={{ margin: 0, color: '#6c757d', lineHeight: '1.5', fontSize: '14px' }}>
              We partner with local innovators and viable startups. By matching microfinance tracking capital with scalable business concepts, we co-pilot low-risk growth ventures.
            </p>
          </div>

          {/* Service 3 */}
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', border: '1px solid #dee2e6', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>📈</div>
            <h3 style={{ margin: '0 0 10px 0', color: '#007bff' }}>Buying & Selling Businesses</h3>
            <p style={{ margin: 0, color: '#6c757d', lineHeight: '1.5', fontSize: '14px' }}>
              Providing full-cycle structural assistance for owners wishing to exit or transfer equities, and matching buyers with verified local revenue-generating entities.
            </p>
          </div>
        </div>
      </main>
            {/* NEW: DYNAMIC STOCK MARKET CORNER */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', border: '1px solid #dee2e6', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <span style={{ backgroundColor: '#e6f0fa', color: '#007bff', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>
              Live Portfolio Tracking
            </span>
            <h2 style={{ fontSize: '1.8rem', margin: '10px 0 5px 0', fontWeight: '700' }}>Investment Partnership Workspace</h2>
            <p style={{ margin: 0, color: '#6c757d', fontSize: '14px' }}>Simulating real-time local asset valuations and equity stock performance matrices.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '20px' }}>
            {/* Left Box: SVG Candlestick Graphic */}
            <div style={{ flex: '2 1 500px', backgroundColor: '#131722', borderRadius: '6px', padding: '20px', minHeight: '280px', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d1d4dc', fontSize: '12px', marginBottom: '15px', fontFamily: 'monospace' }}>
                <span><strong>CAPTAIN / TZS</strong> • 1D • LIVE</span>
                <span style={{ color: '#26a69a' }}>+4.82% ▲</span>
              </div>
              
              {/* Pure SVG Responsive Candlestick Vector Map */}
              <svg viewBox="0 0 500 200" style={{ width: '100%', height: '100%', minHeight: '200px' }}>
                {/* Horizontal Grid Lines */}
                <line x1="0" y1="50" x2="500" y2="50" stroke="#2a2e39" strokeDasharray="4" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#2a2e39" strokeDasharray="4" />
                <line x1="0" y1="150" x2="500" y2="150" stroke="#2a2e39" strokeDasharray="4" />

                {/* Candle 1 (Bearish - Red) */}
                <line x1="50" y1="60" x2="50" y2="140" stroke="#ef5350" strokeWidth="2" />
                <rect x="40" y="80" width="20" height="40" fill="#ef5350" rx="1" />

                {/* Candle 2 (Bullish - Green) */}
                <line x1="120" y1="40" x2="120" y2="120" stroke="#26a69a" strokeWidth="2" />
                <rect x="110" y="60" width="20" height="50" fill="#26a69a" rx="1" />

                {/* Candle 3 (Bearish - Red) */}
                <line x1="190" y1="90" x2="190" y2="170" stroke="#ef5350" strokeWidth="2" />
                <rect x="180" y="100" width="20" height="45" fill="#ef5350" rx="1" />

                {/* Candle 4 (Bullish - Green) */}
                <line x1="260" y1="50" x2="260" y2="150" stroke="#26a69a" strokeWidth="2" />
                <rect x="250" y="70" width="20" height="60" fill="#26a69a" rx="1" />

                {/* Candle 5 (Bullish - Strong Breakout Green) */}
                <line x1="330" y1="20" x2="330" y2="110" stroke="#26a69a" strokeWidth="2" />
                <rect x="320" y="30" width="20" height="70" fill="#26a69a" rx="1" />

                {/* Candle 6 (Doji Star - High Liquidity) */}
                <line x1="400" y1="40" x2="400" y2="90" stroke="#d1d4dc" strokeWidth="2" />
                <rect x="390" y="63" width="20" height="4" fill="#d1d4dc" rx="1" />

                {/* Candle 7 (Bullish - Continuation Green) */}
                <line x1="470" y1="10" x2="470" y2="80" stroke="#26a69a" strokeWidth="2" />
                <rect x="460" y="20" width="20" height="50" fill="#26a69a" rx="1" />
              </svg>
            </div>

            {/* Right Box: Investment Strategy Metrics */}
            <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '15px' }}>
              <h4 style={{ margin: 0, color: '#212529', fontSize: '16px', fontWeight: 'bold' }}>Why Invest via Captain Microfinance?</h4>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ color: '#26a69a', fontSize: '16px' }}>✔</span>
                <p style={{ margin: 0, fontSize: '13px', color: '#495057', lineHeight: '1.4' }}>
                  <strong>Structured Capital Management:</strong> We pool community assets to back stable high-yield operations.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ color: '#26a69a', fontSize: '16px' }}>✔</span>
                <p style={{ margin: 0, fontSize: '13px', color: '#495057', lineHeight: '1.4' }}>
                  <strong>Risk Hedging Mechanics:</strong> Diligent vetting pipelines minimize asset devaluation factors on local market integrations.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ color: '#26a69a', fontSize: '16px' }}>✔</span>
                <p style={{ margin: 0, fontSize: '13px', color: '#495057', lineHeight: '1.4' }}>
                  <strong>Transparent Analytics Workspace:</strong> Partners keep tab over equity progress charts directly from their dashboard panels.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 5. ABOUT FOUNDER SECTION */}
      <section style={{ backgroundColor: '#fff', borderTop: '1px solid #dee2e6', borderBottom: '1px solid #dee2e6', padding: '60px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', fontWeight: '700' }}>About the Founder</h2>
          <div style={{ display: 'inline-block', width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#007bff', color: '#fff', fontSize: '1.8rem', lineHeight: '70px', fontWeight: 'bold', marginBottom: '15px' }}>
            C
          </div>
          <h3 style={{ margin: '0 0 5px 0', color: '#212529' }}>Cosmas Samwel</h3>
          <p style={{ margin: '0 0 20px 0', color: '#0056b3', fontWeight: '600', fontSize: '14px' }}>
            Student at Mbeya University of Science and Technology (MUST)
          </p>
          <p style={{ color: '#6c757d', lineHeight: '1.6', fontSize: '15px', margin: 0 }}>
            Driven by educational expertise from MUST and an intense passion for grassroots socioeconomic scaling, I designed Captain Microfinance to blend modern administrative efficiency with accessible credit parameters. We strip away bureaucratic lag to empower enterprise operators directly.
          </p>
        </div>
      </section>

      {/* 6. PUBLIC FOOTER */}
     <footer style={{ 
  backgroundColor: '#0f172a', 
  color: '#94a3b8', 
  borderTop: '1px solid #334155', 
  padding: '60px 20px 30px 20px', 
  fontFamily: 'system-ui, -apple-system, sans-serif'
}}>
  <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
    
    {/* UPPER FOOTER GRID SECTION */}
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
      gap: '40px', 
      marginBottom: '50px',
      textAlign: 'left'
    }}>
      
      {/* COLUMN 1: BRAND IDENTITY */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' }}>
          Captain <span style={{ color: '#38bdf8' }}>Microfinance</span>
        </h3>
        <p style={{ fontSize: '13px', lineHeight: '1.6', margin: 0, color: '#94a3b8' }}>
          Empowering student ventures and driving local growth through digital fintech acceleration strategies.
        </p>
      </div>

      {/* COLUMN 2: QUICK CHANNELS */}
      <div>
        <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 16px 0' }}>
          Direct Channels
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Voice Connection */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.2rem' }}>📞</span>
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>VOICE CALL</div>
              <a href="tel:+255622571211" style={{ color: '#38bdf8', fontWeight: '600', textDecoration: 'none', fontSize: '14px' }}>
                +255 622 571 211
              </a>
            </div>
          </div>

          {/* WhatsApp Connection */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.2rem' }}>💬</span>
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>WHATSAPP CHAT</div>
              <a href="https://wa.me" target="_blank" rel="noopener noreferrer" style={{ color: '#4ade80', fontWeight: '600', textDecoration: 'none', fontSize: '14px' }}>
                +255 757 956 611
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* COLUMN 3: CORRESPONDENCE ADDRESS */}
      <div>
        <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 16px 0' }}>
          Official Correspondence
        </h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px' }}>
          <span style={{ fontSize: '1.2rem' }}>✉️</span>
          <div>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>EMAIL INQUIRIES</div>
            <a href="mailto:cosmasssamwel2023@gmail.com" style={{ color: '#38bdf8', fontWeight: '600', textDecoration: 'none', fontSize: '13px' }}>
              cosmasssamwel2023@gmail.com
            </a>
          </div>
        </div>
      </div>

    </div>

    {/* BOTTOM METRICS & LEGAL ROW */}
    <div style={{ 
      borderTop: '1px solid #334155', 
      paddingTop: '30px', 
      display: 'flex', 
      flexWrap: 'wrap', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      gap: '16px',
      fontSize: '13px'
    }}>
      <p style={{ margin: 0, color: '#64748b' }}>
        &copy; {new Date().getFullYear()} <strong>Captain Microfinance</strong>. All rights reserved.
      </p>
      <div style={{ 
        backgroundColor: '#1e293b', 
        padding: '6px 14px', 
        borderRadius: '20px', 
        fontSize: '12px', 
        fontWeight: '600', 
        color: '#cbd5e1',
        border: '1px solid #334155'
      }}>
        A MUST Student Entrepreneurial Fintech Initiative
      </div>
    </div>

  </div>
</footer>

    </div>
  );
};
