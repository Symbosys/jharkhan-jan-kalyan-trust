export const eventBookingPendingEmailTemplate = (name: string, eventName: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event Booking Received</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f7f6; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                    <tr>
                        <td align="center" style="background: linear-gradient(135deg, #4c51bf 0%, #6b46c1 100%); padding: 40px 20px;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 600;">Booking Request Received</h1>
                            <p style="color: #e9d8fd; margin: 10px 0 0 0; font-size: 16px;">We have received your event booking request.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="color: #2d3748; font-size: 20px; margin-top: 0; margin-bottom: 20px;">Hi ${name},</h2>
                            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                                Thank you for your interest in attending <strong>${eventName}</strong>. Your booking request has been successfully recorded and is currently in our system.
                            </p>
                            
                            <div style="background-color: #ebf4ff; border-left: 4px solid #4299e1; padding: 15px 20px; border-radius: 4px; margin-bottom: 30px;">
                                <p style="color: #2b6cb0; margin: 0; font-size: 15px; line-height: 1.5;">
                                    <strong>Status:</strong> Pending Approval. You will receive another notification once your seat is confirmed by our administrators.
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

export const eventBookingConfirmedEmailTemplate = (name: string, eventName: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event Booking Confirmed</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f7f6; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                    <tr>
                        <td align="center" style="background: linear-gradient(135deg, #047857 0%, #10b981 100%); padding: 40px 20px;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 600;">Booking Confirmed!</h1>
                            <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 16px;">Your seat is secured.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="color: #2d3748; font-size: 20px; margin-top: 0; margin-bottom: 20px;">Hello ${name},</h2>
                            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                                We are excited to inform you that your booking for <strong>${eventName}</strong> has been successfully confirmed!
                            </p>
                            
                            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                                We look forward to seeing you at the event. Please ensure to arrive on time and bring any necessary identification.
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

export const eventBookingCancelledEmailTemplate = (name: string, eventName: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event Booking Cancelled</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f7f6; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                    <tr>
                        <td align="center" style="background: linear-gradient(135deg, #c53030 0%, #e53e3e 100%); padding: 40px 20px;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 600;">Booking Cancelled</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="color: #2d3748; font-size: 20px; margin-top: 0; margin-bottom: 20px;">Dear ${name},</h2>
                            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                                We regret to inform you that your booking request for <strong>${eventName}</strong> has been cancelled.
                            </p>
                            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                                If you believe this is an error or have any questions regarding your cancellation, please contact our support team.
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
