import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Matchup {
  matchup_id: number;
  points: number;
  roster_id: number;
  custom_points?: number;
}

interface LeagueUser {
  user_id: string;
  display_name: string;
  avatar: string;
  metadata: {
    team_name?: string;
  };
}

interface Roster {
  roster_id: number;
  owner_id: string;
}

interface Player {
  player_id: string;
  full_name: string;
  position: string;
  team: string;
}

interface LeagueContextType {
  allMatchups: Record<number, Matchup[]>;
  users: LeagueUser[];
  rosters: Roster[];
  loading: boolean;
  players: Record<string, Player>;
}

const LeagueContext = createContext<LeagueContextType | undefined>(undefined);

export function LeagueProvider({ children }: { children: ReactNode }) {
  const [allMatchups, setAllMatchups] = useState<Record<number, Matchup[]>>({});
  const [users, setUsers] = useState<LeagueUser[]>([]);
  const [rosters, setRosters] = useState<Roster[]>([]);
  const [loading, setLoading] = useState(true);
  
  const leagueId = "1153424951622582272";
  const totalWeeks = 19;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersResponse, rostersResponse] = await Promise.all([
          fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`),
          fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`),
        ]);

        const matchupPromises = Array.from({ length: totalWeeks }, (_, i) => 
          fetch(`https://api.sleeper.app/v1/league/${leagueId}/matchups/${i + 1}`)
            .then(res => res.json())
        );

        const [usersData, rostersData, ...matchupsData] = await Promise.all([
          usersResponse.json(),
          rostersResponse.json(),
          ...matchupPromises
        ]);

        const matchupsByWeek = matchupsData.reduce((acc, weekData, index) => {
          acc[index + 1] = weekData;
          return acc;
        }, {} as Record<number, Matchup[]>);

        setUsers(usersData);
        setRosters(rostersData);
        setAllMatchups(matchupsByWeek);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <LeagueContext.Provider value={{ allMatchups, users, rosters, loading }}>
      {children}
    </LeagueContext.Provider>
  );
}

export function useLeague() {
  const context = useContext(LeagueContext);
  if (context === undefined) {
    throw new Error('useLeague must be used within a LeagueProvider');
  }
  return context;
}