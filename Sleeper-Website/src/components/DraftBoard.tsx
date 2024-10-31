import { useEffect, useState } from 'react';

interface DraftPick {
  player_id: string;
  picked_by: string;
  roster_id: string;
  round: number;
  draft_slot: number;
  pick_no: number;
  metadata: {
    team: string;
    position: string;
    first_name: string;
    last_name: string;
  };
}

interface DraftData {
  type: string;
  status: string;
  settings: {
    rounds: number;
    teams: number;
  };
  draft_order: Record<string, number>;
  slot_to_roster_id: Record<string, number>;
}

export default function DraftBoard() {
  const [draft, setDraft] = useState<DraftData | null>(null);
  const [picks, setPicks] = useState<DraftPick[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const leagueId = "1153424951622582272";

  useEffect(() => {
    const fetchDraftData = async () => {
      try {
        const draftsResponse = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/drafts`);
        const drafts = await draftsResponse.json();
        
        if (!drafts?.[0]?.draft_id) {
          throw new Error('No draft found for this league');
        }

        const draftId = drafts[0].draft_id;
        const [draftResponse, picksResponse] = await Promise.all([
          fetch(`https://api.sleeper.app/v1/draft/${draftId}`),
          fetch(`https://api.sleeper.app/v1/draft/${draftId}/picks`)
        ]);

        const draftData = await draftResponse.json();
        const picksData = await picksResponse.json();

        setDraft(draftData);
        setPicks(picksData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch draft data');
      } finally {
        setLoading(false);
      }
    };

    fetchDraftData();
  }, [leagueId]);

  if (loading) return <div>Loading draft board...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!draft) return <div>No draft data available</div>;

  const draftBoard = Array.from({ length: draft.settings.rounds }, () => 
    Array(draft.settings.teams).fill(null)
  );

  picks.forEach(pick => {
    const row = pick.round - 1;
    const col = pick.draft_slot - 1;
    draftBoard[row][col] = pick;
  });

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ minWidth: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {Array.from({ length: draft.settings.teams }).map((_, index) => (
              <th key={index} style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center', backgroundColor: '#f5f5f5' }}>
                {`Team ${index + 1}`}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {draftBoard.map((round, roundIndex) => (
            <tr key={roundIndex}>
              {round.map((pick, pickIndex) => (
                <td key={pickIndex} style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>
                  {pick ? (
                    <div style={{ fontSize: '14px' }}>
                      <div style={{ fontWeight: 'bold' }}>
                        {pick.metadata.first_name} {pick.metadata.last_name}
                      </div>
                      <div style={{ color: '#666' }}>
                        {pick.metadata.team} - {pick.metadata.position}
                      </div>
                    </div>
                  ) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}