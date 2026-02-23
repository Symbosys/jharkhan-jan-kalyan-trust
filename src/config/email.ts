import nodemailer from "nodemailer";

interface SendMailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER || "",
        pass: process.env.GMAIL_PASSWORD || "",
    },
});

export const sendEmail = async (options: SendMailOptions) => {
    try {
        const info = await transporter.sendMail({
            from: `"Jharkhand Jan Kalyan Trust" <${process.env.GMAIL_USER || "noreply@jankalyantrust.org"}>`,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
        });
        console.log("Email sent successfully: %s", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error };
    }
};
