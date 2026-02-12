import { translateCountry } from '../services/api';
import './TeamCard.css';

/**
 * Componente TeamCard - Tarjeta clickeable de un equipo
 */
function TeamCard({ team, onClick }) {
    return (
        <div className="team-card" onClick={() => onClick(team)}>
            <div className="team-card-badge-wrapper">
                <img
                    src={team.strBadge || team.strTeamBadge}
                    alt={`Escudo de ${team.strTeam}`}
                    className="team-card-badge"
                    loading="lazy"
                />
            </div>
            <div className="team-card-info">
                <h3 className="team-card-name">{team.strTeam}</h3>
                <p className="team-card-country">
                    <span className="team-card-label">📍</span> {translateCountry(team.strCountry)}
                </p>
                {team.strStadium && (
                    <p className="team-card-stadium">
                        <span className="team-card-label">🏟️</span> {team.strStadium}
                    </p>
                )}
            </div>
        </div>
    );
}

export default TeamCard;
