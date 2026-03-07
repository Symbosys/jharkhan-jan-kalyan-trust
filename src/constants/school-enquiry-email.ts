export const schoolEnquiryEmailTemplate = (name: string, registrationNumber: string, school: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>School Enquiry Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f7f6; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); padding: 40px 20px;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: 1px;">Enquiry Received!</h1>
                            <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Your school enquiry has been successfully registered.</p>
                        </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px 40px 30px 40px;">
                            <h2 style="color: #2d3748; font-size: 22px; margin-top: 0; margin-bottom: 20px;">Dear ${name},</h2>
                            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                                Thank you for your interest in the <strong>Jharkhand Jan Kalyan Trust</strong>. We have successfully received your school enquiry for <strong>${school}</strong>.
                            </p>
                            
                            <!-- Registration Number Box -->
                            <div style="background-color: #ebf8fa; border-left: 4px solid #3182ce; padding: 20px; border-radius: 8px; margin-bottom: 25px; text-align: center;">
                                <p style="color: #2c5282; margin: 0; font-size: 14px; text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">
                                    Your Registration Number
                                </p>
                                <h3 style="color: #1e3c72; font-size: 36px; margin: 10px 0 0 0; font-weight: 700; letter-spacing: 3px;">
                                    ${registrationNumber}
                                </h3>
                                <p style="color: #4a5568; font-size: 13px; margin: 8px 0 0 0;">
                                    Please save this number for future reference
                                </p>
                            </div>
                            
                            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                                Our team will review your enquiry and get back to you shortly. We typically respond within 24-48 business hours.
                            </p>
                            
                            <div style="background-color: #fffbeb; border-left: 4px solid #f6ad55; padding: 15px 20px; border-radius: 4px; margin-bottom: 25px;">
                                <p style="color: #975a16; margin: 0; font-size: 15px; line-height: 1.5;">
                                    <strong>Next Steps:</strong> Our education coordinator will contact you to discuss admission procedures, available programs, and scholarship opportunities.
                                </p>
                            </div>
                            
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
