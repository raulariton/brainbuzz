/**
 * Listener for the /stats command to
 * view one's own or global (server) stats.
 * @param {import('@slack/bolt').App} app The Slack Bolt App instance.
 */
export default (app) => {
    app.command('/stats', async ({ ack, body, client }) => {
        await ack();

        const arg = (body.text || '').trim().toLowerCase();

        // validate arg
        if (arg !== 'me' && arg !== 'all') {
            await client.chat.postEphemeral({
                channel: body.channel_id,
                user: body.user_id,
                text: "Incorrect command usage.",
                blocks: [
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: ':warning: *Incorrect Command Usage*\n\nUsage:\n- `/stats me` - View your personal quiz statistics.\n- `/stats all` - View global quiz statistics for the workspace.'
                        }
                    }
                ]
            })

            return;
        }

        try {
            // placeholder
            await client.chat.postMessage({
                channel: body.channel_id,
                text: "Here's your stats!",
                blocks: [
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: ':bar_chart: *Your Quiz Stats*\n\n*Quizzes Taken:* 5\n*Average Score:* 80%\n*Best Score:* 100%\n*Total Correct Answers:* 40\n*Total Questions Answered:* 50'
                        }
                    }
                ]
            });
        } catch (error) {
            console.error('Error fetching or sending stats:', error);
        }
    });
};
