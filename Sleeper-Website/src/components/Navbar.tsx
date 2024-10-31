import { useState } from 'react';
import { Link } from 'react-router-dom';

interface SleeperUser {
  user_id: string;
  username: string;
  display_name: string;
  avatar: string;
}

interface SleeperLeague {
  league_id: string;
  name: string;
  season: string;
  status: string;
  // Add other fields as needed
}

export default function Navbar() {
  const [userData, setUserData] = useState<SleeperUser | null>(null);
  const [leagues, setLeagues] = useState<SleeperLeague[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav style={{
      backgroundColor: '#1d428a',
      borderBottom: '1px solid #c8102e',
      padding: '0.5rem 1rem',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem'
        }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>
              NBA Dynasty
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="desktop-menu" style={{
          display: 'flex',
          gap: '2rem',
          alignItems: 'center'
        }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>
            HOME
          </Link>
          <Link to="/matchups" style={{ color: '#fff', textDecoration: 'none' }}>
            MATCHUPS
          </Link>
          <Link to="/trades-waivers" style={{ color: '#fff', textDecoration: 'none' }}>
            TRADES AND WAIVERS
          </Link>
          
          {/* League Info Dropdown */}
          <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                padding: '0.5rem',
                fontSize: '1rem'
              }}
            >
              LEAGUE INFO ▼
            </button>
            
            {isDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                backgroundColor: '#1d428a',
                border: '1px solid #c8102e',
                borderRadius: '4px',
                padding: '0.5rem 0',
                minWidth: '200px',
                opacity: 0,
                transform: 'translateY(-10px)',
                animation: 'dropdownFade 0.3s ease forwards',
              }}>
                <style>
                  {`
                    @keyframes dropdownFade {
                      from {
                        opacity: 0;
                        transform: translateY(-10px);
                      }
                      to {
                        opacity: 1;
                        transform: translateY(0);
                      }
                    }

                    .dropdown-item {
                      transition: background-color 0.2s ease;
                    }

                    .dropdown-item:hover {
                      background-color: #2955a3;
                    }
                  `}
                </style>

                <Link 
                  to="/rosters" 
                  className="dropdown-item"
                  style={{ 
                    display: 'block', 
                    color: '#fff', 
                    textDecoration: 'none', 
                    padding: '0.5rem 1rem'
                  }}
                >
                  Rosters
                </Link>
                <Link to="/rivalry" style={{ display: 'block', color: '#fff', textDecoration: 'none', padding: '0.5rem 1rem' }}>
                  Rivalry
                </Link>
                <Link to="/standings" style={{ display: 'block', color: '#fff', textDecoration: 'none', padding: '0.5rem 1rem' }}>
                  Standings
                </Link>
                <Link to="/drafts" style={{ display: 'block', color: '#fff', textDecoration: 'none', padding: '0.5rem 1rem' }}>
                  Drafts
                </Link>
                <Link to="/trophies" style={{ display: 'block', color: '#fff', textDecoration: 'none', padding: '0.5rem 1rem' }}>
                  Trophies
                </Link>
                <Link to="/records" style={{ display: 'block', color: '#fff', textDecoration: 'none', padding: '0.5rem 1rem' }}>
                  Records
                </Link>
                <a 
                  href="https://sleeper.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ display: 'block', color: '#fff', textDecoration: 'none', padding: '0.5rem 1rem' }}
                >
                  Go to Sleeper
                </a>
              </div>
            )}
          </div>

          <Link to="/resources" style={{ color: '#fff', textDecoration: 'none' }}>
            RESOURCES
          </Link>
        </div>

        {/* Theme Toggle */}
        <button 
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '0.5rem'
          }}
        >
          ☀️
        </button>
      </div>
    </nav>
  );
}