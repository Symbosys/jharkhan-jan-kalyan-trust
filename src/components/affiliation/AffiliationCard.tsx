import Image from "next/image";
import { forwardRef } from "react";

interface Affiliation {
    id: number;
    AffiliationNumber: string;
    organizationName: string;
    registrationNumber: string | null;
    establishedYear: number;
    organizationType: string;
    address: string;
    city: string;
    mobile: string;
    email: string;
    website: string | null;
    directorName: string;
    directorMobile: string;
    directorEmail: string | null;
    documents: any;
    validFrom: Date | null;
    validTill: Date | null;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: Date;
    updatedAt: Date;
}

interface AffiliationCardProps {
    affiliation: Affiliation;
    cardRef?: React.RefObject<HTMLDivElement>;
}

export const AffiliationCard = forwardRef<HTMLDivElement, AffiliationCardProps>(({ affiliation, cardRef }, ref) => {
    return (
        <div 
            ref={ref || cardRef}
            className="relative w-[800px] h-[550px] bg-white border-8 border-double border-teal-700 rounded-lg overflow-hidden shadow-2xl print:w-[297mm] print:h-[210mm]"
        >
            {/* Background decorations */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-teal-50 to-green-50 opacity-20"></div>
            
            {/* Wave decoration at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-teal-600 via-green-500 to-transparent opacity-30"></div>
            
            {/* Tree motif */}
            <div className="absolute right-12 top-8 bottom-8 w-48 opacity-10">
                <div className="w-full h-full bg-gradient-to-b from-amber-200 to-amber-100 rounded-full"></div>
            </div>

            <div className="relative z-10 p-12">
                {/* Header section */}
                <div className="flex justify-between items-start mb-10">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <div className="relative w-28 h-28 rounded-full border-4 border-yellow-500 overflow-hidden bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg">
                            <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-green-700 text-xl font-bold font-serif">TREE</div>
                                    <div className="text-yellow-600 text-lg font-bold font-serif mt-1">JJKT</div>
                                </div>
                            </div>
                            <div className="absolute inset-0 rounded-full border-2 border-yellow-500"></div>
                        </div>
                        <div className="text-center mt-2">
                            <div className="text-yellow-600 font-bold text-xs tracking-widest font-serif">
                                JHARKHAND JAN KALYAN TRUST
                            </div>
                        </div>
                    </div>

                    {/* Center title */}
                    <div className="flex-grow text-center px-8">
                        <h1 className="text-2xl font-bold text-blue-900 mb-2 font-serif">
                            JHARKHAND JAN KALYAN TRUST
                        </h1>
                        <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto"></div>
                    </div>

                    {/* Contact info */}
                    <div className="text-right flex-shrink-0">
                        <div className="text-blue-900 text-xs leading-relaxed font-serif">
                            <div>Add: Bank of India Opposite Street Kokar Ranchi</div>
                            <div>
                                <a href="http://www.jharkhandjankalyantrust.com" className="text-blue-700 underline">
                                    www.jharkhandjankalyantrust.com
                                </a>
                            </div>
                            <div>+91 84070 54027</div>
                        </div>
                    </div>
                </div>

                {/* Main certificate title */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-green-800 mb-3 border-b-2 border-green-800 pb-2 inline-block font-serif">
                        CERTIFICATE OF AFFILIATION
                    </h2>
                </div>

                {/* Certification text */}
                <div className="text-center mb-10">
                    <p className="text-gray-700 italic text-lg mb-3 font-serif">This is to certify that</p>
                    <div className="border-b-2 border-dotted border-gray-400 mb-5 mx-auto w-64"></div>
                    
                    <p className="text-gray-700 text-base leading-relaxed max-w-2xl mx-auto text-left font-serif px-8">
                        <span className="font-bold text-green-800">{affiliation.organizationName}</span> is officially affiliated with 
                        JHARKHAND JAN KALYAN TRUST for conducting educational and all social development programs 
                        under the guidance and support of the trust.
                    </p>
                </div>

                {/* Bottom section */}
                <div className="flex justify-between items-end mt-8">
                    {/* Fields section */}
                    <div className="space-y-3">
                        <div className="text-green-800 font-serif text-sm">
                            <span className="font-bold">Affiliation No.:</span> 
                            <span className="border-b border-dotted border-gray-400 ml-2 w-40 inline-block text-center">
                                {affiliation.AffiliationNumber}
                            </span>
                        </div>
                        <div className="text-green-800 font-serif text-sm">
                            <span className="font-bold">Date of Issue:</span> 
                            <span className="border-b border-dotted border-gray-400 ml-2 w-40 inline-block text-center">
                                {affiliation.validFrom ? new Date(affiliation.validFrom).toLocaleDateString('en-IN') : 'N/A'}
                            </span>
                        </div>
                        <div className="text-green-800 font-serif text-sm">
                            <span className="font-bold">Valid Till:</span> 
                            <span className="border-b border-dotted border-gray-400 ml-2 w-40 inline-block text-center">
                                {affiliation.validTill ? new Date(affiliation.validTill).toLocaleDateString('en-IN') : 'N/A'}
                            </span>
                        </div>
                    </div>

                    {/* Signature section */}
                    <div className="text-right">
                        <div className="mb-6">
                            <div className="w-40 h-16 border-b border-gray-400 mb-2 flex items-end justify-center">
                                <div className="text-blue-700 font-serif text-sm italic">Signature</div>
                            </div>
                            <div className="text-gray-600 italic text-xs font-serif">Authorised Signature</div>
                            <div className="text-gray-600 italic text-[10px] font-serif">(Chairman)</div>
                        </div>
                        <div className="text-blue-900 font-bold text-base font-serif">
                            JHARKHAND JAN KALYAN TRUST
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative border corners */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-teal-700"></div>
            <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-teal-700"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-teal-700"></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-teal-700"></div>
        </div>
    );
});

AffiliationCard.displayName = 'AffiliationCard';