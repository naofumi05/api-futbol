import { useState, useEffect } from 'react';
import { fetchLastEvents } from '../services/api';

/**
 * Hook personalizado para obtener los últimos 5 partidos de un equipo.
 * Combina eventslast + eventsseason para maximizar datos.
 */
export function useLastEvents(teamId, leagueId) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!teamId) {
            setEvents([]);
            return;
        }

        setError(null);
        setLoading(true);
        fetchLastEvents(teamId, leagueId)
            .then((data) => setEvents(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [teamId, leagueId]);

    return { events, loading, error };
}
