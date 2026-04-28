import cron from 'node-cron';
import prisma from '../config/prisma.js';
import { sendDeadlineReminderEmail } from './emailService.js';

export const initCronJobs = () => {
    console.log('[Cron Service] Initializing background tasks...');

    cron.schedule('0 8 * * *', async () => {
        console.log('[Cron Service] Running daily deadline check for saved scholarships...');
        
        try {
            const targetDateStart = new Date();
            targetDateStart.setHours(0, 0, 0, 0);

            const targetDateEnd = new Date(targetDateStart);
            targetDateEnd.setDate(targetDateEnd.getDate() + 3);
            targetDateEnd.setHours(23, 59, 59, 999);

            const approachingDeadlines = await prisma.savedScholarship.findMany({
                where: {
                    scholarship: {
                        deadline: {
                            gte: targetDateStart,
                            lte: targetDateEnd
                        }
                    }
                },
                include: {
                    student: true,
                    scholarship: true
                }
            });

            if (approachingDeadlines.length === 0) {
                console.log('[Cron Service] No deadlines exactly 3 days away today.');
                return;
            }

            console.log(`[Cron Service] Found ${approachingDeadlines.length} saved scholarship(s) with approaching deadlines.`);

            for (const record of approachingDeadlines) {
                const { student, scholarship } = record;

                if (!student.email) {
                    continue;
                }

                await sendDeadlineReminderEmail(
                    student.email,
                    student.name || 'Student',
                    scholarship.title,
                    scholarship.deadline,
                    scholarship.officialLink || 'https://edugrant.com'
                );
            }

            console.log('[Cron Service] Daily deadline check completed successfully.');

        } catch (error) {
            console.error('[Cron Service] Error occurred while checking deadlines:', error);
        }
    });
};
