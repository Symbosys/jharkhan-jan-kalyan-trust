"use client";

import React from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Parisienne } from "next/font/google";

const parisienne = Parisienne({ weight: "400", subsets: ["latin"] });

interface RegistrationCardProps {
    participant: {
        name: string;
        registrationNumber: string;
        mobile: string;
        school: string;
        class: string;
        board: string;
        photo: { url: string; public_id: string } | null;
        createdAt: Date;
    };
    cardRef: React.RefObject<HTMLDivElement | null>;
}

export const RegistrationCard: React.FC<RegistrationCardProps> = ({ participant, cardRef }) => {
    const registrationDate = format(new Date(participant.createdAt), "dd/MM/yyyy");
    const competitionDate = "15/04/2026"; // Fixed competition date
    const competitionLocation = "Ranchi, Jharkhand"; // Fixed location
    
    // Get initials for avatar if no photo
    const getInitials = (name: string) => {
        const names = name.split(' ');
        return names.map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div
            ref={cardRef}
            style={{
                width: 1000,
                height: 700,
                position: "relative",
                overflow: "hidden",
                border: "14px solid #1e40af",
                backgroundColor: "#f0f9ff",
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
                backgroundColor: "#1e3a8a",
                clipPath: "polygon(0 0, 100% 0, 25% 100%, 0 100%)",
                zIndex: 1,
            }} />

            {/* ===== LAYER 2: Top Header Text (100% FIXED) ===== */}
            <div style={{
                position: "absolute",
                top: 40,
                left: 0,
                width: "100%",
                paddingLeft: 420,
                paddingRight: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2,
                boxSizing: "border-box",
            }}>
                <span style={{
                    fontFamily: "'Arial Narrow', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                    fontSize: 28,
                    fontWeight: 900,
                    color: "#0f172a",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                }}>
                    JHARKHAND JAN KALYAN TRUST
                </span>
            </div>

            {/* ===== LAYER 3: Blue Banner ("GK Competition Registration") ===== */}
            <div style={{
                position: "absolute",
                top: 105,
                left: 0,
                width: "100%",
                height: 130,
                backgroundColor: "#1e3a8a",
                borderBottom: "7px solid #1a1a1a",
                zIndex: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: 300,
                boxSizing: "border-box",
            }}>
                <span
                    className={parisienne.className}
                    style={{
                        fontSize: 85,
                        color: "#ffffff",
                        lineHeight: "1",
                        textShadow: "3px 3px 6px rgba(0,0,0,0.5)",
                        marginTop: -10,
                    }}
                >
                    GK Competition
                </span>
            </div>

            {/* ===== LAYER 4: Gold Banner ("Registration Card") ===== */}
            <div style={{
                position: "absolute",
                top: 242,
                left: 0,
                width: "100%",
                height: 42,
                backgroundColor: "#d97706",
                zIndex: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: 340,
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
                    Registration Card
                </span>
            </div>

            {/* ===== LAYER 5: Main Blue Polygon ===== */}
            <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 440,
                height: 550,
                backgroundColor: "#1e40af",
                clipPath: "polygon(0 0, 100% 0, 36.3% 100%, 0 100%)",
                zIndex: 10,
            }} />

            {/* ===== LAYER 6: Logo & Profile Picture inside the Blue Area ===== */}
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
                    border: "4px solid #fbbf24",
                    backgroundColor: "#ffffff",
                    padding: 5,
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                }}>
                    {participant.photo ? (
                        <img
                            src={participant.photo.url}
                            alt={participant.name}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: "50%",
                            }}
                        />
                    ) : (
                        <div style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            backgroundColor: "#3b82f6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            <span style={{
                                fontSize: 48,
                                fontWeight: "bold",
                                color: "white",
                                fontFamily: "Arial, sans-serif",
                            }}>
                                {getInitials(participant.name)}
                            </span>
                        </div>
                    )}
                </div>

                <span style={{
                    color: "#fbbf24",
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

            {/* ===== LAYER 7: Participant Details ===== */}
            <div style={{
                position: "absolute",
                top: 300,
                left: 360,
                right: 40,
                display: "flex",
                flexDirection: "column",
                gap: 20,
                zIndex: 20,
            }}>
                {/* Registration Number */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                }}>
                    <span style={{
                        fontFamily: "Georgia, serif",
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#0f172a",
                        minWidth: 180,
                    }}>
                        Registration No:
                    </span>
                    <div style={{
                        flex: 1,
                        borderBottom: "2px solid #0f172a",
                        paddingBottom: 2,
                    }}>
                        <span style={{ 
                            fontSize: 20, 
                            fontWeight: "bold", 
                            color: "#dc2626",
                            fontFamily: "monospace"
                        }}>
                            {participant.registrationNumber}
                        </span>
                    </div>
                </div>

                {/* Name */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                }}>
                    <span style={{
                        fontFamily: "Georgia, serif",
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#0f172a",
                        minWidth: 180,
                    }}>
                        Participant Name:
                    </span>
                    <div style={{
                        flex: 1,
                        borderBottom: "2px solid #0f172a",
                        paddingBottom: 2,
                    }}>
                        <span style={{ fontSize: 20, fontWeight: "bold", color: "#0f172a" }}>
                            {participant.name}
                        </span>
                    </div>
                </div>

                {/* Mobile */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                }}>
                    <span style={{
                        fontFamily: "Georgia, serif",
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#0f172a",
                        minWidth: 180,
                    }}>
                        Mobile Number:
                    </span>
                    <div style={{
                        flex: 1,
                        borderBottom: "2px solid #0f172a",
                        paddingBottom: 2,
                    }}>
                        <span style={{ fontSize: 18, fontWeight: "bold", color: "#0f172a" }}>
                            {participant.mobile}
                        </span>
                    </div>
                </div>

                {/* School */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                }}>
                    <span style={{
                        fontFamily: "Georgia, serif",
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#0f172a",
                        minWidth: 180,
                    }}>
                        School/College:
                    </span>
                    <div style={{
                        flex: 1,
                        borderBottom: "2px solid #0f172a",
                        paddingBottom: 2,
                    }}>
                        <span style={{ fontSize: 18, fontWeight: "bold", color: "#0f172a" }}>
                            {participant.school}
                        </span>
                    </div>
                </div>

                {/* Class & Board */}
                <div style={{
                    display: "flex",
                    gap: 20,
                }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        flex: 1,
                    }}>
                        <span style={{
                            fontFamily: "Georgia, serif",
                            fontSize: 18,
                            fontWeight: "bold",
                            color: "#0f172a",
                            minWidth: 60,
                        }}>
                            Class:
                        </span>
                        <div style={{
                            flex: 1,
                            borderBottom: "2px solid #0f172a",
                            paddingBottom: 2,
                        }}>
                            <span style={{ fontSize: 18, fontWeight: "bold", color: "#0f172a" }}>
                                {participant.class}
                            </span>
                        </div>
                    </div>
                    
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        flex: 1,
                    }}>
                        <span style={{
                            fontFamily: "Georgia, serif",
                            fontSize: 18,
                            fontWeight: "bold",
                            color: "#0f172a",
                            minWidth: 70,
                        }}>
                            Board:
                        </span>
                        <div style={{
                            flex: 1,
                            borderBottom: "2px solid #0f172a",
                            paddingBottom: 2,
                        }}>
                            <span style={{ fontSize: 18, fontWeight: "bold", color: "#0f172a" }}>
                                {participant.board}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Competition Details */}
                <div style={{
                    display: "flex",
                    gap: 20,
                    marginTop: 10,
                }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        flex: 1,
                    }}>
                        <span style={{
                            fontFamily: "Georgia, serif",
                            fontSize: 16,
                            fontWeight: "bold",
                            color: "#0f172a",
                            minWidth: 60,
                        }}>
                            Date:
                        </span>
                        <div style={{
                            flex: 1,
                            borderBottom: "2px solid #0f172a",
                            paddingBottom: 2,
                        }}>
                            <span style={{ fontSize: 16, fontWeight: "bold", color: "#dc2626" }}>
                                {competitionDate}
                            </span>
                        </div>
                    </div>
                    
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        flex: 1.5,
                    }}>
                        <span style={{
                            fontFamily: "Georgia, serif",
                            fontSize: 16,
                            fontWeight: "bold",
                            color: "#0f172a",
                            minWidth: 90,
                        }}>
                            Location:
                        </span>
                        <div style={{
                            flex: 1,
                            borderBottom: "2px solid #0f172a",
                            paddingBottom: 2,
                        }}>
                            <span style={{ fontSize: 16, fontWeight: "bold", color: "#dc2626" }}>
                                {competitionLocation}
                            </span>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};