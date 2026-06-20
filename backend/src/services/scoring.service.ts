import scoringRepository from '~/repositories/scoring.repository';

type JudgeScoreRow = {
  ideaConcept: string | null;
  choreography: string | null;
  synchronization: string | null;
  performance: string | null;
  costume: string | null;
};

type JudgeScoreInput = {
  judgeNumber: number;
  ideaConcept: number;
  choreography: number;
  synchronization: number;
  performance: number;
  costume: number;
};

class ScoringService {
  getTeams = async () => {
    const allTeams = await scoringRepository.findAllTeams();
    const allJudgeScores = await scoringRepository.findAllJudgeScores();
    const allBtcScores = await scoringRepository.findAllBtcScores();

    return allTeams.map((team) => {
      const teamJudgeScores = allJudgeScores.filter((s) => s.teamId === team.id);
      const btcScore = allBtcScores.find((s) => s.teamId === team.id);
      const judgeAvg = this.calculateJudgeAverage(teamJudgeScores);
      const btcTotal = btcScore ? Number(btcScore.discipline) : 0;
      return { ...team, judgeAvg, btcScore: btcTotal, totalScore: judgeAvg + btcTotal };
    });
  };

  getTeamScores = async (teamId: string) => {
    const judgeRows = await scoringRepository.findJudgeScoresByTeam(teamId);
    const btcRow = await scoringRepository.findBtcScoreByTeam(teamId);
    return { judgeScores: judgeRows, btcScore: btcRow };
  };

  saveJudgeScores = async (teamId: string, data: JudgeScoreInput) => {
    await scoringRepository.upsertJudgeScores(teamId, data.judgeNumber, {
      ideaConcept: data.ideaConcept,
      choreography: data.choreography,
      synchronization: data.synchronization,
      performance: data.performance,
      costume: data.costume,
    });
  };

  saveBtcScore = async (teamId: string, discipline: number) => {
    await scoringRepository.upsertBtcScore(teamId, discipline);
  };

  getStatistics = async () => {
    const allTeams = await scoringRepository.findAllTeams();
    const allJudgeScores = await scoringRepository.findAllJudgeScores();
    const allBtcScores = await scoringRepository.findAllBtcScores();

    return allTeams.map((team) => {
      const teamJudgeScores = allJudgeScores.filter((s) => s.teamId === team.id);
      const btcScore = allBtcScores.find((s) => s.teamId === team.id);
      const judgeDetails = teamJudgeScores.map((js) => ({
        judgeNumber: js.judgeNumber,
        ideaConcept: Number(js.ideaConcept),
        choreography: Number(js.choreography),
        synchronization: Number(js.synchronization),
        performance: Number(js.performance),
        costume: Number(js.costume),
        total:
          Number(js.ideaConcept) +
          Number(js.choreography) +
          Number(js.synchronization) +
          Number(js.performance) +
          Number(js.costume),
      }));
      const judgeAvg = this.calculateJudgeAverage(teamJudgeScores);
      const btcTotal = btcScore ? Number(btcScore.discipline) : 0;
      return {
        team: { id: team.id, name: team.name, concept: team.concept, color: team.color },
        judgeDetails,
        judgeAvg,
        btcScore: btcTotal,
        totalScore: judgeAvg + btcTotal,
      };
    });
  };

  private calculateJudgeAverage = (judgeRows: JudgeScoreRow[]) => {
    if (judgeRows.length === 0) return 0;
    const totals = judgeRows.map(
      (r) =>
        Number(r.ideaConcept) +
        Number(r.choreography) +
        Number(r.synchronization) +
        Number(r.performance) +
        Number(r.costume),
    );
    return Math.round((totals.reduce((s, t) => s + t, 0) / judgeRows.length) * 10) / 10;
  };
}

export default new ScoringService();
