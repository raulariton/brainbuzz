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

  try {
    if (scope === 'me') {
      // placeholder
      return await interaction.editReply({
        content:
          ':bar_chart: **Your Quiz Stats**\n\n**Quizzes Taken:** 5\n**Average Score:** 80%\n**Best Score:** 100%\n**Total Correct Answers:** 40\n**Total Questions Answered:** 50'
      });
    } else if (scope === 'all') {
      // placeholder
      return await interaction.editReply({
        content:
          ':bar_chart: **Server Quiz Stats**\n\n**Total Quizzes Taken:** 150\n**Average Score:** 75%\n**Highest Score:** 100%\n**Total Correct Answers:** 1200\n**Total Questions Answered:** 1600'
      });
    }
  } catch (error) {
    console.error('Error fetching or sending stats:', error);
    return await interaction.editReply({
      content:
        ":warning: I'm sorry, but I couldn't retrieve the statistics at this time. Please try again later."
    });
  }
}