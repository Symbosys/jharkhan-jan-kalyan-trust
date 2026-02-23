export const donationPendingEmailTemplate = (name: string, amount: number) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Donation Received - Pending Verification</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f7f6; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); padding: 40px 20px;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: 1px;">Thank You!</h1>
                            <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">We have received your donation details.</p>
                        </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px 40px 30px 40px;">
                            <h2 style="color: #2d3748; font-size: 22px; margin-top: 0; margin-bottom: 20px;">Dear ${name},</h2>
                            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                                We are writing to formally acknowledge the receipt of your generous donation of <strong>₹${amount}</strong> to the <strong>Jharkhand Jan Kalyan Trust</strong>. Your support is instrumental in driving our mission forward.
                            </p>
                            
                            <div style="background-color: #ebf8fa; border-left: 4px solid #3182ce; padding: 15px 20px; border-radius: 4px; margin-bottom: 25px;">
                                <p style="color: #2c5282; margin: 0; font-size: 15px; line-height: 1.5;">
                                    <strong>Status:</strong> Your payment is currently under review by our administration team. 
                                </p>
                            </div>
                            
                            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                                Rest assured, once the verification process is complete, you will receive another email confirming the successful processing of your donation, along with your official digital receipt.
                            </p>
                            
                            <!-- Divider -->
                            <hr style="border: none; border-top: 1px solid #e2e8f0; margin-bottom: 30px;">
                            
                            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0;">
                                Warm Regards,<br>
                                <strong style="color: #2d3748; display: inline-block; margin-top: 5px;">The Jharkhand Jan Kalyan Trust Team</strong>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background-color: #f7fafc; padding: 20px; border-top: 1px solid #edf2f7;">
                            <p style="color: #a0aec0; font-size: 13px; margin: 0;">
                                © ${new Date().getFullYear()} Jharkhand Jan Kalyan Trust. All rights reserved.
                            </p>
                            <p style="color: #a0aec0; font-size: 13px; margin: 5px 0 0 0;">
                                This is an automated email. Please do not reply directly to this message.
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

export const donationVerifiedEmailTemplate = (name: string, amount: number) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Donation Verified Successfully</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f7f6; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); padding: 40px 20px;">
                            <div style="background-color: rgba(255,255,255,0.2); width: 60px; height: 60px; border-radius: 50%; display: inline-block; padding: 10px; margin-bottom: 15px;">
                                <!-- Verification Tick SVG -->
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" width="60" height="60">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 600; letter-spacing: 0.5px;">Donation Verified</h1>
                        </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px 40px 30px 40px;">
                            <h2 style="color: #2d3748; font-size: 22px; margin-top: 0; margin-bottom: 20px;">Congratulations, ${name}!</h2>
                            
                            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                                We are thrilled to inform you that your generous donation of <strong>₹${amount}</strong> has been successfully verified by our administrative team.
                            </p>
                            
                            <div style="background-color: #f0fff4; border: 1px solid #c6f6d5; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
                                <p style="color: #2f855a; font-size: 14px; margin: 0; text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">Contribution Amount</p>
                                <h3 style="color: #276749; font-size: 32px; margin: 10px 0 0 0;">₹${amount}</h3>
                            </div>
                            
                            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                                Your selfless contribution empowers us to continue our vital work at the <strong>Jharkhand Jan Kalyan Trust</strong>. Your support truly makes a profound difference in the lives of those we serve, and for that, we are immeasurably grateful.
                            </p>
                            
                            <!-- Divider -->
                            <hr style="border: none; border-top: 1px solid #e2e8f0; margin-bottom: 30px;">
                            
                            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0;">
                                With Deepest Gratitude,<br>
                                <strong style="color: #2d3748; display: inline-block; margin-top: 5px;">The Jharkhand Jan Kalyan Trust Team</strong>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background-color: #f7fafc; padding: 20px; border-top: 1px solid #edf2f7;">
                            <p style="color: #a0aec0; font-size: 13px; margin: 0;">
                                © ${new Date().getFullYear()} Jharkhand Jan Kalyan Trust. All rights reserved.
                            </p>
                            <p style="color: #a0aec0; font-size: 13px; margin: 5px 0 0 0;">
                                Have questions? <a href="mailto:jharkhandjktrust2026@gmail.com" style="color: #4299e1; text-decoration: none;">Contact Us</a>
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
