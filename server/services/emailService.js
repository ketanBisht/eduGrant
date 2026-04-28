import nodemailer from 'nodemailer';

// Configure the email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // Standard gmail service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Sends a formal email reminder to a student about a scholarship deadline.
 * 
 * @param {string} studentEmail - The registered email of the student.
 * @param {string} studentName - The name of the student.
 * @param {string} scholarshipTitle - The title of the scholarship.
 * @param {Date} deadlineDate - The exact deadline date.
 * @param {string} applyLink - The official link to apply for the scholarship.
 */
export const sendDeadlineReminderEmail = async (studentEmail, studentName, scholarshipTitle, deadlineDate, applyLink) => {
    // Check if credentials exist
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn(`[Email Service Warning]: Could not send reminder to ${studentEmail}. Missing EMAIL_USER or EMAIL_PASS in environment variables.`);
        return;
    }

    const formattedDate = new Date(deadlineDate).toLocaleDateString('en-US', {
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    });

    const mailOptions = {
        from: `"EduGrant Notifications" <${process.env.EMAIL_USER}>`,
        to: studentEmail,
        subject: `Action Required: Approaching Deadline for ${scholarshipTitle}`,
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #0f172a; color: #ffffff; padding: 20px; text-align: center;">
                    <h2 style="margin: 0; font-size: 24px;">EduGrant Reminder</h2>
                </div>
                <div style="padding: 30px;">
                    <p style="font-size: 16px;">Dear <strong>${studentName}</strong>,</p>
                    
                    <p style="font-size: 16px;">
                        This is an automated reminder regarding a scholarship you have saved on your EduGrant profile. 
                        The deadline to apply for the <strong>${scholarshipTitle}</strong> is rapidly approaching.
                    </p>
                    
                    <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0;">
                        <p style="margin: 0; color: #991b1b; font-weight: bold;">
                            ⏳ Deadline Approaching!
                        </p>
                        <p style="margin: 5px 0 0 0; color: #b91c1c;">
                            Deadline: ${formattedDate}
                        </p>
                    </div>

                    <p style="font-size: 16px;">
                        If you have not yet submitted your application, we highly recommend doing so immediately to ensure you do not miss this opportunity.
                    </p>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${applyLink}" target="_blank" style="background-color: #3b82f6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                            Apply Now
                        </a>
                    </div>

                    <p style="font-size: 14px; color: #666; margin-top: 30px; border-top: 1px solid #e0e0e0; padding-top: 20px;">
                        If you have already applied, you may disregard this email. Best of luck with your application!<br><br>
                        Sincerely,<br>
                        <strong>The EduGrant Team</strong>
                    </p>
                </div>
            </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`[Email Service]: Reminder email sent to ${studentEmail} for ${scholarshipTitle} (Message ID: ${info.messageId})`);
    } catch (error) {
        console.error(`[Email Service Error]: Failed to send email to ${studentEmail}`, error);
    }
};
