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
                border: "14px solid #ce2521",
                backgroundColor: "#fdf8cd",
                fontFamily: "Georgia, 'Times New Roman', serif",
                userSelect: "none",
                boxSizing: "border-box",
            }}
        >
            {/* ===== LAYER 1: Bottom-Left Blue Polygon ===== */}
            <div style={{
                position: "absolute",
                left: 0,
                bottom: 0,
                width: 320,
                height: 300,
                backgroundColor: "#36338b",
                clipPath: "polygon(0 0, 100% 0, 25% 100%, 0 100%)",
                zIndex: 1,
            }} />

            {/* ===== LAYER 2: Top Header Text (100% FIXED) ===== */}
            <div style={{
                position: "absolute",
                top: 40,
                left: 0,
                width: "100%",
                paddingLeft: 420, // Pushes past the green polygon
                paddingRight: 20, // Small margin on the right
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2,
                boxSizing: "border-box",
            }}>
                <span style={{
                    fontFamily: "'Arial Narrow', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                    fontSize: 28, // Safe size to prevent wrapping or cutting off
                    fontWeight: 900,
                    color: "#0e0e0e",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                }}>
                    JHARKHAND JAN KALYAN TRUST
                </span>
            </div>

            {/* ===== LAYER 3: Blue Banner ("Certificate") ===== */}
            <div style={{
                position: "absolute",
                top: 105,
                left: 0,
                width: "100%",
                height: 130,
                backgroundColor: "#36338b",
                borderBottom: "7px solid #1a1a1a",
                zIndex: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: 400, // Centers it within the visible blue area
                boxSizing: "border-box",
            }}>
                <span
                    className={parisienne.className}
                    style={{
                        fontSize: 105,
                        color: "#ffffff",
                        lineHeight: "1",
                        textShadow: "3px 3px 6px rgba(0,0,0,0.5)",
                        marginTop: -15,
                    }}
                >
                    Certificate
                </span>
            </div>

            {/* ===== LAYER 4: Gold Banner ("of Membership Card") ===== */}
            <div style={{
                position: "absolute",
                top: 242,
                left: 0,
                width: "100%",
                height: 42,
                backgroundColor: "#cba962",
                zIndex: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: 340, // Centers it within the visible gold area
                boxSizing: "border-box",
            }}>
                <span
                    style={{
                        fontFamily: "Georgia, serif",
                        fontSize: 30,
                        fontWeight: "bold",
                        fontStyle: "italic",
                        color: "#ffffff",
                        WebkitTextStroke: "1px #000",
                        textShadow: "2px 2px 4px rgba(0,0,0,0.4)",
                        letterSpacing: "1px",
                    }}
                >
                    of Membership Card
                </span>
            </div>

            {/* ===== LAYER 5: Main Green Polygon ===== */}
            <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 440,
                height: 550,
                backgroundColor: "#0a6f36",
                clipPath: "polygon(0 0, 100% 0, 36.3% 100%, 0 100%)",
                zIndex: 10,
            }} />

            {/* ===== LAYER 6: Logo & Text inside the Green Area ===== */}
            <div style={{
                position: "absolute",
                top: 30,
                left: 35,
                width: 220,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: 11,
            }}>
                <div style={{
                    position: "absolute",
                    top: 15,
                    width: 150,
                    height: 150,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    filter: "blur(25px)",
                    zIndex: 0,
                }} />

                <div style={{
                    width: 140,
                    height: 140,
                    borderRadius: "50%",
                    border: "4px solid #ceab5f",
                    backgroundColor: "#ffffff",
                    padding: 5,
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <Image
                        src="/logo/logo.jpeg"
                        alt="JJKT Logo"
                        width={125}
                        height={125}
                        style={{ objectFit: "contain", borderRadius: "50%" }}
                    />
                </div>

                <span style={{
                    color: "#e8ca31",
                    fontSize: 13,
                    fontWeight: 800,
                    textAlign: "center",
                    marginTop: 18,
                    zIndex: 1,
                    letterSpacing: "0.5px",
                }}>
                    JHARKHAND JAN KALYAN TRUST
                </span>
            </div>

            {/* ===== LAYER 7: Main Body Texts (100% Safe Alignment) ===== */}
            <div style={{
                position: "absolute",
                top: 320,
                left: 360, // Mathematically clears the blue and green shapes
                right: 40,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 28,
                zIndex: 20,
            }}>
                <span style={{
                    fontFamily: "Georgia, serif",
                    fontStyle: "italic",
                    fontWeight: "bold",
                    color: "#000000",
                    fontSize: 26,
                }}>
                    This is to certify that
                </span>

                <div style={{
                    display: "flex",
                    alignItems: "baseline",
                    width: "100%",
                    gap: 12,
                }}>
                    <span style={{
                        fontFamily: "Georgia, serif",
                        fontStyle: "italic",
                        fontWeight: "bold",
                        color: "#000000",
                        fontSize: 22,
                        whiteSpace: "nowrap",
                    }}>
                        Mr./Mrs.
                    </span>
                    <div style={{
                        flex: 1,
                        borderBottom: "2px solid #000000",
                        textAlign: "center",
                        paddingBottom: 2,
                    }}>
                        <span style={{ fontSize: 24, fontWeight: "bold", color: "#000000" }}>
                            {member.name}
                        </span>
                    </div>
                </div>

                <span style={{
                    fontFamily: "Georgia, serif",
                    fontStyle: "italic",
                    fontWeight: "bold",
                    color: "#000000",
                    fontSize: 22,
                    whiteSpace: "nowrap",
                }}>
                    has Taken membership for Jharkhand Jan Kalyan Trust
                </span>

                <div style={{
                    display: "flex",
                    alignItems: "baseline",
                    width: "100%",
                    gap: 12,
                }}>
                    <span style={{
                        fontFamily: "Georgia, serif",
                        fontStyle: "italic",
                        fontWeight: "bold",
                        color: "#000000",
                        fontSize: 22,
                        whiteSpace: "nowrap",
                    }}>
                        Valid up to
                    </span>
                    <div style={{
                        flex: 1,
                        borderBottom: "2px solid #000000",
                        textAlign: "center",
                        paddingBottom: 2,
                    }}>
                        <span style={{ fontSize: 22, fontWeight: "bold", color: "#000000" }}>
                            {startDate}
                        </span>
                    </div>
                    <span style={{
                        fontFamily: "Georgia, serif",
                        fontStyle: "italic",
                        fontWeight: "bold",
                        color: "#000000",
                        fontSize: 22,
                        padding: "0 10px",
                    }}>
                        to
                    </span>
                    <div style={{
                        flex: 1,
                        borderBottom: "2px solid #000000",
                        textAlign: "center",
                        paddingBottom: 2,
                    }}>
                        <span style={{ fontSize: 22, fontWeight: "bold", color: "#000000" }}>
                            {expiryDate}
                        </span>
                    </div>
                </div>
            </div>

            {/* ===== LAYER 8: Signatures (100% Fixed Positioning) ===== */}

            {/* Secretary Box */}
            <div style={{
                position: "absolute",
                bottom: 30,
                left: 260, // Perfectly clears the blue triangle and aligns under text
                width: 200,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: 10,
            }}>
                <span style={{
                    fontFamily: "Georgia, serif",
                    fontSize: 18,
                    fontStyle: "italic",
                    fontWeight: "bold",
                    color: "#000000",
                    marginBottom: 6,
                }}>
                    Secretary
                </span>
                <div style={{
                    width: 180,
                    height: 45,
                    borderRadius: 25,
                    backgroundColor: "#ffffff",
                    border: "1px solid #d3d3d3",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/signature/secretry.jpeg"
                        alt="Secretary Signature"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            mixBlendMode: "multiply",
                        }}
                    />
                </div>
            </div>

            {/* President Box */}
            <div style={{
                position: "absolute",
                bottom: 30,
                right: 80, // Perfectly balances symmetrically
                width: 200,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: 10,
            }}>
                <span style={{
                    fontFamily: "Georgia, serif",
                    fontSize: 18,
                    fontStyle: "italic",
                    fontWeight: "bold",
                    color: "#000000",
                    marginBottom: 6,
                }}>
                    President
                </span>
                <div style={{
                    width: 180,
                    height: 45,
                    borderRadius: 25,
                    backgroundColor: "#ffffff",
                    border: "1px solid #d3d3d3",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/signature/president.jpeg"
                        alt="President Signature"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            mixBlendMode: "multiply",
                        }}
                    />
                </div>
            </div>
        </div>
    );
};