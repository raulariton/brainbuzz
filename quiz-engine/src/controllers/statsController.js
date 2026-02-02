import { Request, Response } from 'express';

export class StatsController {
  /**
   * Retrieves stats for either a user or a guild based on the scope parameter.
   * @param {Request} req
   * @param {Response} res
   * @return {Promise<e.Response>}
   */
  static async getStats(req, res) {
    // determine scope from body
    /** @type {'me' | 'all'} */
    const scope = req.query.scope;

    if (scope === 'me') {
      // get user id from body
      const { user_id } = req.body;

      const userStats = await StatsController.getUserStats(user_id);

      return res.json(userStats);
    } else if (scope === 'all') {
      // placeholder response

      // get guild id from body
      const { guild_id } = req.body;

      const guildStats = await StatsController.getGuildStats(guild_id);

      return res.json(guildStats);
    }

    // unreachable but for safety
    return res.status(400).json({ error: 'Invalid scope parameter' });
  }

  static async getUserStats(userId) {
    return {
      user_id: userId,
      total_quizzes: 5,
      total_wins: 2,
      win_rate: 0.4,
      total_top_3_finishes: 3,
      total_correct_answers: 25,
      total_participations: 30
    };
  }

  static async getGuildStats(guildId) {
    return {
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
