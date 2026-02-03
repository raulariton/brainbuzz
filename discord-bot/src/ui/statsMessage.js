import ServerClient from '../services/ServerClient.js';

/**
 *
 * @param name
 * @param scope
 * @param id
 * @return {Promise<string>}
 */
export default async function getStatsMessage(name, scope, id) {

    let stats;
    try {
      stats = await ServerClient.getStats(scope, id);
    } catch (e) {
      console.error("Error fetching stats:", e);

      return ":warning: I'm sorry, but I couldn't retrieve the statistics at this time. Please try again later.";
    }

    // no stats case
    if (!stats) {
      return `${name}, you haven\'t participated in any quizzes yet. Start playing and your stats will appear here! :rocket:`;
    }
    
    // 'me' stats message
    if (scope === 'me') {
      const lines = [
        `${name}, you have:`,
        `:clipboard: **Participated in ${stats.total_quizzes} quiz(zes)**`,
        `:trophy: **Won ${stats.total_wins} times**${stats.total_wins > 0 ? '' : ' (I believe in you! :grin:)'}`,
        `:dart: **A ${(stats.win_rate * 100).toFixed(2)}% win rate**${stats.win_rate > 75 ? ' (Nice! :star-struck)' : ''}`,
        `:medal: **Placed ${stats.total_top_3_finishes} times in the top 3 of a quiz.**`,
        `:white_check_mark: **Answered ${stats.total_correct_answers} questions correctly.**${stats.total_correct_answers >= 0.8 * stats.total_quizzes ? ' (You know-it-all! :nerd:)' : ''}`
      ];

      return lines.join('\n');
    }

    // 'all' stats message
    if (scope === 'all') {
      const lines = [
        `${name === 'Hey' ? `${name}` : `*${name}*`} team, you guys have:`,
        `:microphone: **Hosted a total of ${stats.total_quizzes} quiz(zes)**`,
        `:space_invader: **Average score across all quizzes:** ${(stats.average_score * 100).toFixed(2)}%${stats.average_score > 70 ? ' (Great job! :trophy:)' : ''}`,
        `:busts_in_silhouette: **Average participation rate:** ${(stats.average_participation * 100).toFixed(2)}%${stats.average_participation > 50 ? ' (Nice work! :clap:)' : ''}`,
        `:fire: **Most popular quiz type:** ${stats.most_popular_quiz_type}`,
        `:crown: **The know-it-all:** <@${stats.highest_scoring_user.user_id}> with ${stats.highest_scoring_user.total_wins} wins and a win rate of ${(stats.highest_scoring_user.win_rate * 100).toFixed(2)}%`
      ];

      return lines.join('\n');
    }

    // unreachable but for safety
    return ':warning: An unexpected error occurred while generating the statistics message.';
}