import './Header.css';

/**
 * Componente Header - Barra de navegación principal
 */
function Header() {
    return (
        <header className="header">
            <div className="header-content">
                <div className="header-logo">
                    <span className="header-icon">⚽</span>
                    <h1 className="header-title">FútbolApp</h1>
                </div>
                <p className="header-subtitle">Explora ligas, equipos y resultados</p>
            </div>
        </header>
    );
}

export default Header;
