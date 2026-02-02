import getStatsMessage from '../ui/statsMessage.js';

/**
 *
 * @param {import('discord.js').ChatInputCommandInteraction} interaction The interaction the application received
 */
export async function handleStatsCommand(interaction) {
  const scope = interaction.options.getString('scope')?.toLowerCase() || '';

  // validate scope
  // NOTE: discord already enforces valid choices,
  // so this is just a safety check
  if (scope !== 'me' && scope !== 'all') {
    return await interaction.reply({
      content:
        ':warning: **Incorrect Command Usage**\n\nUsage:\n- `/stats me` - View your personal quiz statistics.\n- `/stats all` - View global quiz statistics for the server.',
      ephemeral: true
    });
  }

  // if scope is 'me', message will be ephemeral
  const isEphemeral = scope === 'me';

  // defer reply to display 'BrainBuzz is thinking...' message
  await interaction.deferReply({ ephemeral: isEphemeral });

  let id = null;
  let name = null;
  if (scope === 'me') {
    id = interaction.user.id;
    name = interaction.member?.nickname || interaction.user.username || 'Hey';
  } else if (scope === 'all') {
    id = interaction.guildId;
    name = interaction.guild?.name || 'Hey';
  }

  return await interaction.editReply({
    content: await getStatsMessage(name, scope, id)
  });
}