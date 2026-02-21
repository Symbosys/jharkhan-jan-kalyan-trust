"use client";

import React from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Parisienne } from "next/font/google";

const parisienne = Parisienne({ weight: "400", subsets: ["latin"] });

interface MembershipCardProps {
    member: {
        name: string;
        memberShipNumber: string;
        createdAt: Date;
        expiresAt: Date | null;
    };
    cardRef: React.RefObject<HTMLDivElement | null>;
}

export const MembershipCard: React.FC<MembershipCardProps> = ({ member, cardRef }) => {
    const startDate = format(new Date(member.createdAt), "dd/MM/yyyy");
    const expiryDate = member.expiresAt ? format(new Date(member.expiresAt), "dd/MM/yyyy") : "Lifetime";

    return (
        <div
            ref={cardRef}
            style={{
                width: 1000,
                height: 700,
                position: "relative",
                overflow: "hidden",
                border: "14px solid #cc3333",
                fontFamily: "Georgia, 'Times New Roman', serif",
                userSelect: "none",
            }}
        >
            {/* ===== LAYER 0: Golden base background ===== */}
            <div style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "#c8a82e",
            }} />

            {/* ===== LAYER 1: Cream body — covers bottom-right with diagonal top edge ===== */}
            {/* In the target, cream covers: right side from ~25% down, left side from ~50% down */}
            <div style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "#f0dfa0",
                clipPath: "polygon(28% 28%, 100% 24%, 100% 100%, 0 100%, 0 50%)",
                zIndex: 1,
            }} />

            {/* ===== LAYER 2: Yellow accent (thin strip at edge of green triangle) ===== */}
            <div style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "#c8a82e",
                clipPath: "polygon(0 0, 24% 0, 2% 44%,  0 44%)",
                zIndex: 4,
            }} />

            {/* ===== LAYER 3: Green triangle (top-left corner) ===== */}
            {/* Target: compact triangle — ~21% wide at top, ~40% tall on left */}
            <div style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "#1b7a3a",
                clipPath: "polygon(0 0, 21% 0, 0 40%)",
                zIndex: 5,
            }} />

            {/* ===== LAYER 4: Dark green header bar ===== */}
            {/* Left edge diagonal: 22% at top, 18% at bottom. Full width to right. Height ~78px */}
            <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: 78,
                backgroundColor: "#1a2e1c",
                clipPath: "polygon(22% 0, 100% 0, 100% 100%, 18% 100%)",
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: 260,
                paddingRight: 30,
            }}>
                <span style={{
                    fontSize: 36,
                    fontWeight: 900,
                    color: "#c8a82e",
                    letterSpacing: "0.06em",
                    whiteSpace: "nowrap",
                }}>
                    JHARKHAND JAN KALYAN TRUST
                </span>
            </div>

            {/* ===== LAYER 5: Logo circle + text below ===== */}
            <div style={{
                position: "absolute",
                top: 6,
                left: 14,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: 30,
            }}>
                <div style={{
                    width: 148,
                    height: 148,
                    borderRadius: "50%",
                    backgroundColor: "#ffffff",
                    border: "5px solid #c8a82e",
                    padding: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 3px 10px rgba(0,0,0,0.12)",
                }}>
                    <Image
                        src="/logo/logo.jpeg"
                        alt="JJKT Logo"
                        width={122}
                        height={122}
                        style={{ objectFit: "contain", borderRadius: "50%" }}
                    />
                </div>
                <span style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: "#ffffff",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    marginTop: 2,
                    textAlign: "center",
                    lineHeight: "1.2",
                    textShadow: "0 1px 3px rgba(0,0,0,0.4)",
                }}>
                    JHARKHAND JAN KALYAN TRUST
                </span>
            </div>

            {/* ===== LAYER 6: Blue/purple Certificate banner ===== */}
            {/* Full-width diagonal stripe right below header bar */}
            <div style={{
                position: "absolute",
                top: 80,
                left: 0,
                width: "100%",
                height: 120,
                backgroundColor: "#2b2d78",
                clipPath: "polygon(0 18%, 100% 0, 100% 82%, 0 100%)",
                zIndex: 15,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <span
                    className={parisienne.className}
                    style={{
                        fontSize: 100,
                        color: "#ffffff",
                        lineHeight: "1",
                        textShadow: "2px 2px 4px rgba(0,0,0,0.4)",
                        marginLeft: 60,
                        marginTop: 8,
                        fontWeight: "500",
                        padding: 90,
                    }}
                >
                    Certificate
                </span>
            </div>

            {/* ===== LAYER 7: "of Membership Card" golden sub-banner ===== */}
            <div style={{
                position: "absolute",
                top: 190,
                left: "50%",
                transform: "translateX(-45%) skewX(-12deg)",
                backgroundColor: "#b89a28",
                height: 42,
                paddingLeft: 44,
                paddingRight: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(0,0,0,0.15)",
                zIndex: 20,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}>
                <span
                    className={parisienne.className}
                    style={{
                        fontSize: 32,
                        color: "#1a2e1c",
                        transform: "skewX(12deg)",
                        lineHeight: "1",
                        whiteSpace: "nowrap",
                        fontWeight: "bold",
                    }}
                >
                    of Membership Card
                </span>
            </div>

            {/* ===== LAYER 8: Main text content ===== */}
            <div style={{
                position: "absolute",
                top: 228,
                left: 0,
                right: 0,
                zIndex: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingLeft: 150,
                paddingRight: 90,
            }}>
                {/* "This is to certify that" */}
                <p style={{
                    fontSize: 26,
                    fontStyle: "italic",
                    color: "rgba(0,0,0,0.8)",
                    fontWeight: 600,
                    margin: "0 0 24px 0",
                }}>
                    This is to certify that
                </p>

                {/* "Mr./Mrs.  ___name___" */}
                <div style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 14,
                    width: "100%",
                    marginBottom: 20,
                }}>
                    <span style={{
                        fontSize: 22,
                        fontStyle: "italic",
                        color: "#000000",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                    }}>
                        Mr./Mrs.
                    </span>
                    <div style={{
                        flex: 1,
                        borderBottom: "2px solid rgba(0,0,0,0.35)",
                        paddingBottom: 3,
                        textAlign: "center",
                    }}>
                        <span style={{
                            fontSize: 25,
                            fontWeight: 700,
                            color: "#000000",
                            letterSpacing: "0.01em",
                        }}>
                            {member.name}
                        </span>
                    </div>
                </div>

                {/* "has Taken membership for Jharkhand Jan Kalyan Trust" */}
                <p style={{
                    fontSize: 20,
                    fontStyle: "italic",
                    color: "#000000",
                    fontWeight: 600,
                    margin: "8px 0 0 0",
                    whiteSpace: "nowrap",
                }}>
                    has Taken membership for Jharkhand Jan Kalyan Trust
                </p>

                {/* "Valid up to ___ to ___" */}
                <div style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 10,
                    width: "100%",
                    marginTop: 26,
                }}>
                    <span style={{
                        fontSize: 20,
                        fontStyle: "italic",
                        color: "#000000",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                    }}>
                        Valid up to
                    </span>
                    <div style={{
                        flex: 1,
                        borderBottom: "2px solid rgba(0,0,0,0.35)",
                        paddingBottom: 3,
                        textAlign: "center",
                    }}>
                        <span style={{ fontSize: 22, fontWeight: 700, color: "#000000" }}>
                            {startDate}
                        </span>
                    </div>
                    <span style={{
                        fontSize: 20,
                        fontStyle: "italic",
                        color: "#000000",
                        fontWeight: 600,
                        padding: "0 4px",
                    }}>
                        to
                    </span>
                    <div style={{
                        flex: 1,
                        borderBottom: "2px solid rgba(0,0,0,0.35)",
                        paddingBottom: 3,
                        textAlign: "center",
                    }}>
                        <span style={{ fontSize: 22, fontWeight: 700, color: "#000000" }}>
                            {expiryDate}
                        </span>
                    </div>
                </div>
            </div>

            {/* ===== LAYER 9: Signature section (bottom) ===== */}
            <div style={{
                position: "absolute",
                bottom: 16,
                left: 60,
                right: 60,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                zIndex: 20,
            }}>
                {/* Secretary */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                }}>
                    <span style={{
                        fontSize: 17,
                        fontStyle: "italic",
                        color: "rgba(0,0,0,0.7)",
                        fontWeight: 600,
                    }}>
                        Secretary
                    </span>
                    <div style={{
                        width: 240,
                        height: 100,
                        backgroundColor: "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/signature/secretry.jpeg"
                            alt="Secretary Signature"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                                mixBlendMode: "multiply"
                            }}
                        />
                    </div>
                </div>

                {/* President */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                }}>
                    <span style={{
                        fontSize: 17,
                        fontStyle: "italic",
                        color: "rgba(0,0,0,0.7)",
                        fontWeight: 600,
                    }}>
                        President
                    </span>
                    <div style={{
                        width: 240,
                        height: 100,
                        backgroundColor: "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/signature/president.jpeg"
                            alt="President Signature"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                                mixBlendMode: "multiply"
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
