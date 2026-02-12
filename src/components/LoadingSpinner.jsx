import './LoadingSpinner.css';

/**
 * Componente LoadingSpinner - Indicador de carga reutilizable
 */
function LoadingSpinner({ message = 'Cargando...' }) {
    return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">{message}</p>
        </div>
    );
}

export default LoadingSpinner;
