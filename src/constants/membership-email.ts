export const membershipPendingEmailTemplate = (name: string, planName: string, membershipNumber: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Membership Application Received</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f7f6; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                    <tr>
                        <td align="center" style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 40px 20px;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 600;">Application Received</h1>
                            <p style="color: #bfdbfe; margin: 10px 0 0 0; font-size: 16px;">We have received your membership application.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="color: #2d3748; font-size: 20px; margin-top: 0; margin-bottom: 20px;">Hi ${name},</h2>
                            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                                Thank you for applying for the <strong>${planName}</strong> membership with Jharkhand Jan Kalyan Trust. We are excited about your interest in joining our community.
                            </p>
                            
                            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
                                <p style="color: #64748b; font-size: 14px; margin: 0; text-transform: uppercase; font-weight: 600;">Your Membership Number</p>
                                <h3 style="color: #0f172a; font-size: 24px; margin: 10px 0 0 0; letter-spacing: 1px;">${membershipNumber}</h3>
                            </div>
                            
                            <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px 20px; border-radius: 4px; margin-bottom: 30px;">
                                <p style="color: #1d4ed8; margin: 0; font-size: 15px; line-height: 1.5;">
                                    <strong>Status:</strong> Pending Verification. Our trust administrators are currently reviewing your application and payment details. We will notify you once approved.
                                </p>
                            </div>
                            
                            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0;">
                                Warm Regards,<br>
                                <strong style="color: #2d3748; display: inline-block; margin-top: 5px;">Jharkhand Jan Kalyan Trust</strong>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

export const membershipApprovedEmailTemplate = (name: string, planName: string, membershipNumber: string, expiresAt?: Date | null) => {
    const formattedDate = expiresAt ? new Date(expiresAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : 'Lifetime';
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Membership Verified & Approved</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f7f6; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                    <tr>
                        <td align="center" style="background: linear-gradient(135deg, #065f46 0%, #10b981 100%); padding: 40px 20px;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 600;">Membership Approved!</h1>
                            <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 16px;">Welcome to the Jharkhand Jan Kalyan Trust.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="color: #2d3748; font-size: 20px; margin-top: 0; margin-bottom: 20px;">Welcome, ${name}!</h2>
                            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                                We are delighted to inform you that your application for the <strong>${planName}</strong> membership has been successfully verified and approved.
                            </p>
                            
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 30px;">
                                <tr>
                                    <td style="padding: 20px; text-align: center; border-right: 1px solid #e2e8f0; width: 50%;">
                                        <p style="color: #64748b; font-size: 13px; margin: 0; text-transform: uppercase; font-weight: 600;">Membership Number</p>
                                        <h3 style="color: #0f172a; font-size: 18px; margin: 8px 0 0 0;">${membershipNumber}</h3>
                                    </td>
                                    <td style="padding: 20px; text-align: center; width: 50%;">
                                        <p style="color: #64748b; font-size: 13px; margin: 0; text-transform: uppercase; font-weight: 600;">Valid Until</p>
                                        <h3 style="color: #0f172a; font-size: 18px; margin: 8px 0 0 0;">${formattedDate}</h3>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                                You can now access all benefits associated with your membership plan. We are excited to have you on board to help create a more meaningful impact.
                            </p>
                            
                            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0;">
                                Best Regards,<br>
                                <strong style="color: #2d3748; display: inline-block; margin-top: 5px;">Jharkhand Jan Kalyan Trust</strong>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
};
