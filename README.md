# ⚽ FútbolApp Pro

**FútbolApp** es una plataforma moderna para la exploración de ligas de fútbol mundial, equipos y resultados en tiempo real. Desarrollada con **React**, la aplicación se destaca por su eficiencia en el manejo de datos y una experiencia de usuario fluida y estética.

---

## ✨ Características Principales

- **🌍 Cobertura Global**: Acceso a las principales ligas del mundo (La Liga, Premier League, Serie A, etc.).
- **🛡️ Sistema de Resiliencia (Anti-429)**: Algoritmo de caché persistente en `localStorage` que evita bloqueos por cuotas de API y permite el funcionamiento offline parcial.
- **📅 Precisión Cronológica**: Lógica avanzada para capturar resultados de la temporada actual (2025-2026), priorizando los eventos más recientes.
- **🇪🇸 Localización Total**: Traducción dinámica de nombres de países y ligas para el mercado hispanohablante.
- **🎨 Diseño Premium**: Interfaz basada en *Glassmorphism* con modo oscuro, transiciones suaves y optimización para dispositivos móviles.

---

## 🛠️ Stack Tecnológico

- **Frontend**: React.js (Hooks, Functional Components)
- **Herramientas de Construcción**: Vite
- **Estilos**: Vanilla CSS con Variables Dinámicas
- **Consumo de Datos**: Fetch API con timeouts y gestión de concurrencia
- **Base de Datos Externa**: TheSportsDB API

---

## 📁 Arquitectura de Software

El proyecto sigue una arquitectura de capas clara:

1. **Capa de Vista (Components)**: UI desacoplada y reutilizable.
2. **Capa de Lógica (Hooks)**: Gestión de estados y ciclo de vida de los datos.
3. **Capa de Servicio (API Service)**: Punto único de contacto con el exterior, encargado de la normalización, caché y traducción de la información.

---

## ⚙️ Instalación y Configuración

1. **Clonar el proyecto**:

    ```bash
    git clone <url-repositorio>
    cd futbol-api-react
    ```

2. **Instalar dependencias**:

    ```bash
    npm install
    ```

3. **Ejecutar en desarrollo**:

    ```bash
    npm run dev
    ```

4. **Compilar para producción**:

    ```bash
    npm run build
    ```

---


