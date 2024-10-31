import { useEffect, useState } from 'react';

interface LeagueInfo {
  name: string;
  season: string;
  total_rosters: number;
  status: string;
  settings: {
    num_teams: number;
    scoring_settings: Record<string, number>;
  };
}

export default function Home() {
  const [leagueInfo, setLeagueInfo] = useState<LeagueInfo | null>(null);
  const [leagueUsers, setLeagueUsers] = useState<LeagueUser[]>([]);
  const [loading, setLoading] = useState(true);
  const leagueId = "1153424951622582272";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leagueResponse, usersResponse] = await Promise.all([
          fetch(`https://api.sleeper.app/v1/league/${leagueId}`),
          fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`)
        ]);

        const leagueData = await leagueResponse.json();
        const usersData = await usersResponse.json();

        setLeagueInfo(leagueData);
        setLeagueUsers(usersData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!leagueInfo) return <div>Failed to load league information</div>;

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      marginTop: '60px'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
        {leagueInfo.name}
      </h1>

      <div style={{
        display: 'grid',
        gap: '2rem',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
      }}>
        {/* League Info Card */}
        <div style={{
          backgroundColor: '#2a2a2a',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>League Info</h2>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <p>Season: {leagueInfo.season}</p>
            <p>Teams: {leagueInfo.total_rosters}</p>
            <p>Status: {leagueInfo.status}</p>
          </div>
        </div>

        {/* Quick Links Card */}
        <div style={{
          backgroundColor: '#2a2a2a',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Quick Links</h2>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <a href="/draft" style={{ color: '#646cff' }}>View Draft Board</a>
            <a href="/standings" style={{ color: '#646cff' }}>League Standings</a>
            <a href="/teams" style={{ color: '#646cff' }}>Team Rosters</a>
          </div>
        </div>
      </div>

      {/* League Members Section */}
      <h2 style={{ 
        fontSize: '2rem', 
        marginTop: '3rem', 
        marginBottom: '1.5rem' 
      }}>
        League Members
      </h2>
      
      <div style={{
        display: 'grid',
        gap: '1.5rem',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))'
      }}>
        {leagueUsers.map((user) => (
          <div
            key={user.user_id}
            style={{
              backgroundColor: '#2a2a2a',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img 
                src={`https://sleepercdn.com/avatars/${user.avatar}`}
                alt={user.display_name}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  marginBottom: '1rem'
                }}
              />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                {user.display_name}
              </h3>
              {user.metadata?.team_name && (
                <p style={{ color: '#888', fontSize: '0.9rem' }}>
                  {user.metadata.team_name}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}