import React from "react";

interface PublicPageProps {
  onNavigateToLogin: () => void;
}

export const PublicPage: React.FC<PublicPageProps> = ({
  onNavigateToLogin,
}) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        fontFamily: "Arial, sans-serif",
        color: "#333",
      }}
    >
      {/* 1. PUBLIC HEADER / NAVIGATION BAR */}
      <header
  style={{
    backgroundColor: "rgba(15, 23, 42, 0.9)", // Sleek glassmorphic dark backdrop
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderBottom: "1px solid #1e293b",
    padding: "20px 20px 16px 20px",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    fontFamily: "system-ui, -apple-system, sans-serif"
  }}
>
  {/* SELF-CONTAINED MOBILE ARCHITECTURE ENGINE */}
  {(() => {
    const [lang, setLang] = React.useState<'en' | 'sw'>('en');
    const [isBtnHovered, setIsBtnHovered] = React.useState(false);

    const navText: { [key: string]: any } = {
      en: {
        toggleBtn: "🌐 Swahili (TZ)",
        brandSubtitle: "Navigating Your Journey to Financial Freedom",
        ctaBtn: "Officer Dashboard Login"
      },
      sw: {
        toggleBtn: "🌐 English (EN)",
        brandSubtitle: "Kuongoza Njia Yako Kuelekea Uhuru wa Kifedha",
        ctaBtn: "Ingia Mfumo wa Afisa"
      }
    };

    const t = navText[lang];

    return (
      <div style={{ position: "relative", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        
        {/* 1. ABSOLUTE TOP RIGHT LANGUAGE SELECTOR FOR SYSTEM LAYOUTS */}
        <div style={{ 
          position: "absolute", 
          top: "-12px", 
          right: "0", 
          zIndex: 1010 
        }}>
          <button
            onClick={() => setLang(lang === 'en' ? 'sw' : 'en')}
            style={{
              backgroundColor: "#1e293b",
              color: "#38bdf8",
              border: "1px solid #334155",
              padding: "4px 10px",
              borderRadius: "20px",
              cursor: "pointer",
              fontSize: "10px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#38bdf8";
              e.currentTarget.style.backgroundColor = "#0f172a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#334155";
              e.currentTarget.style.backgroundColor = "#1e293b";
            }}
          >
            {t.toggleBtn}
          </button>
        </div>

        {/* 2. RESPONSIVEFLEX CONTROLLER HUB (AUTO-STACK ON SCREENS < 640px) */}
        <div style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          marginTop: "10px",
          width: "100%"
        }}>
          
          {/* BRAND IDENTITY METRICS COMPONENT */}
          <div style={{ flex: "1 1 auto", minWidth: "200px" }}>
            <h2
              style={{
                margin: 0,
                color: "#fff",
                fontSize: "1.4rem",
                fontWeight: "800",
                letterSpacing: "-0.5px"
              }}
            >
              Captain <span style={{ color: "#38bdf8" }}>Microfinance</span>
            </h2>
            <small style={{ 
              color: "#94a3b8", 
              fontWeight: "500", 
              display: "block", 
              marginTop: "4px", 
              fontSize: "11px",
              lineHeight: "1.3"
            }}>
              {t.brandSubtitle}
            </small>
          </div>

          {/* CALL TO ACTION HUB REGION */}
          <div style={{ 
            flex: "0 1 auto",
            width: "auto"
          }}>
            <button
              onClick={onNavigateToLogin}
              onMouseEnter={() => setIsBtnHovered(true)}
              onMouseLeave={() => setIsBtnHovered(false)}
              style={{
                padding: "10px 20px",
                backgroundColor: isBtnHovered ? "#4ade80" : "#38bdf8",
                color: "#0f172a",
                border: "none",
                borderRadius: "10px",
                fontWeight: "700",
                fontSize: "13.5px",
                cursor: "pointer",
                width: "100%", // Adapts to fill container layout cleanly on mobile stack breakpoints
                textAlign: "center",
                boxShadow: isBtnHovered 
                  ? "0 10px 20px -8px rgba(74, 222, 128, 0.4)" 
                  : "0 4px 12px -8px rgba(56, 189, 248, 0.3)",
                transform: isBtnHovered ? "translateY(-2px)" : "translateY(0px)",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            >
              {t.ctaBtn} →
            </button>
          </div>

        </div>

      </div>
    );
  })()}
</header>


      {/* 2. HERO ENGAGEMENT AREA */}
<section
  style={{
    padding: "100px 20px 120px 20px",
    textAlign: "center",
    background: "#0f172a", // Seamless integration with your layout architecture
    color: "#fff",
    fontFamily: "system-ui, -apple-system, sans-serif",
    position: "relative",
    overflow: "hidden",
    borderBottom: "1px solid #1e293b"
  }}
>
  {/* Decorative Layer Matrix: Premium Ambient Lighting Glow */}
  <div style={{
    position: "absolute",
    top: "-10%",
    left: "50%",
    transform: "translateX(-50%)",
    width: "700px",
    height: "500px",
    background: "radial-gradient(circle, rgba(56,189,248,0.15) 0%, rgba(0,0,0,0) 70%)",
    zIndex: 1,
    pointerEvents: "none"
  }} />

  {/* INTERNAL DATA ENGINE */}
  {(() => {
    const [lang, setLang] = React.useState<'en' | 'sw'>('en');
    const [isBtnHovered, setIsBtnHovered] = React.useState(false);

    const dictionary: { [key: string]: any } = {
      en: {
        toggleBtn: "🌐 Swahili (TZ)",
        titleMain: "Smart Credit and",
        titleAccent: " Investment Solutions",
        description: "At Captain Microfinance, we offer premium business credit facilities, strategic investment partnerships, and transactional advisory tools for buying and selling local enterprises.",
        ctaText: "Portal Workspace Access"
      },
      sw: {
        toggleBtn: "🌐 English (EN)",
        titleMain: "Mikopo Mahiri na",
        titleAccent: " Mifumo ya Uwekezaji",
        description: "Hapa Captain Microfinance, tunatoa huduma bora za mikopo ya biashara, ushirikiano wa kimkakati wa uwekezaji, na zana za ushauri wa kibiashara kwa kununua na kuuza makampuni ya ndani.",
        ctaText: "Ingia Kwenye Mfumo"
      }
    };

    const t = dictionary[lang];

    return (
      <div style={{ maxWidth: "850px", margin: "0 auto", position: "relative", zIndex: 2 }}>
        
        {/* LOCALIZATION TRIGGER BLOCK */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "30px" }}>
          <button
            onClick={() => setLang(lang === 'en' ? 'sw' : 'en')}
            style={{
              backgroundColor: "#1e293b",
              color: "#38bdf8",
              border: "1px solid #334155",
              padding: "6px 14px",
              borderRadius: "20px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#38bdf8";
              e.currentTarget.style.backgroundColor = "#0f172a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#334155";
              e.currentTarget.style.backgroundColor = "#1e293b";
            }}
          >
            {t.toggleBtn}
          </button>
        </div>

        {/* HERO TITLE TEXT */}
        <h1
          style={{
            fontSize: "max(2.4rem, 4vw)",
            margin: "0 0 25px 0",
            fontWeight: "800",
            lineHeight: "1.15",
            letterSpacing: "-1.5px",
            color: "#fff"
          }}
        >
          {t.titleMain}
          <span style={{ 
            background: "linear-gradient(to right, #38bdf8, #4ade80)", 
            WebkitBackgroundClip: "text", 
            WebkitTextFillColor: "transparent" 
          }}>
            {t.titleAccent}
          </span>
        </h1>

        {/* SUBTITLE EXPOSITION */}
        <p
          style={{
            fontSize: "max(1.05rem, 1.25vw)",
            color: "#94a3b8",
            lineHeight: "1.7",
            margin: "0 auto 40px auto",
            maxWidth: "700px"
          }}
        >
          {t.description}
        </p>

        {/* INTERACTIVE CALL TO ACTION REGION */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={onNavigateToLogin}
            onMouseEnter={() => setIsBtnHovered(true)}
            onMouseLeave={() => setIsBtnHovered(false)}
            style={{
              padding: "16px 36px",
              backgroundColor: isBtnHovered ? "#4ade80" : "#38bdf8", // Fluid active color transitions
              color: "#0f172a",
              border: "none",
              borderRadius: "14px",
              fontWeight: "700",
              fontSize: "16px",
              cursor: "pointer",
              boxShadow: isBtnHovered 
                ? "0 15px 30px -10px rgba(74, 222, 128, 0.4)" 
                : "0 10px 25px -10px rgba(56, 189, 248, 0.3)",
              transform: isBtnHovered ? "translateY(-4px)" : "translateY(0px)",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {t.ctaText} →
          </button>
        </div>

      </div>
    );
  })()}
</section>

      {/* 3. CORE STRATEGY: MISSION & VISION */}
<section
  style={{
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "60px 20px",
    fontFamily: "system-ui, -apple-system, sans-serif",
    color: "#f8fafc"
  }}
>
  {/* SELF-CONTAINED STATE & TRANSLATION ENGINE */}
  {(() => {
    const [lang, setLang] = React.useState<'en' | 'sw'>('en');
    const [hoveredBoxIndex, setHoveredBoxIndex] = React.useState<number | null>(null);

    const translations: { [key: string]: any } = {
      en: {
        toggleBtn: "🌐 Swahili (TZ)",
        missionTitle: "🎯 Our Mission",
        missionDesc: "To supply localized micro-credit resources, foster valuable investment networks, and drive commercial fluidities by helping entrepreneurs scale up operations or unlock values via trading viable community assets safely.",
        visionTitle: "👁️ Our Vision",
        visionDesc: "To become Tanzania's most responsive ecosystem where local business owners seamlessly acquire alternative startup expansion funding and access trustworthy brokerage workflows."
      },
      sw: {
        toggleBtn: "🌐 English (EN)",
        missionTitle: "🎯 Lengo Letu",
        missionDesc: "Kutoa rasilimali za mikopo midogo ya ndani, kukuza mitandao yenye thamani ya uwekezaji, na kuendesha urahisi wa kibiashara kwa kusaidia wajasiriamali kukuza uendeshaji au kufungua fursa kwa kufanya biashara ya mali za jamii zilizo salama.",
        visionTitle: "👁️ Maono Yetu",
        visionDesc: "Kuwa mfumo unaojibu haraka zaidi nchini Tanzania ambapo wamiliki wa biashara za ndani wanapata kwa urahisi fedha mbadala za ukuzaji wa biashara na kupata mifumo ya uaminifu ya udalali."
      }
    };

    const t = translations[lang];

    return (
      <div style={{ position: "relative" }}>
        
        {/* TRANSLATION TRIGGER OVERLAY */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "25px" }}>
          <button
            onClick={() => setLang(lang === 'en' ? 'sw' : 'en')}
            style={{
              backgroundColor: "#1e293b",
              color: "#38bdf8",
              border: "1px solid #334155",
              padding: "6px 14px",
              borderRadius: "20px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#38bdf8";
              e.currentTarget.style.backgroundColor = "#0f172a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#334155";
              e.currentTarget.style.backgroundColor = "#1e293b";
            }}
          >
            {t.toggleBtn}
          </button>
        </div>

        {/* METRICS DISPLAY GRID MATCHING CONTENT SCHEMAS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "30px",
          }}
        >
          {/* MISSION CONTAINER BOX */}
          <div
            onMouseEnter={() => setHoveredBoxIndex(0)}
            onMouseLeave={() => setHoveredBoxIndex(null)}
            style={{
              backgroundColor: "#1e293b",
              padding: "40px 35px",
              borderRadius: "20px",
              border: hoveredBoxIndex === 0 ? "1px solid #38bdf8" : "1px solid #334155",
              boxShadow: hoveredBoxIndex === 0 
                ? "0 20px 40px -15px rgba(56, 189, 248, 0.15)" 
                : "0 10px 30px -15px rgba(0,0,0,0.3)",
              transform: hoveredBoxIndex === 0 ? "translateY(-6px)" : "translateY(0px)",
              transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <h3
              style={{
                color: "#38bdf8",
                marginTop: 0,
                fontSize: "1.5rem",
                fontWeight: "700",
                marginBottom: "16px",
                letterSpacing: "-0.3px"
              }}
            >
              {t.missionTitle}
            </h3>
            <p
              style={{
                margin: 0,
                color: "#94a3b8",
                lineHeight: "1.7",
                fontSize: "14.5px",
                textAlign: "justify"
              }}
            >
              {t.missionDesc}
            </p>
          </div>

          {/* VISION CONTAINER BOX */}
          <div
            onMouseEnter={() => setHoveredBoxIndex(1)}
            onMouseLeave={() => setHoveredBoxIndex(null)}
            style={{
              backgroundColor: "#1e293b",
              padding: "40px 35px",
              borderRadius: "20px",
              border: hoveredBoxIndex === 1 ? "1px solid #4ade80" : "1px solid #334155", // Distinct color focus shift
              boxShadow: hoveredBoxIndex === 1 
                ? "0 20px 40px -15px rgba(74, 222, 128, 0.15)" 
                : "0 10px 30px -15px rgba(0,0,0,0.3)",
              transform: hoveredBoxIndex === 1 ? "translateY(-6px)" : "translateY(0px)",
              transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <h3
              style={{
                color: "#4ade80",
                marginTop: 0,
                fontSize: "1.5rem",
                fontWeight: "700",
                marginBottom: "16px",
                letterSpacing: "-0.3px"
              }}
            >
              {t.visionTitle}
            </h3>
            <p
              style={{
                margin: 0,
                color: "#94a3b8",
                lineHeight: "1.7",
                fontSize: "14.5px",
                textAlign: "justify"
              }}
            >
              {t.visionDesc}
            </p>
          </div>

        </div>
      </div>
    );
  })()}
</section>


      {/* 4. SERVICES OVERVIEW GRID */}
      <main
  style={{
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "60px 20px 80px 20px",
    fontFamily: "system-ui, -apple-system, sans-serif",
    color: "#f8fafc"
  }}
>
  {/* INTERNAL TRANSLATION & HOVER STATE ARCHITECTURE */}
  {(() => {
    const [lang, setLang] = React.useState<'en' | 'sw'>('en');
    const [activeHoverIndex, setActiveHoverIndex] = React.useState<number | null>(null);

    // Dictionary mappings matching index queries perfectly
    const servicesText: { [key: string]: any } = {
      en: {
        title: "Our Financial Services",
        toggleBtn: "🌐 Swahili (TZ)",
        s1Title: "Business Loans",
        s1Desc: "Secure tailored, fast, and transparent credit options designed specifically for small and medium-scale merchants to buy retail stock, upgrade tools, or handle working capital gaps.",
        s2Title: "Investment Partnership",
        s2Desc: "We partner with local innovators and viable startups. By matching microfinance tracking capital with scalable business concepts, we co-pilot low-risk growth ventures.",
        s3Title: "Buying & Selling Businesses",
        s3Desc: "Providing full-cycle structural assistance for owners wishing to exit or transfer equities, and matching buyers with verified local revenue-generating entities."
      },
      sw: {
        title: "Huduma Zetu za Kifedha",
        toggleBtn: "🌐 English (EN)",
        s1Title: "Mikopo ya Biashara",
        s1Desc: "Pata mikopo nafuu, ya haraka na ya wazi iliyoundwa maalum kwa wafanyabiashara wadogo na wa kati kununua bidhaa, kuboresha vifaa, au kuziba mapengo ya mtaji wa uendeshaji.",
        s2Title: "Ushirikiano wa Uwekezaji",
        s2Desc: "Tunashirikiana na wabunifu wa ndani na biashara mpya zinazokua. Kwa kuoanisha mitaji ya microfinance na mawazo ya biashara yanayoweza kukua, tunaratibu uwekezaji salama.",
        s3Title: "Kununua na Kuuza Biashara",
        s3Desc: "Kutoa usaidizi kamili wa kimuundo kwa wamiliki wanaotaka kuondoka au kuhamisha hisa zao, na kuwaunganisha wanunuzi na biashara zilizothibitishwa zinazoingiza mapato."
      }
    };

    const t = servicesText[lang];

    return (
      <div style={{ position: "relative" }}>
        
        {/* INTERACTIVE TRANSLATION TOGGLE BUTTON */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
          <button
            onClick={() => setLang(lang === 'en' ? 'sw' : 'en')}
            style={{
              backgroundColor: "#1e293b",
              color: "#38bdf8",
              border: "1px solid #334155",
              padding: "6px 14px",
              borderRadius: "20px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#38bdf8";
              e.currentTarget.style.backgroundColor = "#0f172a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#334155";
              e.currentTarget.style.backgroundColor = "#1e293b";
            }}
          >
            {t.toggleBtn}
          </button>
        </div>

        <h2
          style={{
            textAlign: "center",
            fontSize: "2.4rem",
            margin: "0 0 50px 0",
            fontWeight: "800",
            color: "#fff",
            letterSpacing: "-0.5px"
          }}
        >
          {t.title}
        </h2>

        {/* SERVICES FLEXBOX/GRID LAYOUT MAP */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "30px",
          }}
        >
          {/* SERVICE CARD 1 */}
          <div
            onMouseEnter={() => setActiveHoverIndex(0)}
            onMouseLeave={() => setActiveHoverIndex(null)}
            style={{
              backgroundColor: "#1e293b",
              padding: "40px 30px",
              borderRadius: "20px",
              border: activeHoverIndex === 0 ? "1px solid #38bdf8" : "1px solid #334155",
              boxShadow: activeHoverIndex === 0 
                ? "0 20px 40px -15px rgba(56, 189, 248, 0.15)" 
                : "0 10px 30px -15px rgba(0,0,0,0.3)",
              transform: activeHoverIndex === 0 ? "translateY(-8px)" : "translateY(0px)",
              transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <div style={{ 
              fontSize: "2.8rem", 
              marginBottom: "20px",
              transform: activeHoverIndex === 0 ? "scale(1.15) rotate(-5deg)" : "scale(1) rotate(0deg)",
              transition: "transform 0.3s ease",
              display: "inline-block"
            }}>
              💼
            </div>
            <h3 style={{ margin: "0 0 12px 0", color: "#fff", fontSize: "1.4rem", fontWeight: "700" }}>
              {t.s1Title}
            </h3>
            <p
              style={{
                margin: 0,
                color: "#94a3b8",
                lineHeight: "1.6",
                fontSize: "14.5px",
                textAlign: "justify"
              }}
            >
              {t.s1Desc}
            </p>
          </div>

          {/* SERVICE CARD 2 */}
          <div
            onMouseEnter={() => setActiveHoverIndex(1)}
            onMouseLeave={() => setActiveHoverIndex(null)}
            style={{
              backgroundColor: "#1e293b",
              padding: "40px 30px",
              borderRadius: "20px",
              border: activeHoverIndex === 1 ? "1px solid #38bdf8" : "1px solid #334155",
              boxShadow: activeHoverIndex === 1 
                ? "0 20px 40px -15px rgba(56, 189, 248, 0.15)" 
                : "0 10px 30px -15px rgba(0,0,0,0.3)",
              transform: activeHoverIndex === 1 ? "translateY(-8px)" : "translateY(0px)",
              transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <div style={{ 
              fontSize: "2.8rem", 
              marginBottom: "20px",
              transform: activeHoverIndex === 1 ? "scale(1.15) rotate(5deg)" : "scale(1) rotate(0deg)",
              transition: "transform 0.3s ease",
              display: "inline-block"
            }}>
              🤝
            </div>
            <h3 style={{ margin: "0 0 12px 0", color: "#fff", fontSize: "1.4rem", fontWeight: "700" }}>
              {t.s2Title}
            </h3>
            <p
              style={{
                margin: 0,
                color: "#94a3b8",
                lineHeight: "1.6",
                fontSize: "14.5px",
                textAlign: "justify"
              }}
            >
              {t.s2Desc}
            </p>
          </div>

          {/* SERVICE CARD 3 */}
          <div
            onMouseEnter={() => setActiveHoverIndex(2)}
            onMouseLeave={() => setActiveHoverIndex(null)}
            style={{
              backgroundColor: "#1e293b",
              padding: "40px 30px",
              borderRadius: "20px",
              border: activeHoverIndex === 2 ? "1px solid #38bdf8" : "1px solid #334155",
              boxShadow: activeHoverIndex === 2 
                ? "0 20px 40px -15px rgba(56, 189, 248, 0.15)" 
                : "0 10px 30px -15px rgba(0,0,0,0.3)",
              transform: activeHoverIndex === 2 ? "translateY(-8px)" : "translateY(0px)",
              transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <div style={{ 
              fontSize: "2.8rem", 
              marginBottom: "20px",
              transform: activeHoverIndex === 2 ? "scale(1.15) rotate(-5deg)" : "scale(1) rotate(0deg)",
              transition: "transform 0.3s ease",
              display: "inline-block"
            }}>
              📈
            </div>
            <h3 style={{ margin: "0 0 12px 0", color: "#fff", fontSize: "1.4rem", fontWeight: "700" }}>
              {t.s3Title}
            </h3>
            <p
              style={{
                margin: 0,
                color: "#94a3b8",
                lineHeight: "1.6",
                fontSize: "14.5px",
                textAlign: "justify"
              }}
            >
              {t.s3Desc}
            </p>
          </div>

        </div>
      </div>
    );
  })()}
</main>

      {/* NEW: DYNAMIC STOCK MARKET CORNER */}
<section
  style={{
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "60px 20px",
    fontFamily: "system-ui, -apple-system, sans-serif",
    color: "#f8fafc",
  }}
>
  {/* INTERNAL TRANSLATION STATE HOOK (Inject into component layout wrapper) */}
  {(() => {
    // Component Context Configuration
    const [lang, setLang] = React.useState<'en' | 'sw'>('en');
    const [isChartHovered, setIsChartHovered] = React.useState(false);
    const [hoveredCardIndex, setHoveredCardIndex] = React.useState(null);

    // Dynamic Translation Data Dictionary
    const content = {
      en: {
        badge: "Live Portfolio Tracking",
        title: "Investment Partnership Workspace",
        subtitle: "Simulating real-time local asset valuations and equity stock performance matrices.",
        chartTitle: "CAPTAIN / TZS • 1D • LIVE",
        whyInvest: "Why Invest via Captain Microfinance?",
        point1Title: "Structured Capital Management: ",
        point1Desc: "We pool community assets to back stable high-yield operations.",
        point2Title: "Mitigated Asset Default Matrices: ",
        point2Desc: "Advanced real-time risk mitigation frameworks securing investment liquidity balances.",
        point3Title: "Transparent Yield Acceleration: ",
        point3Desc: "Track portfolio distribution metrics instantly with automated smart ledger protocols."
      },
      sw: {
        badge: "Ufuatiliaji wa Hazina Papo Hapo",
        title: "Eneo la Ushirikiano wa Uwekezaji",
        subtitle: "Kuiga thamani halisi ya mali za ndani na mifumo ya utendaji wa hisa za mitaji.",
        chartTitle: "CAPTAIN / TZS • SIKU 1 • LIVE",
        whyInvest: "Kwanini Uwekeze Kupitia Captain Microfinance?",
        point1Title: "Usimamizi wa Mtaji Ulioratibiwa: ",
        point1Desc: "Tunakusanya mali za jamii ili kusaidia uendeshaji thabiti wenye faida kubwa.",
        point2Title: "Mifumo ya Kupunguza Hasara za Mali: ",
        point2Desc: "Mifumo ya juu ya kupunguza hatari za kifedha ili kulinda ukwasi wa uwekezaji wako.",
        point3Title: "Ukuaji wa Faida wa Wazi: ",
        point3Desc: "Fuatilia viashiria vya mgawanyo wa faida papo hapo kwa kutumia mifumo ya kiotomatiki."
      }
    };

    const t = content[lang];

    return (
      <div
        style={{
          backgroundColor: "#1e293b", // Clean premium glassmorphism base card
          padding: "40px",
          borderRadius: "24px",
          border: "1px solid #334155",
          boxShadow: "0 20px 40px -15px rgba(0,0,0,0.5)",
          position: "relative"
        }}
      >
        {/* INTERACTIVE TRANSLATION CONTROLLER */}
        <div style={{ position: "absolute", top: "25px", right: "25px", zIndex: 10 }}>
          <button
            onClick={() => setLang(lang === 'en' ? 'sw' : 'en')}
            style={{
              backgroundColor: "#0f172a",
              color: "#38bdf8",
              border: "1px solid #334155",
              padding: "6px 14px",
              borderRadius: "20px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#38bdf8";
              e.currentTarget.style.backgroundColor = "#1e293b";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#334155";
              e.currentTarget.style.backgroundColor = "#0f172a";
            }}
          >
            🌐 {lang === 'en' ? 'Swahili (TZ)' : 'English (EN)'}
          </button>
        </div>

        {/* SECTION METADATA HEADER */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span
            style={{
              backgroundColor: "rgba(56, 189, 248, 0.1)",
              color: "#38bdf8",
              padding: "6px 16px",
              borderRadius: "20px",
              fontSize: "11px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              display: "inline-block",
              border: "1px solid rgba(56, 189, 248, 0.2)"
            }}
          >
            ⚡ {t.badge}
          </span>
          <h2
            style={{
              fontSize: "2.2rem",
              margin: "15px 0 10px 0",
              fontWeight: "800",
              color: "#fff",
              letterSpacing: "-0.5px"
            }}
          >
            {t.title}
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "15px", maxWidth: "600px", margin: "0 auto", lineHeight: "1.5" }}>
            {t.subtitle}
          </p>
        </div>

        {/* WORKSPACE FLEXBOX LAYOUT CONTAINER */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: "35px",
            alignItems: "stretch"
          }}
        >
          {/* LEFT CONTAINER: ADVANCED INTERACTIVE TRADING CHART GRAPHIC */}
          <div
            onMouseEnter={() => setIsChartHovered(true)}
            onMouseLeave={() => setIsChartHovered(false)}
            style={{
              flex: "2 1 500px",
              backgroundColor: "#0f172a", // Match deep trading terminals
              borderRadius: "16px",
              padding: "25px",
              minHeight: "300px",
              border: isChartHovered ? "1px solid #38bdf8" : "1px solid #1e293b",
              boxShadow: isChartHovered ? "0 10px 30px -10px rgba(56, 189, 248, 0.15)" : "none",
              transform: isChartHovered ? "translateY(-4px)" : "translateY(0px)",
              transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#cbd5e1",
                fontSize: "13px",
                marginBottom: "20px",
                fontFamily: "monospace",
              }}
            >
              <span>
                <strong>{t.chartTitle}</strong>
              </span>
              <span style={{ color: "#4ade80", fontWeight: "700", animation: "pulse 2s infinite" }}>+4.82% ▲</span>
            </div>

            {/* Pure SVG Responsive Candlestick Vector Map with Glow Filters */}
            <svg
              viewBox="0 0 500 200"
              style={{ width: "100%", height: "100%", minHeight: "200px", overflow: "visible" }}
            >
              <defs>
                <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Horizontal Grid Lines */}
              <line x1="0" y1="50" x2="500" y2="50" stroke="#1e293b" strokeDasharray="4" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#1e293b" strokeDasharray="4" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="#1e293b" strokeDasharray="4" />

              {/* Candle 1 (Bearish - Red) */}
              <line x1="50" y1="60" x2="50" y2="140" stroke="#f87171" strokeWidth="2" />
              <rect x="40" y="80" width="20" height="40" fill="#f87171" rx="2" style={{ transition: "all 0.3s" }} />

              {/* Candle 2 (Bullish - Green) */}
              <line x1="120" y1="40" x2="120" y2="120" stroke="#4ade80" strokeWidth="2" />
              <rect x="110" y="60" width="20" height="50" fill="#4ade80" rx="2" />

              {/* Candle 3 (Bearish - Red) */}
              <line x1="190" y1="90" x2="190" y2="170" stroke="#f87171" strokeWidth="2" />
              <rect x="180" y="100" width="20" height="45" fill="#f87171" rx="2" />

              {/* Candle 4 (Bullish - Green) */}
              <line x1="260" y1="50" x2="260" y2="150" stroke="#4ade80" strokeWidth="2" />
              <rect x="250" y="70" width="20" height="60" fill="#4ade80" rx="2" />

              {/* Candle 5 (Bullish - Strong Breakout Green) */}
              <line x1="330" y1="20" x2="330" y2="110" stroke="#4ade80" strokeWidth="2" />
              <rect x="320" y="30" width="20" height="70" fill="#4ade80" rx="2" filter={isChartHovered ? "url(#glow-green)" : "none"} style={{ transition: "filter 0.3s" }} />

              {/* Candle 6 (Doji Star) */}
              <line x1="400" y1="40" x2="400" y2="90" stroke="#94a3b8" strokeWidth="2" />
              <rect x="390" y="63" width="20" height="4" fill="#94a3b8" rx="1" />

              {/* Candle 7 (Bullish - Continuation Green) */}
              <line x1="470" y1="10" x2="470" y2="80" stroke="#4ade80" strokeWidth="2" />
              <rect x="460" y="20" width="20" height="50" fill="#4ade80" rx="2" />
            </svg>
          </div>

          {/* RIGHT CONTAINER: STRATEGY INSIGHT METRICS CARDS */}
          <div
            style={{
              flex: "1 1 350px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "16px",
            }}
          >
            <h4
              style={{
                margin: "0 0 4px 0",
                color: "#fff",
                fontSize: "18px",
                fontWeight: "700",
                letterSpacing: "-0.3px"
              }}
            >
              {t.whyInvest}
            </h4>
            {/* STRATEGY POINT 1 */}
            <div
              onMouseLeave={() => setHoveredCardIndex(null)}
              style={{
                display: "flex",
                gap: "14px",
                alignItems: "flex-start",
                padding: "14px",
                borderRadius: "12px",
                backgroundColor: hoveredCardIndex === 0 ? "#0f172a" : "transparent",
                border: hoveredCardIndex === 0 ? "1px solid #1e293b" : "1px solid transparent",
                transform: hoveredCardIndex === 0 ? "translateX(6px)" : "translateX(0px)",
                transition: "all 0.3s ease"
              }}
            >
              <span style={{ color: "#4ade80", fontSize: "18px", lineHeight: "1" }}>✔</span>
              <p style={{ margin: 0, fontSize: "13.5px", color: "#cbd5e1", lineHeight: "1.5" }}>
                <strong style={{ color: "#fff" }}>{t.point1Title}</strong>{t.point1Desc}
              </p>
            </div>

            {/* STRATEGY POINT 2 */}
            <div
              onMouseLeave={() => setHoveredCardIndex(null)}
              style={{
                display: "flex",
                gap: "14px",
                alignItems: "flex-start",
                padding: "14px",
                borderRadius: "12px",
                backgroundColor: hoveredCardIndex === 1 ? "#0f172a" : "transparent",
                border: hoveredCardIndex === 1 ? "1px solid #1e293b" : "1px solid transparent",
                transform: hoveredCardIndex === 1 ? "translateX(6px)" : "translateX(0px)",
                transition: "all 0.3s ease"
              }}
            >
              <span style={{ color: "#4ade80", fontSize: "18px", lineHeight: "1" }}>✔</span>
              <p style={{ margin: 0, fontSize: "13.5px", color: "#cbd5e1", lineHeight: "1.5" }}>
                <strong style={{ color: "#fff" }}>{t.point2Title}</strong>{t.point2Desc}
              </p>
            </div>

            {/* STRATEGY POINT 3 */}
            <div
              onMouseLeave={() => setHoveredCardIndex(null)}
              style={{
                display: "flex",
                gap: "14px",
                alignItems: "flex-start",
                padding: "14px",
                borderRadius: "12px",
                backgroundColor: hoveredCardIndex === 2 ? "#0f172a" : "transparent",
                border: hoveredCardIndex === 2 ? "1px solid #1e293b" : "1px solid transparent",
                transform: hoveredCardIndex === 2 ? "translateX(6px)" : "translateX(0px)",
                transition: "all 0.3s ease"
              }}
            >
              <span style={{ color: "#4ade80", fontSize: "18px", lineHeight: "1" }}>✔</span>
              <p style={{ margin: 0, fontSize: "13.5px", color: "#cbd5e1", lineHeight: "1.5" }}>
                <strong style={{ color: "#fff" }}>{t.point3Title}</strong>{t.point3Desc}
              </p>
            </div>

          </div>
        </div>
      </div>
    );
  })()}
</section>



      {/* 5. ABOUT FOUNDER SECTION */}
      <section
  style={{
    backgroundColor: '#0f172a', 
    borderTop: '1px solid #1e293b',
    borderBottom: '1px solid #1e293b',
    padding: '80px 20px',
    color: '#f8fafc',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    overflow: 'hidden',
    position: 'relative'
  }}
>
  {/* Decorative Radial Background Light Blur Effect */}
  <div style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, rgba(0,0,0,0) 70%)',
    zIndex: 1,
    pointerEvents: 'none'
  }} />

  <div
    style={{
      maxWidth: '750px',
      margin: '0 auto',
      textAlign: 'center',
      backgroundColor: '#1e293b', 
      padding: '50px 40px',
      borderRadius: '24px',
      border: '1px solid #334155',
      boxShadow: '0 10px 30px -15px rgba(0,0,0,0.3)',
      position: 'relative',
      zIndex: 2
    }}
  >
    {/* Section Tag Header */}
    <span style={{
      textTransform: 'uppercase',
      fontSize: '11px',
      letterSpacing: '2px',
      color: '#38bdf8',
      fontWeight: '700',
      display: 'block',
      marginBottom: '12px'
    }}>
      Leadership Profile
    </span>

    <h2 style={{
      fontSize: '2.2rem',
      fontWeight: '800',
      margin: '0 0 35px 0',
      color: '#fff',
      letterSpacing: '-0.5px'
    }}>
      About the Founder
    </h2>

    {/* Avatar Element */}
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '85px',
        height: '85px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #38bdf8 0%, #0369a1 100%)',
        color: '#fff',
        fontSize: '2.4rem',
        fontWeight: '800',
        marginBottom: '20px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
        cursor: 'default'
      }}
    >
      C
    </div>

    {/* Founder Name Metadata */}
    <h3 style={{ 
      margin: '0 0 6px 0', 
      color: '#fff', 
      fontSize: '1.5rem', 
      fontWeight: '700' 
    }}>
      Cosmas Samwel
    </h3>
    
    {/* Academic Institution Tag */}
    <p style={{
      margin: '0 0 24px 0',
      color: '#cbd5e1',
      fontWeight: '500',
      fontSize: '14px',
      display: 'inline-block',
      backgroundColor: '#0f172a',
      padding: '6px 14px',
      borderRadius: '12px',
      border: '1px solid #334155'
    }}>
      🎓 Student at <span style={{ color: '#38bdf8', fontWeight: '600' }}>Mbeya University of Science and Technology (MUST)</span>
    </p>

    {/* Strategic Founder Vision Statement */}
    <p style={{
      color: '#94a3b8',
      lineHeight: '1.75',
      fontSize: '15.5px',
      margin: 0,
      textAlign: 'justify',
      textJustify: 'inter-word'
    }}>
      Driven by educational expertise from MUST and an intense passion for
      grassroots socioeconomic scaling, I designed Captain Microfinance to
      blend modern administrative efficiency with accessible credit
      parameters. We strip away bureaucratic lag to empower enterprise
      operators directly.
    </p>
  </div>
</section>


      {/* 6. PUBLIC FOOTER */}
      <footer
        style={{
          backgroundColor: "#0f172a",
          color: "#94a3b8",
          borderTop: "1px solid #334155",
          padding: "60px 20px 30px 20px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          {/* UPPER FOOTER GRID SECTION */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "40px",
              marginBottom: "50px",
              textAlign: "left",
            }}
          >
            {/* COLUMN 1: BRAND IDENTITY */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <h3
                style={{
                  color: "#fff",
                  fontSize: "1.4rem",
                  fontWeight: "800",
                  margin: 0,
                  letterSpacing: "-0.5px",
                }}
              >
                Captain <span style={{ color: "#38bdf8" }}>Microfinance</span>
              </h3>
              <p
                style={{
                  fontSize: "13px",
                  lineHeight: "1.6",
                  margin: 0,
                  color: "#94a3b8",
                }}
              >
                Empowering student ventures and driving local growth through
                digital fintech acceleration strategies.
              </p>
            </div>

            {/* COLUMN 2: QUICK CHANNELS */}
            <div>
              <h4
                style={{
                  color: "#fff",
                  fontSize: "0.9rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  margin: "0 0 16px 0",
                }}
              >
                Direct Channels
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                {/* Voice Connection */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <span style={{ fontSize: "1.2rem" }}>📞</span>
                  <div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#64748b",
                        fontWeight: "600",
                      }}
                    >
                      VOICE CALL
                    </div>
                    <a
                      href="tel:+255622571211"
                      style={{
                        color: "#38bdf8",
                        fontWeight: "600",
                        textDecoration: "none",
                        fontSize: "14px",
                      }}
                    >
                      +255 622 571 211
                    </a>
                  </div>
                </div>

                {/* WhatsApp Connection */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <span style={{ fontSize: "1.2rem" }}>💬</span>
                  <div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#64748b",
                        fontWeight: "600",
                      }}
                    >
                      WHATSAPP CHAT
                    </div>
                    <a
                      href="https://wa.me"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#4ade80",
                        fontWeight: "600",
                        textDecoration: "none",
                        fontSize: "14px",
                      }}
                    >
                      +255 757 956 611
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 3: CORRESPONDENCE ADDRESS */}
            <div>
              <h4
                style={{
                  color: "#fff",
                  fontSize: "0.9rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  margin: "0 0 16px 0",
                }}
              >
                Official Correspondence
              </h4>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginTop: "14px",
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>✉️</span>
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      fontWeight: "600",
                    }}
                  >
                    EMAIL INQUIRIES
                  </div>
                  <a
                    href="mailto:cosmasssamwel2023@gmail.com"
                    style={{
                      color: "#38bdf8",
                      fontWeight: "600",
                      textDecoration: "none",
                      fontSize: "13px",
                    }}
                  >
                    cosmasssamwel2023@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM METRICS & LEGAL ROW */}
          <div
            style={{
              borderTop: "1px solid #334155",
              paddingTop: "30px",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
              fontSize: "13px",
            }}
          >
            <p style={{ margin: 0, color: "#64748b" }}>
              &copy; {new Date().getFullYear()}{" "}
              <strong>Captain Microfinance</strong>. All rights reserved.
            </p>
            <div
              style={{
                backgroundColor: "#1e293b",
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "600",
                color: "#cbd5e1",
                border: "1px solid #334155",
              }}
            >
              A MUST Student Entrepreneurial Fintech Initiative
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
