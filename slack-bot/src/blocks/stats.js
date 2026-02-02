import ServerClient from '../services/serverClient.js';

export default async function getStatsBlocks(name, scope, id) {

    let stats;
    try {
        stats = await ServerClient.getStats(scope, id);
    } catch (e) {
        console.error("Error fetching stats:", e);

        return [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: ':warning: Unable to fetch statistics at this time.'
                }
            }
        ];
    }

    // no stats case
    if (!stats) {
        return [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `${name}, you haven\'t participated in any quizzes yet. Start playing and your stats will appear here! :rocket:`
                }
            }
        ];
    }

    // 'me' stats blocks
    if (scope === 'me') {

        const lines = [
            `${name}, you have:`,
            `:clipboard: *Participated in ${stats.total_quizzes} quiz(zes)*`,
            `:trophy: *Won ${stats.total_wins} times*${stats.total_wins > 0 ? '' : ' (I believe in you! :grin:)'}`,
            `:dart: *A ${(stats.win_rate * 100).toFixed(2)}% win rate*${stats.win_rate > 75 ? ' (Nice! :star-struck)' : ''}`,
            `:medal: *Placed ${stats.total_top_3_finishes} times in the top 3 of a quiz.*`,
            `:white_check_mark: *Answered ${stats.total_correct_answers} questions correctly.*${stats.correctAnswers >= 0.8 * stats.total_quizzes ? ' (You know-it-all! :nerd-face:)' : ''}`
        ];

        return [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: lines.join('\n')
                }
            }
        ];
    }

    // 'all' stats blocks
    if (scope === 'all') {
        
    }
        const lines = [
            `${name === 'Hey' ? `${name}` : `*${name}*`} team, you guys have:`,
            `:microphone: *Hosted a total of ${stats.total_quizzes} quiz(zes)*`,
            `:space_invader: *Average score across all quizzes:* ${(stats.average_score * 100).toFixed(2)}%${stats.average_score > 70 ? ' (Great job! :trophy:)' : ''}`,
            `:busts_in_silhouette: *Average participation rate:* ${(stats.average_participation * 100).toFixed(2)}%${stats.average_participation > 50 ? ' (Nice work! :clap:)' : ''}`,
            `:fire: *Most popular quiz type:* ${stats.most_popular_quiz_type}`,
            `:crown: *The know-it-all:* <@${stats.highest_scoring_user.user_id}> with ${stats.highest_scoring_user.total_wins} wins and a win rate of ${(stats.highest_scoring_user.win_rate * 100).toFixed(2)}%`
        ];

        return [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: lines.join('\n')
                }
            }
        ]
}