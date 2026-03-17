import React, { forwardRef } from "react";

interface Affiliation {
  organizationName: string;
  AffiliationNumber: string;
  validFrom: Date | null;
  validTill: Date | null;
}

interface AffiliationCardProps {
  affiliation: Affiliation;
  cardRef?: React.RefObject<HTMLDivElement>;
}

export const AffiliationCard = forwardRef<HTMLDivElement, AffiliationCardProps>(({ affiliation, cardRef }, ref) => {
  const formatDate = (date: Date | null) => {
    if (!date) return "....................................................";
    return new Date(date).toLocaleDateString("en-IN");
  };

  return (
    // Added min-w and min-h so the external website layout cannot shrink or break the certificate
    <div className="w-full overflow-x-auto pb-10 flex justify-center">
      <div
        ref={ref || cardRef}
        className="relative w-[1123px] min-w-[1123px] h-[794px] min-h-[794px] bg-white overflow-hidden shadow-2xl shrink-0 print:shadow-none box-border"
        style={{ fontFamily: "'Times New Roman', Times, serif" }}
      >
        {/* ================= BACKGROUND GRAPHICS (THE SWOOSHES) ================= */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1123 794" preserveAspectRatio="none">
          <defs>
            <linearGradient id="topTeal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0b4b45" />
              <stop offset="100%" stopColor="#1e8175" />
            </linearGradient>
            <linearGradient id="bottomDarkBlue" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#073a68" />
              <stop offset="100%" stopColor="#032142" />
            </linearGradient>
            <linearGradient id="bottomLightBlue" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0d6fb8" />
              <stop offset="100%" stopColor="#084f88" />
            </linearGradient>
            <linearGradient id="bottomTeal" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0d5c56" />
              <stop offset="100%" stopColor="#1a9187" />
            </linearGradient>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d4af37" />
              <stop offset="50%" stopColor="#fff3cd" />
              <stop offset="100%" stopColor="#b58d19" />
            </linearGradient>
          </defs>

          {/* Top Left Swooshes */}
          <path d="M 0 0 L 500 0 C 350 50, 200 150, 0 350 Z" fill="url(#topTeal)" />
          <path d="M 0 0 L 480 0 C 330 60, 180 160, 0 330 Z" fill="#0b4b45" />
          <path d="M 0 0 L 460 0 C 310 70, 160 170, 0 310 Z" fill="none" stroke="url(#goldGradient)" strokeWidth="4" />

          {/* Bottom Right Swooshes */}
          <path d="M -50 850 C 300 700, 700 800, 1123 450 L 1123 794 L 0 794 Z" fill="none" stroke="url(#goldGradient)" strokeWidth="6" />
          <path d="M -50 850 C 300 710, 700 810, 1123 460 L 1123 794 L 0 794 Z" fill="#b0d6cc" opacity="0.4" />
          <path d="M -50 850 C 350 720, 750 820, 1123 520 L 1123 794 L 0 794 Z" fill="url(#bottomTeal)" />
          <path d="M -50 850 C 400 760, 800 840, 1123 600 L 1123 794 L 0 794 Z" fill="url(#bottomDarkBlue)" />
          <path d="M -50 850 C 450 800, 850 860, 1123 680 L 1123 794 L 0 794 Z" fill="url(#bottomLightBlue)" />
        </svg>

        {/* ================= BORDERS ================= */}
        <div className="absolute inset-0 border-[3px] border-[#0a4b46] m-2 z-10 pointer-events-none"></div>
        <div className="absolute inset-0 border-[10px] m-[14px] z-10 pointer-events-none" style={{ borderImage: 'linear-gradient(to bottom right, #e6c875, #b8860b, #fdf0a6, #9e7305) 1' }}></div>
        <div className="absolute inset-0 border-[1px] border-[#0a4b46] m-[30px] z-10 pointer-events-none bg-white/40 mix-blend-overlay"></div>

        {/* ================= WATERMARK ================= */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-[0.08] z-0 pointer-events-none">
          <img 
            src="/logo/logo.jpeg" 
            alt="Tree Watermark" 
            className="w-[500px] h-[500px] object-contain mix-blend-multiply" 
          />
        </div>

        {/* ================= MAIN CONTENT ================= */}
        {/* Using absolute inset-0 with strict padding ensures content NEVER overflows the 794px height */}
        <div className="absolute inset-0 z-20 px-[80px] py-[65px] flex flex-col justify-between pointer-events-none">
          
          {/* HEADER: Logo & Trust Details */}
          <div className="flex justify-between items-start pointer-events-auto">
            {/* Logo */}
            <div className="w-[170px] h-[170px] rounded-full border-[6px] border-[#d4af37] bg-white flex flex-col items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.2)] overflow-hidden relative shrink-0">
              <div className="absolute inset-1 border-[1px] border-[#d4af37] rounded-full"></div>
              <img src="/logo/logo.jpeg" alt="JJKT Logo" className="absolute inset-0 w-full h-full object-cover" />
            </div>

            {/* Trust Details */}
            <div className="flex-1 text-right mt-4 pr-4">
              <h1 className="text-[34px] font-bold text-[#0a274c] tracking-[0.02em] uppercase leading-tight mb-2" style={{ textShadow: '0.5px 0.5px 0px rgba(0,0,0,0.1)' }}>
                JHARKHAND JAN KALYAN TRUST
              </h1>
              <div className="text-[14px] text-[#0a274c] space-y-1">
                <p><span className="font-bold text-[#083e75]">Add:</span> Bank of India Opposite Street Kokar Ranchi</p>
                <p>
                  <span className="font-bold text-[#083e75]">Website:</span> www.jharkhandjankalyantrust.com 
                  <span className="mx-2 text-gray-400">•</span> 
                  <span className="font-bold text-[#083e75]">Contact no:</span> +91 84070 54027
                </p>
              </div>
            </div>
          </div>

          {/* CERTIFICATE TITLE */}
          <div className="text-center mt-2 pointer-events-auto">
            <h2 className="text-[36px] font-bold text-[#114b46] tracking-[0.05em] uppercase pb-1 border-b-[1.5px] border-gray-300 inline-block px-4">
              CERTIFICATE OF AFFILIATION
            </h2>
            <div className="flex justify-center items-center mt-2 space-x-3">
               <div className="h-[1px] w-20 bg-gray-300"></div>
               <div className="w-2 h-2 rotate-45 bg-[#b58d19]"></div>
               <div className="h-[1px] w-20 bg-gray-300"></div>
            </div>
          </div>

          {/* BODY TEXT */}
          <div className="text-center flex-grow flex flex-col justify-center pointer-events-auto">
            <p className="text-[22px] italic text-gray-700 mb-6">This is to certify that</p>
            
            <div className="mb-8 flex justify-center">
              <div className="text-[30px] font-bold text-[#114b46] border-b-[2px] border-dotted border-gray-400 px-10 min-w-[550px] text-center pb-1">
                {affiliation.organizationName || "\u00A0"}
              </div>
            </div>

            <p className="text-[20px] text-gray-800 leading-[1.8] max-w-4xl mx-auto">
              is officially affiliated with <span className="font-bold text-[#114b46]">JHARKHAND JAN KALYAN TRUST</span><br />
              for conducting educational and all social development programs<br />
              under the guidance and support of the trust.
            </p>
          </div>

          {/* FOOTER: Details & Signature */}
          <div className="flex justify-between items-end w-full pointer-events-auto">
            
            {/* Form Fields */}
            <div className="space-y-4">
              <div className="flex items-end">
                <span className="font-bold text-[#114b46] text-[16px] w-32 mb-1">Affiliation No.:</span>
                <div className="border-b-[1.5px] border-dotted border-gray-500 w-[260px] text-center text-gray-800 text-[16px] pb-1">
                  {affiliation.AffiliationNumber || ""}
                </div>
              </div>
              <div className="flex items-end">
                <span className="font-bold text-[#114b46] text-[16px] w-32 mb-1">Date of Issue:</span>
                <div className="border-b-[1.5px] border-dotted border-gray-500 w-[260px] text-center text-gray-800 text-[16px] pb-1">
                  {formatDate(affiliation.validFrom)}
                </div>
              </div>
              <div className="flex items-end">
                <span className="font-bold text-[#114b46] text-[16px] w-32 mb-1">Valid Till:</span>
                <div className="border-b-[1.5px] border-dotted border-gray-500 w-[260px] text-center text-gray-800 text-[16px] pb-1">
                  {formatDate(affiliation.validTill)}
                </div>
              </div>
            </div>

            {/* Signature Block */}
            <div className="text-center w-[260px]">
              <div className="relative h-20 flex flex-col items-center justify-end border-b border-gray-400 pb-1 mb-2">
                <img 
                  src="/signature/president.jpeg" 
                  alt="Signature" 
                  className="absolute bottom-1 w-auto h-[60px] mix-blend-multiply opacity-80"
                />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[14px] italic font-semibold text-gray-800">Authorised Signature</span>
                <span className="text-[11px] text-gray-600 font-sans tracking-wide mt-1">(Chairman)</span>
                <span className="text-[13px] font-bold text-[#0a274c] mt-1 uppercase tracking-tight">JHARKHAND JAN KALYAN TRUST</span>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
});

AffiliationCard.displayName = 'AffiliationCard';