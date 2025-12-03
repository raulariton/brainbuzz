import Redis from 'ioredis';

/**
 * @typedef {Object} QuizContent
 * @property {string} quizText - The quiz question text
 * @property {string[]} options - Array of possible answers
 * @property {string} answer - The correct answer
 */

/**
 * @typedef {Object} QuizMetadata
 * @property {QuizContent} quiz - The quiz contents (question, options, correct answer, image)
 * @property {string} type - The type of the quiz (e.g. "Historical", "Computer Trivia", etc.)
 * @property {string} endTime - ISO string of when the quiz expires/times out
 * @property {string} channelID - The ID of the channel where the quiz was posted
 * @property {string} quizStartMessage - The message object of the quiz announcement post, to be used to reply to it later
 * @property {string} usersAnswered - Set of user IDs who have answered the quiz
 * @property {string} [creatorUserID] - (Optional) User ID of the quiz creator (if not created with the auto-post service)
 */

class QuizSessionManager {
  static storage = new Redis({
    host: process.env.REDIS_QUIZ_SESSION_STORAGE_HOST,
    port: process.env.REDIS_QUIZ_SESSION_STORAGE_PORT,
    password: process.env.REDIS_QUIZ_SESSION_STORAGE_PASSWORD
  })

  /**
   * Inserts a new quiz session metadata entry.
   * @param {string} quizId
   * @param {QuizMetadata} quizMetadata
   */
  static async insert(quizId, quizMetadata) {
    await this.storage.set(
      quizId,
      JSON.stringify(quizMetadata)
    )
  }

  /**
   * Fetches the quiz session metadata for a given quiz ID.
   * @param quizId
   * @return {QuizMetadata | undefined} The quiz session metadata, or undefined if not found
   */
  static async getQuizSessionMetadata(quizId) {
    const jsonData = await this.storage.get(quizId);
    return jsonData ? JSON.parse(jsonData) : undefined;
  }

  /**
   * Clears the quiz session metadata for a given quiz ID.
   * @param {string} quizId
   * @return {Promise<void>}
   */
  static async clear(quizId) {
    await this.storage.del(quizId);
  }

  /**
   * Adds a user ID to the list of users who have answered the quiz.
   * @param {string} quizId
   * @param {string} userId
   * @return {Promise<void>}
   */
  static async addUserAnswered(quizId, userId) {
    // get the current session metadata
    const session = await this.getQuizSessionMetadata(quizId);

    if (session) {
      // append the user ID in the usersAnswered array
      session.usersAnswered.push(userId);
      // update (overwrite) key
      await this.insert(quizId, session);
    }
  }
}

export default QuizSessionManager;
