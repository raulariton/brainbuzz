import ServerClient from '../../services/serverClient.js';
import getStatsBlocks from '../../blocks/stats.js';

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
                text: 'Incorrect command usage.',
                blocks: [
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: ':warning: *Incorrect Command Usage*\n\nUsage:\n- `/stats me` - View your personal quiz statistics.\n- `/stats all` - View global quiz statistics for the workspace.'
                        }
                    }
                ]
            });

            return;
        }

        let id = null;
        let name = null;
        if (arg === 'me') {
            id = body.user_id;
            /** @type {string} */
            name = await client.users.info({ user: body.user_id }).then(
                /** @param {import('@slack/web-api').UsersInfoResponse} res */
                (res) =>
                    res.user.profile.first_name ||
                    res.user.profile.real_name?.split(' ')[0] ||
                    res.user.profile.display_name?.split(' ')[0] ||
                    'Hey'
            );
        } else if (arg === 'all') {
            id = body.team_id;
            name =
                (await client.team.info().then(
                    /** @param {import('@slack/web-api').TeamInfoResponse} res */
                    (res) => res.team.name
                )) || 'Hey';
        }

        if (arg === 'me') {
            await client.chat.postEphemeral({
                channel: body.channel_id,
                user: body.user_id,
                text: 'Your BrainBuzz stats',
                blocks: await getStatsBlocks(name, arg, id)
            });
        } else if (arg === 'all') {
            await client.chat.postMessage({
                channel: body.channel_id,
                text: 'Server BrainBuzz stats',
                blocks: await getStatsBlocks(name, arg, id)
            });
        }
    });
};
