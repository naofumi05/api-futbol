import { translateLeague } from '../services/api';
import './MatchCard.css';

/**
 * Componente MatchCard - Tarjeta de un partido con fecha y marcador
 */
function MatchCard({ event }) {
    const date = event.dateEvent
        ? new Date(event.dateEvent + 'T00:00:00').toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        })
        : 'Fecha no disponible';

    const homeScore = event.intHomeScore ?? '-';
    const awayScore = event.intAwayScore ?? '-';

    return (
        <div className="match-card">
            <div className="match-header">
                <span className="match-league">
                    🏆 {translateLeague(event.strLeague)}
                </span>
                <div className="match-date">
                    <span className="match-date-icon">📅</span>
                    {date}
                </div>
            </div>

            <div className="match-teams-row">
                <span className="match-team match-home">{event.strHomeTeam}</span>
                <div className="match-score">
                    <span className="match-score-number">{homeScore}</span>
                    <span className="match-score-separator">-</span>
                    <span className="match-score-number">{awayScore}</span>
                </div>
                <span className="match-team match-away">{event.strAwayTeam}</span>
            </div>
        </div>
    );
}

export default MatchCard;
