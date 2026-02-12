import { useState } from 'react';
import Header from './components/Header';
import LeagueSelector from './components/LeagueSelector';
import SearchBar from './components/SearchBar';
import TeamCard from './components/TeamCard';
import TeamDetail from './components/TeamDetail';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { useLeagues } from './hooks/useLeagues';
import { useTeams } from './hooks/useTeams';
import './App.css';

import { translateLeague } from './services/api';

/**
 * Componente principal de la aplicación FútbolApp
 * Maneja el estado global: liga seleccionada, búsqueda, y equipo seleccionado
 */
function App() {
  const [selectedLeague, setSelectedLeague] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);

  // Hooks para obtener datos de la API
  const { leagues, loading: leaguesLoading, error: leaguesError } = useLeagues();
  const { teams, loading: teamsLoading, error: teamsError } = useTeams(
    selectedLeague,
    searchQuery
  );

  // Manejar selección de liga
  const handleLeagueChange = (leagueName) => {
    setSelectedLeague(leagueName);
    setSearchQuery('');
    setSelectedTeam(null);
  };

  // Manejar búsqueda
  const handleSearch = (query) => {
    setSearchQuery(query);
    setSelectedTeam(null);
    if (query) {
      setSelectedLeague('');
    }
  };

  // Manejar selección de equipo
  const handleTeamClick = (team) => {
    setSelectedTeam(team);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Manejar volver atrás
  const handleBack = () => {
    setSelectedTeam(null);
  };

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        {/* Si hay un equipo seleccionado, mostrar su detalle */}
        {selectedTeam ? (
          <TeamDetail team={selectedTeam} onBack={handleBack} />
        ) : (
          <>
            {/* Controles: Selector de liga y barra de búsqueda */}
            <section className="controls-section">
              <LeagueSelector
                leagues={leagues}
                selectedLeague={selectedLeague}
                onLeagueChange={handleLeagueChange}
                loading={leaguesLoading}
              />
              <div className="controls-divider">
                <span>o</span>
              </div>
              <SearchBar onSearch={handleSearch} />
            </section>

            {/* Estado de carga de ligas */}
            {leaguesLoading && (
              <LoadingSpinner message="Cargando ligas disponibles..." />
            )}
            {leaguesError && (
              <ErrorMessage
                message={leaguesError}
                onRetry={() => window.location.reload()}
              />
            )}

            {/* Título dinámico */}
            {(selectedLeague || searchQuery) && !teamsLoading && !teamsError && (
              <div className="results-header">
                <h2 className="results-title">
                  {searchQuery
                    ? `Resultados para "${searchQuery}"`
                    : translateLeague(selectedLeague)}
                </h2>
                <span className="results-count">
                  {teams.length} equipo{teams.length !== 1 ? 's' : ''} encontrado{teams.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}

            {/* Estado de carga de equipos */}
            {teamsLoading && (
              <LoadingSpinner message="Cargando equipos..." />
            )}
            {teamsError && (
              <ErrorMessage message={teamsError} />
            )}

            {/* Grid de equipos */}
            {!teamsLoading && !teamsError && teams.length > 0 && (
              <div className="teams-grid">
                {teams.map((team) => (
                  <TeamCard
                    key={team.idTeam}
                    team={team}
                    onClick={handleTeamClick}
                  />
                ))}
              </div>
            )}

            {/* Mensaje cuando no hay resultados */}
            {!teamsLoading &&
              !teamsError &&
              teams.length === 0 &&
              (selectedLeague || searchQuery) && (
                <div className="no-results">
                  <span className="no-results-icon">🔎</span>
                  <p>No se encontraron equipos.</p>
                </div>
              )}

            {/* Mensaje inicial */}
            {!selectedLeague && !searchQuery && !leaguesLoading && (
              <div className="welcome-message">
                <span className="welcome-icon">⚽</span>
                <h2>¡Bienvenido a FútbolApp!</h2>
                <p>
                  Selecciona una liga del menú desplegable o busca un equipo por
                  nombre para comenzar a explorar.
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>
          FútbolApp © 2026 — Datos proporcionados por{' '}
          <a
            href="https://www.thesportsdb.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            TheSportsDB
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
