import { translateLeague } from '../services/api';
import './LeagueSelector.css';

/**
 * Componente LeagueSelector - Selector dropdown de ligas de fútbol
 */
function LeagueSelector({ leagues, selectedLeague, onLeagueChange, loading }) {
    return (
        <div className="league-selector">
            <label htmlFor="league-select" className="league-label">
                🏆 Selecciona una Liga
            </label>
            <select
                id="league-select"
                className="league-select"
                value={selectedLeague}
                onChange={(e) => onLeagueChange(e.target.value)}
                disabled={loading}
            >
                <option value="">-- Elige una liga --</option>
                {leagues.map((league) => (
                    <option key={league.idLeague} value={league.strLeague}>
                        {translateLeague(league.strLeague)}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default LeagueSelector;
