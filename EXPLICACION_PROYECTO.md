# 📘 Guía Técnica y Explicación del Proyecto

Este documento ha sido creado para ayudarte a entender y defender tu código ante cualquier evaluación. Aquí se explica la lógica detrás de cada decisión técnica.

---

## 1. Arquitectura del Proyecto

La aplicación está construida con **React** y **Vite**. Sigue un patrón de diseño moderno basado en:

- **Servicios (`api.js`)**: Centraliza todas las llamadas a la API. Ningún componente llama a `fetch` directamente.
- **Hooks Personalizados (`useTeams`, `useLeagues`)**: Separan la lógica de "obtener datos" de la "interfaz". Esto hace que el código sea más limpio y fácil de mantener.
- **Componentes Reutilizables**: Como `TeamCard.jsx` o `MatchCard.jsx`, que se usan para mostrar datos de forma consistente.

---

## 2. Puntos Clave para la Defensa

### A. Gestión de Errores y Límites (Caché Persistente)

**Pregunta: ¿Cómo manejas el límite de la API gratuita (Error 429)?**
**Respuesta:** "He implementado un sistema de **Caché en LocalStorage**. Cuando la App descarga datos por primera vez (como la lista de equipos), los guarda en el navegador. Si el usuario refresca la página, la App lee los datos del disco local en lugar de internet. Esto ahorra peticiones y hace que la App funcione incluso si la API nos bloquea temporalmente."

### B. Carga "Inteligente" de Partidos

**Pregunta: ¿Por qué a veces los partidos cargan de uno en uno o tardan un poco más?**
**Respuesta:** "La API gratuita de TheSportsDB a veces devuelve datos incompletos. Para asegurar que siempre mostramos los últimos 5 partidos, desarrollé una **función incremental**. Si faltan partidos, la App hace un barrido por rondas de la liga actual. Es un proceso resiliente: si la API se bloquea a mitad de camino, la App guarda lo que encontró y sigue intentándolo en la siguiente visita."

### C. Normalización de Datos (Traducción)

**Pregunta: ¿Cómo lograste que los nombres salgan en español si la API está en inglés?**
**Respuesta:** "He creado un sistema de **mapeo de datos (`COUNTRY_MAP` y `LEAGUE_MAP`)** en el servicio API. Antes de mostrar cualquier nombre, el sistema verifica si existe una traducción. Si existe, la aplica; si no, muestra el original. Esto mejora la experiencia del usuario de habla hispana."

## 📁 Estructura y "Tour" del Proyecto

Si te piden explicar los archivos, puedes usar este desglose como guion:

### 1. Carpeta `src/components/` (La Interfaz)

Aquí están las piezas visuales de la App. Cada componente tiene su propio `.jsx` (lógica) y `.css` (estilo):

- **`Header.jsx`**: Es la identidad de la App (título y logo).
- **`LeagueSelector.jsx`**: El dropdown que permite elegir una liga.
- **`SearchBar.jsx`**: El campo de texto para buscar equipos manualmente.
- **`TeamCard.jsx`**: La tarjeta pequeña que muestra el escudo y nombre en la cuadrícula principal.
- **`TeamDetail.jsx`**: La pantalla grande que se abre al hacer clic en un equipo. Aquí se muestra la descripción, el estadio y los partidos.
- **`MatchCard.jsx`**: Se encarga de dibujar cada fila de los últimos partidos con su marcador.
- **`LoadingSpinner.jsx` y `ErrorMessage.jsx`**: Componentes de soporte para dar feedback al usuario cuando algo carga o falla.

### 2. Carpeta `src/hooks/` (La Lógica de Datos)

Aquí usamos **Custom Hooks** para que `App.jsx` no esté desordenado:

- **`useLeagues.js`**: Gestiona la carga inicial de todas las ligas.
- **`useTeams.js`**: Controla qué equipos mostrar dependiendo de si el usuario eligió una liga o escribió en el buscador.
- **`useLastEvents.js`**: Se encarga específicamente de disparar la búsqueda de los últimos partidos de un equipo.

### 3. Carpeta `src/services/` (La Conexión Externa)

- **`api.js`**: Es el archivo más importante después de `App.jsx`. Contiene todas las URLs de la API, el sistema de caché persistente y las traducciones. Es la "cocina" donde se preparan los datos antes de enviarlos a los componentes.

### 4. Raíz de `src/`

- **`App.jsx`**: Es el **Director de Orquesta**. Decide qué se muestra en cada momento (si la bienvenida, el listado de equipos o el detalle de uno solo) basándose en el "estado" (`useState`).
- **`App.css` y `index.css`**: Contienen los estilos globales, los colores dorados y el fondo oscuro.
- **`main.jsx`**: Es el punto de entrada técnico que arranca React.

---

## 3. Flujo de Datos (Cómo viaja la información)

1. **Activación**: El usuario selecciona una liga en `App.jsx`.
2. **Hook**: Se activa `useTeams.js`, que detecta el cambio de liga.
3. **Servicio**: El hook llama a `fetchTeamsByLeague` en `api.js`.
4. **Caché/Red**: `api.js` revisa si los equipos están en `localStorage`. Si no están, los pide a la API, los traduce y los guarda.
5. **Renderizado**: React actualiza el estado y los equipos aparecen en la pantalla mediante `TeamCard.jsx`.

---

## 4. Tecnologías Avanzadas Utilizadas

- **Glassmorphism**: Estilo visual basado en transparencias y desenfoques (`backdrop-filter`).
- **CSS Variables**: Para mantener un tema consistente y fácil de cambiar.
- **AbortController**: Implementado en el servicio API para cancelar peticiones si tardan demasiado (timeouts), evitando que la App se quede "congelada".

---

## 5. Resumen de Archivos Principales

- `src/services/api.js`: El "cerebro" de los datos. Maneja caché, traducciones y algoritmos de búsqueda.

- `src/App.jsx`: El "controlador" principal. Maneja qué pantalla se muestra.
- `src/hooks/`: Contienen la lógica asíncrona (usando `useEffect` y `useState`).
- `src/components/`: La "piel" de la aplicación. Solo se encargan de pintar lo que reciben por `props`.
