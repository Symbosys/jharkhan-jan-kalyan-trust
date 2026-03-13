"use client";

import React from "react";

interface RegistrationCardProps {
    participant: {
        name: string;
        registrationNumber: string;
        mobile: string;
        email?: string;
        school: string;
        class: string;
        board: string;
        photo: { url: string; public_id: string } | null;
        createdAt: Date;
        examCenter?: {
            id: number;
            name: string;
            address: string;
            city: string;
            state: string;
            pinCode?: string;
        } | null;
    };
    cardRef: React.RefObject<HTMLDivElement | null>;
    competitionDate?: string;
    competitionTime?: string;
    competitionVenue?: string;
}

export const RegistrationCard: React.FC<RegistrationCardProps> = ({
    participant,
    cardRef,
    competitionDate = "15/04/2026",
    competitionTime = "10:00 AM - 12:00 PM",
    competitionVenue = "Ranchi, Jharkhand"
}) => {

    // Get initials for avatar if no photo
    const getInitials = (name: string) => {
        const names = name.split(' ');
        return names.map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
    };

    const borderColor = "#1a1a1a";
    const headerBg = "#1e3a8a";
    const labelBg = "#f1f5f9";
    const fontFamily = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";

    return (
        <div
            ref={cardRef}
            style={{
                width: 900,
                minHeight: 1200,
                backgroundColor: "#ffffff",
                fontFamily: fontFamily,
                userSelect: "none",
                boxSizing: "border-box",
                padding: 0,
                margin: 0,
            }}
        >
            {/* ===== OUTER BORDER ===== */}
            <div style={{
                border: `3px solid ${borderColor}`,
                margin: 10,
                padding: 0,
                minHeight: 1170,
                display: "flex",
                flexDirection: "column",
            }}>

                {/* ===== HEADER SECTION ===== */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "20px 25px",
                    borderBottom: `2px solid ${borderColor}`,
                    minHeight: 120,
                }}>
                    {/* Company Logo */}
                    <div><div style={{
                        width: 90,
                        height: 90,
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: "2px solid #d4a843",
                        flexShrink: 0,
                        marginLeft: 30
                    }}>
                        <img
                            src="/logo/logo.jpeg"
                            alt="JJKT Logo"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    </div>
                        <span className="text-[10px] font-semibold text-primary/80 tracking-wide mt-0. 5">( Registered Under Govt. of Jharkhand )</span></div>

                    {/* Center Title */}
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        flex: 1,
                        gap: 4,
                    }}>
                        <span style={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: "#0f172a",
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                        }}>
                            Jharkhand Jan Kalyan Trust
                        </span>
                        <span style={{
                            fontSize: 32,
                            fontWeight: 900,
                            color: headerBg,
                            letterSpacing: "2px",
                            textTransform: "uppercase",
                        }}>
                            GK Admit Card
                        </span>
                    </div>

                    {/* GK Competition Logo + Text */}
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        flexShrink: 0,
                        gap: 4,
                    }}>
                        <div style={{
                            width: 70,
                            height: 70,
                            borderRadius: "50%",
                            overflow: "hidden",
                            border: "2px solid #1e3a8a",
                        }}>
                            <img
                                src="/gk/gk-logo.jpeg"
                                alt="GK Logo"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        </div>
                        <span style={{
                            fontSize: 13,
                            fontWeight: 800,
                            color: "#dc2626",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            textAlign: "center",
                            lineHeight: "1.2",
                        }}>
                            GK Competition<br />Exam 2026
                        </span>
                    </div>
                </div>

                {/* ===== MAIN DETAILS TABLE ===== */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    borderBottom: `2px solid ${borderColor}`,
                }}>
                    {/* Top section: Fields + Photo */}
                    <div style={{ display: "flex" }}>
                        {/* Left: Fields */}
                        <div style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                        }}>
                            {/* Student Name */}
                            <div style={{
                                display: "flex",
                                borderBottom: `1px solid ${borderColor}`,
                                minHeight: 48,
                            }}>
                                <div style={{
                                    width: 220,
                                    backgroundColor: labelBg,
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "8px 14px",
                                    borderRight: `1px solid ${borderColor}`,
                                    fontWeight: 700,
                                    fontSize: 15,
                                    color: "#0f172a",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                }}>
                                    Student Name
                                </div>
                                <div style={{
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "8px 14px",
                                    fontSize: 16,
                                    fontWeight: 600,
                                    color: "#0f172a",
                                    borderRight: `1px solid ${borderColor}`,
                                }}>
                                    {participant.name}
                                </div>
                            </div>

                            {/* Registration Number */}
                            <div style={{
                                display: "flex",
                                borderBottom: `1px solid ${borderColor}`,
                                minHeight: 48,
                            }}>
                                <div style={{
                                    width: 220,
                                    backgroundColor: labelBg,
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "8px 14px",
                                    borderRight: `1px solid ${borderColor}`,
                                    fontWeight: 700,
                                    fontSize: 15,
                                    color: "#0f172a",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                }}>
                                    Registration Number
                                </div>
                                <div style={{
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "8px 14px",
                                    fontSize: 16,
                                    fontWeight: 700,
                                    color: "#dc2626",
                                    fontFamily: "monospace",
                                    borderRight: `1px solid ${borderColor}`,
                                }}>
                                    {participant.registrationNumber}
                                </div>
                            </div>

                            {/* Email Id */}
                            <div style={{
                                display: "flex",
                                borderBottom: `1px solid ${borderColor}`,
                                minHeight: 48,
                            }}>
                                <div style={{
                                    width: 220,
                                    backgroundColor: labelBg,
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "8px 14px",
                                    borderRight: `1px solid ${borderColor}`,
                                    fontWeight: 700,
                                    fontSize: 15,
                                    color: "#0f172a",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                }}>
                                    Email ID
                                </div>
                                <div style={{
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "8px 14px",
                                    fontSize: 15,
                                    fontWeight: 600,
                                    color: "#0f172a",
                                    borderRight: `1px solid ${borderColor}`,
                                }}>
                                    {participant.email || "—"}
                                </div>
                            </div>

                            {/* Mobile No. */}
                            <div style={{
                                display: "flex",
                                borderBottom: `1px solid ${borderColor}`,
                                minHeight: 48,
                            }}>
                                <div style={{
                                    width: 220,
                                    backgroundColor: labelBg,
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "8px 14px",
                                    borderRight: `1px solid ${borderColor}`,
                                    fontWeight: 700,
                                    fontSize: 15,
                                    color: "#0f172a",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                }}>
                                    Mobile No.
                                </div>
                                <div style={{
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "8px 14px",
                                    fontSize: 16,
                                    fontWeight: 600,
                                    color: "#0f172a",
                                    borderRight: `1px solid ${borderColor}`,
                                }}>
                                    {participant.mobile}
                                </div>
                            </div>
                        </div>

                        {/* Right: Photo */}
                        <div style={{
                            width: 200,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 15,
                            borderBottom: `1px solid ${borderColor}`,
                        }}>
                            <div style={{
                                width: 160,
                                height: 170,
                                border: `2px solid ${borderColor}`,
                                borderRadius: 4,
                                overflow: "hidden",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#f8fafc",
                            }}>
                                {participant.photo ? (
                                    <img
                                        src={participant.photo.url}
                                        alt={participant.name}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        width: "100%",
                                        height: "100%",
                                        backgroundColor: "#e2e8f0",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexDirection: "column",
                                        gap: 5,
                                    }}>
                                        <span style={{
                                            fontSize: 42,
                                            fontWeight: "bold",
                                            color: "#64748b",
                                            fontFamily: "Arial, sans-serif",
                                        }}>
                                            {getInitials(participant.name)}
                                        </span>
                                        <span style={{
                                            fontSize: 11,
                                            color: "#94a3b8",
                                            fontWeight: 600,
                                            textTransform: "uppercase",
                                            letterSpacing: "1px",
                                        }}>
                                            Photo
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Full-width rows below the photo area */}

                    {/* Student of School */}
                    <div style={{
                        display: "flex",
                        borderBottom: `1px solid ${borderColor}`,
                        minHeight: 48,
                    }}>
                        <div style={{
                            width: 220,
                            backgroundColor: labelBg,
                            display: "flex",
                            alignItems: "center",
                            padding: "8px 14px",
                            borderRight: `1px solid ${borderColor}`,
                            fontWeight: 700,
                            fontSize: 15,
                            color: "#0f172a",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                        }}>
                            Student of School
                        </div>
                        <div style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            padding: "8px 14px",
                            fontSize: 16,
                            fontWeight: 600,
                            color: "#0f172a",
                        }}>
                            {participant.school}
                        </div>
                    </div>

                    {/* Class / Board Row */}
                    <div style={{
                        display: "flex",
                        borderBottom: `1px solid ${borderColor}`,
                        minHeight: 48,
                    }}>
                        <div style={{
                            width: 220,
                            backgroundColor: labelBg,
                            display: "flex",
                            alignItems: "center",
                            padding: "8px 14px",
                            borderRight: `1px solid ${borderColor}`,
                            fontWeight: 700,
                            fontSize: 15,
                            color: "#0f172a",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                        }}>
                            Class / Board
                        </div>
                        <div style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            padding: "8px 14px",
                            fontSize: 16,
                            fontWeight: 600,
                            color: "#0f172a",
                        }}>
                            {participant.class} &nbsp;/&nbsp; {participant.board}
                        </div>
                    </div>


                    {/* Venue of Examination - Show Exam Center */}
                    <div style={{
                        display: "flex",
                        minHeight: 48,
                    }}>
                        <div style={{
                            width: 220,
                            backgroundColor: labelBg,
                            display: "flex",
                            alignItems: "center",
                            padding: "8px 14px",
                            borderRight: `1px solid ${borderColor}`,
                            fontWeight: 700,
                            fontSize: 15,
                            color: "#0f172a",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                        }}>
                            Venue of Examination
                        </div>
                        <div style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            padding: "8px 14px",
                            fontSize: 16,
                            fontWeight: 600,
                            color: "#dc2626",
                        }}>
                            {participant.examCenter ? (
                                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                    <span style={{ fontWeight: 700 }}>{participant.examCenter.name}</span>
                                    <span style={{ fontSize: 14, color: "#0f172a" }}>
                                        {participant.examCenter.address}, {participant.examCenter.city}, {participant.examCenter.state}
                                        {participant.examCenter.pinCode && ` - ${participant.examCenter.pinCode}`}
                                    </span>
                                </div>
                            ) : (
                                competitionVenue
                            )}
                        </div>
                    </div>
                </div>

                {/* ===== SUBJECT / DATE / TIME TABLE ===== */}
                <div style={{
                    borderBottom: `2px solid ${borderColor}`,
                }}>
                    {/* Header Row */}
                    <div style={{
                        display: "flex",
                        backgroundColor: headerBg,
                        minHeight: 48,
                    }}>
                        <div style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "10px 14px",
                            borderRight: `1px solid rgba(255,255,255,0.3)`,
                            fontWeight: 800,
                            fontSize: 17,
                            color: "#ffffff",
                            textTransform: "uppercase",
                            letterSpacing: "2px",
                        }}>
                            Subject
                        </div>
                        <div style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "10px 14px",
                            borderRight: `1px solid rgba(255,255,255,0.3)`,
                            fontWeight: 800,
                            fontSize: 17,
                            color: "#ffffff",
                            textTransform: "uppercase",
                            letterSpacing: "2px",
                        }}>
                            Date
                        </div>
                        <div style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "10px 14px",
                            fontWeight: 800,
                            fontSize: 17,
                            color: "#ffffff",
                            textTransform: "uppercase",
                            letterSpacing: "2px",
                        }}>
                            Time
                        </div>
                    </div>

                    {/* Data Row - GK Competition */}
                    <div style={{
                        display: "flex",
                        borderBottom: `1px solid ${borderColor}`,
                        minHeight: 48,
                    }}>
                        <div style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "10px 14px",
                            borderRight: `1px solid ${borderColor}`,
                            fontSize: 16,
                            fontWeight: 600,
                            color: "#0f172a",
                        }}>
                            General Knowledge
                        </div>
                        <div style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "10px 14px",
                            borderRight: `1px solid ${borderColor}`,
                            fontSize: 16,
                            fontWeight: 700,
                            color: "#dc2626",
                        }}>
                            {competitionDate}
                        </div>
                        <div style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "10px 14px",
                            fontSize: 16,
                            fontWeight: 700,
                            color: "#dc2626",
                        }}>
                            {competitionTime}
                        </div>
                    </div>

                    {/* Empty Row for potential additional subjects */}
                    <div style={{
                        display: "flex",
                        minHeight: 48,
                    }}>
                        <div style={{
                            flex: 1,
                            padding: "10px 14px",
                            borderRight: `1px solid ${borderColor}`,
                        }}>
                        </div>
                        <div style={{
                            flex: 1,
                            padding: "10px 14px",
                            borderRight: `1px solid ${borderColor}`,
                        }}>
                        </div>
                        <div style={{
                            flex: 1,
                            padding: "10px 14px",
                        }}>
                        </div>
                    </div>
                </div>

                {/* ===== INSTRUCTIONS SECTION ===== */}
                <div style={{
                    padding: "20px 25px",
                    flex: 1,
                }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 18,
                    }}>
                        <div style={{
                            width: 80,
                            height: 2,
                            backgroundColor: "#0f172a",
                            marginRight: 12,
                        }} />
                        <span style={{
                            fontSize: 20,
                            fontWeight: 800,
                            color: "#0f172a",
                            textTransform: "uppercase",
                            letterSpacing: "3px",
                        }}>
                            Instructions
                        </span>
                        <div style={{
                            width: 80,
                            height: 2,
                            backgroundColor: "#0f172a",
                            marginLeft: 12,
                        }} />
                    </div>

                    <div style={{
                        paddingLeft: 10,
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                    }}>
                        {[
                            "All candidates must bring their Admit Card to the examination hall.",
                            "Candidates should reach the examination center 30 minutes before the exam time.",
                            "Mobile phones, smart watches, or any electronic devices are strictly prohibited in the examination hall.",
                            "Use only blue or black ball pen to answer the questions.",
                            "Do not write anything on the question paper or admit card except where instructed.",
                            "Any kind of cheating or unfair means will lead to disqualification.",
                            "Candidates must follow all instructions given by the invigilator.",
                            "Maintain silence and discipline inside the examination hall.",
                            "No candidate will be allowed to leave the hall before the exam ends.",
                            "After completing the exam, submit your answer sheet to the invigilator.",
                        ].map((instruction, index) => (
                            <div key={index} style={{
                                display: "flex",
                                gap: 10,
                                alignItems: "flex-start",
                            }}>
                                <span style={{
                                    fontSize: 14,
                                    fontWeight: 800,
                                    color: "#1e3a8a",
                                    minWidth: 22,
                                    flexShrink: 0,
                                }}>
                                    {index + 1}.
                                </span>
                                <span style={{
                                    fontSize: 14,
                                    color: "#334155",
                                    lineHeight: "1.5",
                                    fontWeight: 500,
                                }}>
                                    {instruction}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>


            </div>
        </div>
    );
};