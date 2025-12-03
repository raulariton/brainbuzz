import Redis from 'ioredis';

/**
 * @typedef {Object} QuizConfigurationData
 * @property {string} [quizTypeValue] - The value (key) of the selected quiz type
 * @property {string} [quizTypeText] - The text (display name) of the selected quiz type
 * @property {string} [channelId] - The ID of the channel where the quiz will be posted
 * @property {string} [durationValue] - The value (in seconds) of the selected quiz duration
 * @property {boolean} [completed] - Whether the configuration is complete. This is used
 * to prevent multiple submissions.
 */

class QuizConfigurationSessionManager {
  // TODO: add 15 minute cleanup of old sessions

  static storage = new Redis({
    host: process.env.REDIS_QUIZ_CREATION_SESSION_STORAGE_HOST,
    port: process.env.REDIS_QUIZ_CREATION_SESSION_STORAGE_PORT,
    password: process.env.REDIS_QUIZ_CREATION_SESSION_STORAGE_PASSWORD
  })

  /**
   * Sets the quiz configuration data for a given session ID. If the session ID is
   * already a key in the map, it updates the existing configuration data with the new data.
   * @param {string} sessionID
   * @param {QuizConfigurationData} configData
   */
  static async set(sessionID, configData) {
    // if sessionID already exists in storage,
    // fetch the existing data and merge it with the new data
    const data = await this.getConfigData(sessionID);

    if (data) {
      const updatedData = {
        ...data,
        ...configData
      };
      await this.storage.set(sessionID, JSON.stringify(updatedData));
    }
  }

  /**
   * Fetches the quiz configuration data for a given session ID.
   * Every time a user triggers the `/brainbuzz` command, a new
   * quiz configuration session is created with a unique ID, to store the options
   * (type, channel, duration)
   * the user selects for the quiz they intend to create.
   * This way, the 'Submit' button handler can retrieve all the options
   * and create the quiz.
   * @param sessionID
   * @return {QuizConfigurationData | undefined} The quiz configuration data, or undefined if not found
   */
  static async getConfigData(sessionID) {
    const jsonData = await this.storage.get(sessionID);
    return jsonData ? JSON.parse(jsonData) : undefined;
  }

  /**
   * Clears the quiz configuration session data for a given session ID
   * by marking it as completed.
   * TODO: implement actual deletion after a certain time period, depending
   *  on Discord's ephemeral message lifetime.
   * @param {string} sessionID
   * @return {Promise<void>}
   */
  static async clear(sessionID) {
    await this.set(sessionID, { completed: true });
  }
}

export default QuizConfigurationSessionManager;