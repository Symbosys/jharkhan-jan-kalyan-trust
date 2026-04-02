"use client";

import React from "react";
import { format } from "date-fns";

interface ResultCardProps {
    participant: {
        name: string;
        registrationNumber: string;
        school: string;
        class: string;
        board: string;
        photo: { url: string; public_id: string } | null;
        examResult?: {
            marks: number;
        } | null;
    };
    cardRef: React.RefObject<HTMLDivElement | null>;
    maxMarks?: number;
}

export const ResultCard: React.FC<ResultCardProps> = ({
    participant,
    cardRef,
    maxMarks = 100,
}) => {
    // Get initials for avatar if no photo
    const getInitials = (name: string) => {
        const names = name.split(' ');
        return names.map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
    };

    const borderColor = "#1a1a1a";
    const headerBg = "#065f46"; // Emerald/Green theme for results
    const labelBg = "#f8fafc";
    const fontFamily = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";

    const marks = participant.examResult?.marks ?? 0;
    const percentage = (marks / maxMarks) * 100;

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
                    {/* Organization Logo */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{
                            width: 90,
                            height: 90,
                            borderRadius: "50%",
                            overflow: "hidden",
                            border: "2px solid #059669",
                            flexShrink: 0,
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
                        <span style={{ fontSize: 9, fontWeight: 700, color: "#475569", marginTop: 4 }}>
                            Regd. Under Govt. of Jharkhand
                        </span>
                    </div>

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
                            Examination Scorecard
                        </span>
                        <span style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#475569",
                        }}>
                            General Knowledge Competition 2026
                        </span>
                    </div>

                    {/* Badge/Year */}
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        minWidth: 100,
                        gap: 4,
                    }}>
                        <div style={{
                            width: 70,
                            height: 70,
                            backgroundColor: headerBg,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#ffffff",
                            fontSize: 24,
                            fontWeight: 900,
                            border: "4px double #ffffff",
                            boxShadow: "0 0 0 2px " + headerBg,
                        }}>
                            2026
                        </div>
                        <span style={{
                            fontSize: 12,
                            fontWeight: 800,
                            color: headerBg,
                            textTransform: "uppercase",
                        }}>
                            Session
                        </span>
                    </div>
                </div>

                {/* ===== CANDIDATE INFO SECTION ===== */}
                <div style={{
                    display: "flex",
                    borderBottom: `2px solid ${borderColor}`,
                }}>
                    {/* Left: Details */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                        {[
                            { label: "Candidate Name", value: participant.name },
                            { label: "Registration No.", value: participant.registrationNumber, highlight: true },
                            { label: "Institution/School", value: participant.school },
                            { label: "Class & Board", value: `Class ${participant.class} (${participant.board})` },
                        ].map((item, idx) => (
                            <div key={idx} style={{
                                display: "flex",
                                borderBottom: idx === 3 ? "none" : `1px solid ${borderColor}`,
                                minHeight: 48,
                            }}>
                                <div style={{
                                    width: 180,
                                    backgroundColor: labelBg,
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "8px 14px",
                                    borderRight: `1px solid ${borderColor}`,
                                    fontWeight: 700,
                                    fontSize: 14,
                                    color: "#334155",
                                    textTransform: "uppercase",
                                }}>
                                    {item.label}
                                </div>
                                <div style={{
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "8px 14px",
                                    fontSize: 16,
                                    fontWeight: item.highlight ? 800 : 600,
                                    color: item.highlight ? "#059669" : "#0f172a",
                                }}>
                                    {item.value}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right: Photo */}
                    <div style={{
                        width: 200,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 15,
                        backgroundColor: "#fafafa",
                        borderLeft: `1px solid ${borderColor}`,
                    }}>
                        <div style={{
                            width: 160,
                            height: 180,
                            border: `2px solid ${borderColor}`,
                            borderRadius: 4,
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#ffffff",
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
                                    backgroundColor: "#f1f5f9",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexDirection: "column",
                                }}>
                                    <span style={{ fontSize: 48, fontWeight: 900, color: "#cbd5e1" }}>
                                        {getInitials(participant.name)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ===== RESULTS TABLE SECTION ===== */}
                <div style={{ padding: "40px 25px", flex: 1 }}>
                    <div style={{
                        textAlign: "center",
                        marginBottom: 30,
                    }}>
                        <span style={{
                            fontSize: 20,
                            fontWeight: 800,
                            color: "#0f172a",
                            textTransform: "uppercase",
                            letterSpacing: "4px",
                            borderBottom: `2px solid ${headerBg}`,
                            paddingBottom: 4,
                        }}>
                            Performance Analysis
                        </span>
                    </div>

                    <table style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        marginBottom: 40,
                    }}>
                        <thead>
                            <tr style={{ backgroundColor: headerBg, color: "#ffffff" }}>
                                <th style={{ padding: "12px", border: `1px solid ${borderColor}`, textAlign: "left" }}>Subject</th>
                                <th style={{ padding: "12px", border: `1px solid ${borderColor}`, textAlign: "center" }}>Max Marks</th>
                                <th style={{ padding: "12px", border: `1px solid ${borderColor}`, textAlign: "center" }}>Marks Obtained</th>
                                <th style={{ padding: "12px", border: `1px solid ${borderColor}`, textAlign: "center" }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ padding: "15px", border: `1px solid ${borderColor}`, fontWeight: 600 }}>General Knowledge Competition</td>
                                <td style={{ padding: "15px", border: `1px solid ${borderColor}`, textAlign: "center" }}>{maxMarks}</td>
                                <td style={{ padding: "15px", border: `1px solid ${borderColor}`, textAlign: "center", fontSize: 20, fontWeight: 800, color: "#059669" }}>
                                    {participant.examResult ? participant.examResult.marks : "AWAITED"}
                                </td>
                                <td style={{ padding: "15px", border: `1px solid ${borderColor}`, textAlign: "center" }}>
                                    {participant.examResult ? (
                                        <span style={{
                                            padding: "4px 12px",
                                            borderRadius: "12px",
                                            backgroundColor: marks >= (maxMarks * 0.33) ? "#dcfce7" : "#fee2e2",
                                            color: marks >= (maxMarks * 0.33) ? "#166534" : "#991b1b",
                                            fontWeight: 700,
                                            fontSize: 12,
                                        }}>
                                            {marks >= (maxMarks * 0.33) ? "PASSED" : "FAILED"}
                                        </span>
                                    ) : (
                                        "—"
                                    )}
                                </td>
                            </tr>
                            {/* Empty total row for aesthetic */}
                            <tr style={{ backgroundColor: labelBg }}>
                                <td style={{ padding: "15px", border: `1px solid ${borderColor}`, fontWeight: 800 }}>GRAND TOTAL</td>
                                <td style={{ padding: "15px", border: `1px solid ${borderColor}`, textAlign: "center", fontWeight: 800 }}>{maxMarks}</td>
                                <td style={{ padding: "15px", border: `1px solid ${borderColor}`, textAlign: "center", fontWeight: 800, fontSize: 24 }}>
                                    {participant.examResult ? participant.examResult.marks : "—"}
                                </td>
                                <td style={{ padding: "15px", border: `1px solid ${borderColor}`, textAlign: "center", fontWeight: 800 }}>
                                    {participant.examResult ? `${percentage.toFixed(2)}%` : "—"}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Summary Info */}
                    <div style={{
                        backgroundColor: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                        padding: "20px",
                        borderRadius: "12px",
                        marginBottom: 40,
                    }}>
                        <h4 style={{ margin: "0 0 10px 0", color: "#166534", fontSize: 16 }}>Performance Summary</h4>
                        <p style={{ margin: 0, fontSize: 13, color: "#166534", lineHeight: 1.6 }}>
                            This scorecard is issued for the participation in the GK Competition 2026. 
                            The result is based on the evaluation of the response sheet submitted by the candidate. 
                            Jharkhand Jan Kalyan Trust congratulates all successful candidates.
                        </p>
                    </div>

                    {/* Signatures */}
                    <div style={{
                        marginTop: 60,
                        display: "flex",
                        justifyContent: "flex-end",
                        padding: "0 40px",
                    }}>
                        <div style={{ textAlign: "center", width: 200 }}>
                            <div style={{ height: 60, display: "flex", alignItems: "end", justifyContent: "center" }}>
                                <img src="/signature/secretry.jpeg" alt="Controller Signature" style={{ maxHeight: "80%", opacity: 0.8, filter: "grayscale(1) contrast(1.2)" }} />
                            </div>
                            <div style={{ borderTop: `1px solid ${borderColor}`, paddingTop: 8, fontSize: 13, fontWeight: 800, textTransform: "uppercase" }}>
                                Authorized Signature
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== FOOTER SECTION ===== */}
                <div style={{
                    backgroundColor: "#f8fafc",
                    padding: "15px 25px",
                    borderTop: `2px solid ${borderColor}`,
                    textAlign: "center",
                }}>
                    <p style={{ margin: 0, fontSize: 11, color: "#64748b", fontStyle: "italic" }}>
                        This is a system-generated result card. Verification can be done online at the official trust portal.
                        Generated on: {format(new Date(), "PPP HH:mm:ss")}
                    </p>
                </div>
            </div>
        </div>
    );
};
