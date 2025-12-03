import dotenv from 'dotenv';
import { Client, GatewayIntentBits, InteractionType, Partials } from 'discord.js';
import { handleCommand } from './commands/brainbuzz.js';
import { handleQuizConfigSubmitButton } from './handlers/buttons/quizConfigSubmitButtonHandler.js';
import {
  handleQuizDurationSelectMenu,
  handleQuizTypeSelectMenu
} from './handlers/select-menus/selectMenuHandlers.js';
import { handleChannelSelectMenu } from './handlers/channel-select-menus/channelSelectMenuHandler.js';
import { handleStartQuizButton } from './handlers/buttons/startQuizButtonHandler.js';
import { handleQuizAnswerButton } from './handlers/buttons/quizAnswerButtonHandler.js';
import Fastify from 'fastify';

dotenv.config({ quiet: true });

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

const fastify = Fastify({
  logger: false
});

// log the bot in
(async () => {
  client.login(process.env.DISCORD_TOKEN);
})();

// define ping route
fastify.get('/ping', function (request, reply) {
  reply.status(200).send('pong');
})

// Log when the bot is ready
client.once('ready', () => {
  console.log(`BrainBuzz is up and running!`);

  // have the server listen on the specified port
  fastify.listen({ port: process.env.PORT, host: '0.0.0.0' }, function (err, address) {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }

    console.log(`Port ${process.env.PORT}`);
  })
});

client.on('interactionCreate', async (interaction) => {
  // Slash command handler
  if (interaction.isChatInputCommand()) {
    return await handleCommand(interaction);
  }

  // Handle select menu interactions
  if (interaction.isStringSelectMenu()) {
    if (interaction.customId.startsWith('select-quiz-type-'))
      return await handleQuizTypeSelectMenu(interaction);
    else if (interaction.customId.startsWith('select-quiz-duration-'))
      return await handleQuizDurationSelectMenu(interaction);
  }

  // Handle channel select menu interactions
  if (interaction.isChannelSelectMenu()) {
    return await handleChannelSelectMenu(interaction);
  }

  // Handle button interactions
  if (interaction.isButton()) {
    if (interaction.customId.startsWith('submit-quiz-config-'))
      return await handleQuizConfigSubmitButton(interaction);
    else if (interaction.customId.startsWith('start-quiz-button-')) {
      return await handleStartQuizButton(interaction);
    } else if (interaction.customId.startsWith('quiz_answer_button_')) {
      return await handleQuizAnswerButton(interaction);
    }
  }
});
