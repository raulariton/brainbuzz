import supabaseClient from '../services/supabaseClient.js';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelSelectMenuBuilder,
  StringSelectMenuBuilder,
  TextInputBuilder,
  TextInputStyle
} from 'discord.js';
import moment from 'moment';
import QuizConfigurationSessionManager from '../utils/QuizConfigurationSessionManager.js';
import quizConfigurationMenu from '../ui/quizConfigurationMenu.js';

/**
 * If no active quiz, shows an in-chat (not modal) select menu
 * to choose a quiz type
 * @param {import('discord.js').CommandInteraction} interaction The interaction the application received
 */
export async function handleCommand(interaction) {
  if (interaction.commandName === 'brainbuzz') {

    /**
     * Generate a unique session ID for the quiz configuration session.
     * We do this to associate the user's selections with their session
     * (each component - select menu, channel select, buttons - will have the same session ID in their customId).
     * - when the user clicks 'Submit', we can retrieve all their selections using each component's customId
     * - to prevent conflicts when multiple users are configuring quizzes at the same time, and
     * - to prevent multiple submissions of the same quiz configuration.
     *
     */
    const sessionID = crypto.randomUUID()

    return await interaction.reply({
      content: "**Hey there! Let's set up your quiz. Please choose the options below:**\n",
      components: await quizConfigurationMenu(sessionID),
      ephemeral: true,
    });
  }

  if (interaction.commandName === 'stats') {
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
}
