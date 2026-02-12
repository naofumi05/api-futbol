import { useState, useEffect } from 'react';
import { fetchTeamsByLeague, searchTeams } from '../services/api';

/**
 * Hook personalizado para obtener equipos.
 * Puede cargar equipos por liga o por búsqueda.
 */
export function useTeams(leagueName, searchQuery) {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const query = searchQuery?.trim();

        // Si hay una búsqueda activa, buscar por nombre
        if (query && query.length >= 3) {
            setError(null);
            setLoading(true);
            searchTeams(query)
                .then((data) => {
                    const footballTeams = data.filter((t) => t.strSport === 'Soccer');
                    setTeams(footballTeams);
                })
                .catch((err) => setError(err.message))
                .finally(() => setLoading(false));
            return;
        }

        // Si no hay búsqueda, cargar por liga
        if (!leagueName) {
            if (teams.length > 0) setTeams([]);
            return;
        }

        setError(null);
        setLoading(true);
        fetchTeamsByLeague(leagueName)
            .then((data) => setTeams(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [leagueName, searchQuery, teams.length]);

    return { teams, loading, error };
}
