import { useLastEvents } from '../hooks/useLastEvents';
import { translateCountry, translateLeague } from '../services/api';
import MatchCard from './MatchCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import './TeamDetail.css';

/**
 * Componente TeamDetail - Vista detallada de un equipo con últimos partidos
 */
function TeamDetail({ team, onBack }) {
    const { events, loading: eventsLoading, error: eventsError } = useLastEvents(
        team.idTeam,
        team.idLeague
    );

    // Priorizar descripción en español, luego inglés
    const description = team.strDescriptionES || team.strDescriptionEN;

    return (
        <div className="team-detail">
            {/* Botón volver */}
            <button className="team-detail-back" onClick={onBack}>
                ← Volver a los equipos
            </button>

            {/* Información del equipo */}
            <div className="team-detail-header">
                <div className="team-detail-badge-wrapper">
                    <img
                        src={team.strBadge || team.strTeamBadge}
                        alt={`Escudo de ${team.strTeam}`}
                        className="team-detail-badge"
                    />
                </div>
                <div className="team-detail-info">
                    <h2 className="team-detail-name">{team.strTeam}</h2>
                    {team.strTeamAlternate && (
                        <p className="team-detail-alt">
                            También conocido como: {team.strTeamAlternate}
                        </p>
                    )}
                    <div className="team-detail-meta">
                        <div className="team-detail-meta-item">
                            <span className="meta-icon">📍</span>
                            <div>
                                <span className="meta-label">País</span>
                                <span className="meta-value">{translateCountry(team.strCountry)}</span>
                            </div>
                        </div>
                        <div className="team-detail-meta-item">
                            <span className="meta-icon">🏟️</span>
                            <div>
                                <span className="meta-label">Estadio</span>
                                <span className="meta-value">{team.strStadium || 'N/A'}</span>
                            </div>
                        </div>
                        {team.intFormedYear && (
                            <div className="team-detail-meta-item">
                                <span className="meta-icon">📆</span>
                                <div>
                                    <span className="meta-label">Fundado</span>
                                    <span className="meta-value">{team.intFormedYear}</span>
                                </div>
                            </div>
                        )}
                        {team.strLeague && (
                            <div className="team-detail-meta-item">
                                <span className="meta-icon">🏆</span>
                                <div>
                                    <span className="meta-label">Liga</span>
                                    <span className="meta-value">{translateLeague(team.strLeague)}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Descripción */}
            {description && (
                <div className="team-detail-description">
                    <h3>Sobre el equipo</h3>
                    <p>{description}</p>
                </div>
            )}

            {/* Jersey / Uniforme */}
            {team.strEquipment && (
                <div className="team-detail-jersey">
                    <h3>Uniforme</h3>
                    <img
                        src={team.strEquipment}
                        alt={`Uniforme de ${team.strTeam}`}
                        className="team-detail-jersey-img"
                    />
                </div>
            )}

            {/* Últimos partidos */}
            <div className="team-detail-matches">
                <h3>Últimos Partidos</h3>
                {eventsLoading && <LoadingSpinner message="Cargando partidos..." />}
                {eventsError && <ErrorMessage message={eventsError} />}
                {!eventsLoading && !eventsError && events.length === 0 && (
                    <p className="no-matches">No se encontraron partidos recientes.</p>
                )}
                {!eventsLoading && !eventsError && events.length > 0 && (
                    <div className="matches-list">
                        {events.map((event) => (
                            <MatchCard key={event.idEvent} event={event} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TeamDetail;
