import { useState, useEffect } from 'react';
import { fetchLeagues } from '../services/api';

/**
 * Hook personalizado para obtener las ligas de fútbol disponibles.
 */
export function useLeagues() {
    const [leagues, setLeagues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchLeagues()
            .then((data) => {
                const sorted = [...data].sort((a, b) =>
                    a.strLeague.localeCompare(b.strLeague)
                );
                setLeagues(sorted);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return { leagues, loading, error };
}
