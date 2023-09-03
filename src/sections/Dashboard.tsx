import { useEffect, useState, PropsWithChildren } from 'react';

import { ErrorMessage, LiveGame, LoadingSpinner } from '../components';
import { MLBTeam } from '../models';
import { NextGameCountdown, LiveFeed, CurrentSeries, PreviousSeries } from '.';
import { useTeamSchedule } from '../hooks';

interface DashboardProps {
  team: MLBTeam;
}

const Dashboard = ({ team }: DashboardProps) => {
  const [error, setError] = useState<string | null>(null);
  const {
    liveGame,
    nextGame,
    schedule,
    loading,
    error: scheduleError,
  } = useTeamSchedule(team);

  useEffect(() => {
    if (team.logo.logoPath === '') {
      setError('Error initializing app for selected team.');
    }

    () => setError(null);
  }, [team]);

  useEffect(() => {
    if (team.logo.logoPath === '') {
      setError('Error initializing app for selected team.');
    }

    () => setError(null);
  }, [team]);

  if (loading) {
    return (
      <Wrapper>
        <CardLoader />
        <CardLoader />
        <CardLoader />
      </Wrapper>
    );
  }

  return error || scheduleError ? (
    <ErrorMessage message={error ?? scheduleError ?? 'Unknown error.'} />
  ) : (
    <div className="px-6">
      {liveGame && (
        <LiveFeed
          className="w-full mb-3"
          team={team}
          gamePk={liveGame.gamePk.toString()}
        />
      )}

      <Wrapper>
        {liveGame ? (
          <LiveGame game={liveGame} team={team} />
        ) : (
          <NextGameCountdown
            team={team}
            nextGame={nextGame}
            error={scheduleError}
          />
        )}
        <CurrentSeries
          loading={!(schedule && nextGame && !loading)}
          schedule={schedule}
          team={team}
          nextGame={nextGame}
          liveGame={liveGame}
        />
        <PreviousSeries
          loading={!(schedule && nextGame && !loading)}
          schedule={schedule}
          team={team}
          nextGame={nextGame}
          liveGame={liveGame}
        />
      </Wrapper>
    </div>
  );
};

const Wrapper = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <section
        id="main-content"
        className="grid lg:grid-cols-3 lg:grid-rows-3 md:grid-cols-1 lg:grid-rows-auto gap-4"
      >
        {children}
      </section>
    </div>
  );
};

const CardLoader = () => {
  return (
    <div className="w-full h-36 rounded flex justify-center content-center border border-slate-100">
      <LoadingSpinner className="flex items-center h-full" variant="linear" />
    </div>
  );
};

export default Dashboard;
