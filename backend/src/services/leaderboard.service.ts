import awardService from '~/services/award.service';
import scoringService from '~/services/scoring.service';

class LeaderboardService {
  getLeaderboard = async () => {
    const teamsWithScores = await scoringService.getTeams();
    const awards = await awardService.getAll();

    const rankings = [...teamsWithScores]
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((team, index) => ({
        rank: index + 1,
        team: { id: team.id, name: team.name, concept: team.concept, color: team.color },
        judgeAvg: team.judgeAvg,
        btcScore: team.btcScore,
        totalScore: team.totalScore,
      }));

    return { rankings, awards };
  };
}

export default new LeaderboardService();
