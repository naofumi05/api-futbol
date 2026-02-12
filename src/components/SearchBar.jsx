import { useState } from 'react';
import './SearchBar.css';

/**
 * Componente SearchBar - Barra de búsqueda de equipos
 */
function SearchBar({ onSearch }) {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim().length >= 3) {
            onSearch(query.trim());
        }
    };

    const handleClear = () => {
        setQuery('');
        onSearch('');
    };

    return (
        <form className="search-bar" onSubmit={handleSubmit}>
            <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Buscar equipo por nombre..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    minLength={3}
                />
                {query && (
                    <button
                        type="button"
                        className="search-clear-btn"
                        onClick={handleClear}
                        aria-label="Limpiar búsqueda"
                    >
                        ✕
                    </button>
                )}
            </div>
            <button type="submit" className="search-submit-btn">
                Buscar
            </button>
        </form>
    );
}

export default SearchBar;
