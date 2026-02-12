import './ErrorMessage.css';

/**
 * Componente ErrorMessage - Mensaje de error reutilizable con botón de reintentar
 */
function ErrorMessage({ message, onRetry }) {
    return (
        <div className="error-container">
            <span className="error-icon">⚠️</span>
            <p className="error-text">{message}</p>
            {onRetry && (
                <button className="error-retry-btn" onClick={onRetry}>
                    Reintentar
                </button>
            )}
        </div>
    );
}

export default ErrorMessage;
