import { getUserStats } from '../services/dbServices.js';
import logger from '../utils/logger.js';

export class StatsController {
  /**
   * Retrieves stats for either a user or a guild based on the scope parameter.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @return {Promise<e.Response>}
   */
  static async getStats(req, res) {
    // determine scope from body
    /** @type {'me' | 'all'} */
    const scope = req.query.scope;

    // NOTE: I left the logic for 'all' option here for future reference
    if (scope === 'me') {
      // get user id from body
      const { user_id } = req.body;

      let userStats;
      try {
        userStats = await StatsController.getUserStats(user_id);
      } catch (error) {
        logger.error('Error getting user stats: ', error.message);
        return res.status(500).json({ error: 'Failed to get user stats', details: error.message });
      }

      return res.json(userStats);
    } else if (scope === 'all') {
      // placeholder response

      // get guild id from body
      const { guild_id } = req.body;

      let guildStats;
      try {
        guildStats = await StatsController.getGuildStats(guild_id);
      } catch (error) {
        logger.error('Error getting guild stats: ', error.message);
        return res.status(500).json({ error: 'Failed to get guild stats', details: error.message });
      }

      return res.json(guildStats);
    }

    // unreachable but for safety
    return res.status(400).json({ error: 'Invalid scope parameter' });
  }

  static async getUserStats(userId) {
    return await getUserStats(userId);
  }

  static async getGuildStats(guildId) {
    // placeholder response
    return {
      guild_id: guildId,
      total_quizzes: 100,
      average_score: 0.75,
      average_participation: 0.6,
      most_popular_quiz_type: 'trivia',
      highest_scoring_user: {
        user_id: '',
        total_wins: 1,
        win_rate: 1
      }
    };
  }
}
