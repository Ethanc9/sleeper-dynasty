import { useState } from 'react';
import { useLeague } from '../contexts/LeagueContext';

export default function Matchups() {
  const [currentWeek, setCurrentWeek] = useState(1);
  const { allMatchups, users, rosters, loading } = useLeague();
  const totalWeeks = 19;

  if (loading) return <div>Loading matchups...</div>;

  // Get current week's matchups from the stored data
  const matchups = allMatchups[currentWeek] || [];

  // Group matchups by matchup_id
  const groupedMatchups = matchups.reduce((acc, matchup) => {
    if (!acc[matchup.matchup_id]) {
      acc[matchup.matchup_id] = [];
    }
    acc[matchup.matchup_id].push(matchup);
    return acc;
  }, {} as Record<string, typeof matchups>);

  // Helper function to get user from roster_id
  const getUserFromRosterId = (rosterId: number) => {
    const roster = rosters.find(r => r.roster_id === rosterId);
    if (!roster) return null;
    return users.find(u => u.user_id === roster.owner_id);
  };

  return (
    <div className="matchups-container">
      {/* Week Navigation */}
      <div className="week-navigation">
        <button
          className="week-button"
          onClick={() => currentWeek > 1 && setCurrentWeek(currentWeek - 1)}
          disabled={currentWeek === 1}
        >
          Previous Week
        </button>
        <h2>Week {currentWeek}</h2>
        <button
          className="week-button"
          onClick={() => currentWeek < totalWeeks && setCurrentWeek(currentWeek + 1)}
          disabled={currentWeek === totalWeeks}
        >
          Next Week
        </button>
      </div>

      {/* Matchups Display */}
      <div className="matchup-list">
        {Object.values(groupedMatchups).map((matchup, index) => {
          if (!matchup || matchup.length !== 2) return null;
          
          const sortedMatchup = [...matchup].sort((a, b) => b.points - a.points);
          const isWinner = sortedMatchup[0].points > sortedMatchup[1].points;

          return (
            <div key={index} className="matchup-card">
              <div className="matchup-teams">
                {sortedMatchup.map((team, teamIndex) => {
                  const user = getUserFromRosterId(team.roster_id);
                  const isWinningTeam = teamIndex === 0 && isWinner;

                  return (
                    <div key={team.roster_id}>
                      <div 
                        className={`team-info ${isWinningTeam ? 'winner' : ''}`}
                      >
                        <div className="team-details">
                          <div className="team-name">
                            {user?.metadata?.team_name || user?.display_name || 'Unknown Team'}
                          </div>
                          <div className="team-score">
                            {team.points.toFixed(2)}
                          </div>
                        </div>
                        <img
                          className="team-avatar"
                          src={user?.avatar 
                            ? `https://sleepercdn.com/avatars/${user.avatar}` 
                            : 'https://sleepercdn.com/images/v2/icons/player_default.webp'
                          }
                          alt={user?.display_name || 'Unknown Team'}
                        />
                      </div>
                      {teamIndex === 0 && <div className="vs-divider">VS</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}