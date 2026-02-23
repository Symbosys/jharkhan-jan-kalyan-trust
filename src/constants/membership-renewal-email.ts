export const renewalPendingEmailTemplate = (name: string, planName: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Membership Renewal Request Received</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f7f6; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                    <tr>
                        <td align="center" style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px 20px;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 600;">Renewal Request Received</h1>
                            <p style="color: #dbeafe; margin: 10px 0 0 0; font-size: 16px;">Your membership renewal is under review.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="color: #2d3748; font-size: 20px; margin-top: 0; margin-bottom: 20px;">Hi ${name},</h2>
                            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                                We have successfully received your membership renewal request for the <strong>${planName}</strong> plan, along with your payment details.
                            </p>
                            
                            <div style="background-color: #fffaf0; border-left: 4px solid #ed8936; padding: 15px 20px; border-radius: 4px; margin-bottom: 30px;">
                                <p style="color: #c05621; margin: 0; font-size: 15px; line-height: 1.5;">
                                    <strong>Status:</strong> Pending Verification. Our trust administrators will review your payment shortly.
                                </p>
                            </div>
                            
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

export const renewalApprovedEmailTemplate = (name: string, planName: string, expiresAt: Date) => {
    const formattedDate = new Date(expiresAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Membership Renewal Approved</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f7f6; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                    <tr>
                        <td align="center" style="background: linear-gradient(135deg, #059669 0%, #34d399 100%); padding: 40px 20px;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 600;">Renewal Approved!</h1>
                            <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 16px;">Welcome back to the community.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="color: #2d3748; font-size: 20px; margin-top: 0; margin-bottom: 20px;">Welcome Back, ${name}!</h2>
                            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                                Your membership renewal request for the <strong>${planName}</strong> has been successfully approved.
                            </p>
                            
                            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
                                <p style="color: #166534; font-size: 14px; margin: 0; text-transform: uppercase; font-weight: 600;">New Expiration Date</p>
                                <h3 style="color: #15803d; font-size: 24px; margin: 10px 0 0 0;">${formattedDate}</h3>
                            </div>
                            
                            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                                Thank you for your continued support and dedication to our cause. Your active membership helps us create a more meaningful impact.
                            </p>
                            
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
};

export const renewalRejectedEmailTemplate = (name: string, planName: string, reason?: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Membership Renewal Request Rejected</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f7f6; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                    <tr>
                        <td align="center" style="background: linear-gradient(135deg, #b91c1c 0%, #f87171 100%); padding: 40px 20px;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 600;">Renewal Unsuccessful</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="color: #2d3748; font-size: 20px; margin-top: 0; margin-bottom: 20px;">Dear ${name},</h2>
                            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                                Unfortunately, we were unable to process your renewal request for the <strong>${planName}</strong> plan at this time.
                            </p>
                            
                            ${reason ? `
                            <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px 20px; border-radius: 4px; margin-bottom: 30px;">
                                <p style="color: #991b1b; margin: 0; font-size: 15px; line-height: 1.5;">
                                    <strong>Reason provided:</strong> ${reason}
                                </p>
                            </div>
                            ` : ''}
                            
                            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                                Please review your payment details or contact our administrative team for further assistance. We hope to resolve this quickly so you can continue your membership.
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
