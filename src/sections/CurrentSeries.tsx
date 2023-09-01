import { Game, GameDate } from 'mlb-api';

import { SeriesData } from '../components';
import { MLBTeam } from '../models';

interface CurrentSeriesProps {
  team: MLBTeam;
  schedule?: GameDate[];
  nextGame?: Game;
  liveGame?: Game;
}
const CurrentSeries = ({
  schedule,
  team,
  nextGame,
  liveGame,
}: CurrentSeriesProps) => {
  const targetGame = liveGame ?? nextGame;

  return schedule && targetGame ? (
    <SeriesData
      schedule={schedule}
      selectedTeam={team}
      targetGame={targetGame}
      label="Current Series"
    />
  ) : (
    <div>
      <p>No Current Series</p>
    </div>
  );
};

export default CurrentSeries;
