// Helper para persistencia en localStorage
const STORAGE_KEY = 'futbol_app_cache';

const loadStorageCache = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    console.warn('Error loading cache from localStorage', e);
    return null;
  }
};

const saveStorageCache = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Error saving cache to localStorage', e);
  }
};

// En desarrollo usamos el proxy de Vite (/api), en producción la URL directa
const BASE_URL = import.meta.env.DEV
  ? '/api/v1/json/3'
  : 'https://www.thesportsdb.com/api/v1/json/3';

// CACHÉ inicializada desde localStorage si existe
const diskCache = loadStorageCache();
const cache = {
  leagues: diskCache?.leagues || null,
  teams: diskCache?.teams || {},
  lastEvents: diskCache?.lastEvents || {},
  rounds: {}
};

// Mapa de países para traducción
const COUNTRY_MAP = {
  'Afghanistan': 'Afganistán', 'Albania': 'Albania', 'Algeria': 'Argelia', 'Andorra': 'Andorra',
  'Angola': 'Angola', 'Argentina': 'Argentina', 'Armenia': 'Armenia', 'Australia': 'Australia',
  'Austria': 'Austria', 'Azerbaijan': 'Azerbaiyán', 'Bahrain': 'Baréin', 'Bangladesh': 'Bangladés',
  'Belarus': 'Bielorrusia', 'Belgium': 'Bélgica', 'Benin': 'Benín', 'Bolivia': 'Bolivia',
  'Bosnia': 'Bosnia', 'Bosnia and Herzegovina': 'Bosnia y Herzegovina', 'Brazil': 'Brasil',
  'Bulgaria': 'Bulgaria', 'Burkina Faso': 'Burkina Faso', 'Cameroon': 'Camerún', 'Canada': 'Canadá',
  'Chile': 'Chile', 'China': 'China', 'Colombia': 'Colombia', 'Congo': 'Congo', 'Costa Rica': 'Costa Rica',
  'Croatia': 'Croacia', 'Cuba': 'Cuba', 'Cyprus': 'Chipre', 'Czech Republic': 'República Checa',
  'Czechia': 'Chequia', 'Denmark': 'Dinamarca', 'Dominican Republic': 'República Dominicana',
  'Ecuador': 'Ecuador', 'Egypt': 'Egipto', 'El Salvador': 'El Salvador', 'England': 'Inglaterra',
  'Estonia': 'Estonia', 'Ethiopia': 'Etiopía', 'Finland': 'Finlandia', 'France': 'Francia',
  'Georgia': 'Georgia', 'Germany': 'Alemania', 'Ghana': 'Ghana', 'Greece': 'Grecia',
  'Guatemala': 'Guatemala', 'Guinea': 'Guinea', 'Haiti': 'Haití', 'Honduras': 'Honduras',
  'Hungary': 'Hungría', 'Iceland': 'Islandia', 'India': 'India', 'Indonesia': 'Indonesia',
  'Iran': 'Irán', 'Iraq': 'Irak', 'Ireland': 'Irlanda', 'Israel': 'Israel', 'Italy': 'Italia',
  'Ivory Coast': 'Costa de Marfil', 'Jamaica': 'Jamaica', 'Japan': 'Japón', 'Jordan': 'Jordania',
  'Kazakhstan': 'Kazajistán', 'Kenya': 'Kenia', 'Kosovo': 'Kosovo', 'Kuwait': 'Kuwait',
  'Latvia': 'Letonia', 'Lebanon': 'Líbano', 'Libya': 'Libia', 'Lithuania': 'Lituania',
  'Luxembourg': 'Luxemburgo', 'Malaysia': 'Malasia', 'Mali': 'Malta', 'Malta': 'Malta',
  'Mexico': 'México', 'Moldova': 'Moldavia', 'Monaco': 'Mónaco', 'Montenegro': 'Montenegro',
  'Morocco': 'Marruecos', 'Mozambique': 'Mozambique', 'Netherlands': 'Países Bajos',
  'New Zealand': 'Nueva Zelanda', 'Nicaragua': 'Nicaragua', 'Niger': 'Níger', 'Nigeria': 'Nigeria',
  'North Macedonia': 'Macedonia del Norte', 'Northern Ireland': 'Irlanda del Norte', 'Norway': 'Noruega',
  'Oman': 'Omán', 'Pakistan': 'Pakistán', 'Palestine': 'Palestina', 'Panama': 'Panamá',
  'Paraguay': 'Paraguay', 'Peru': 'Perú', 'Philippines': 'Filipinas', 'Poland': 'Polonia',
  'Portugal': 'Portugal', 'Qatar': 'Catar', 'Romania': 'Rumanía', 'Russia': 'Rusia',
  'Rwanda': 'Ruanda', 'Saudi Arabia': 'Arabia Saudita', 'Scotland': 'Escocia', 'Senegal': 'Senegal',
  'Serbia': 'Serbia', 'Singapore': 'Singapur', 'Slovakia': 'Eslovaquia', 'Slovenia': 'Eslovenia',
  'South Africa': 'Sudáfrica', 'South Korea': 'Corea del Sur', 'Spain': 'España', 'Sweden': 'Suecia',
  'Switzerland': 'Suiza', 'Syria': 'Siria', 'Taiwan': 'Taiwán', 'Thailand': 'Tailandia',
  'Tunisia': 'Túnez', 'Turkey': 'Turquía', 'Ukraine': 'Ucrania', 'United Arab Emirates': 'Emiratos Árabes Unidos',
  'United Kingdom': 'Reino Unido', 'United States': 'Estados Unidos', 'Uruguay': 'Uruguay',
  'Uzbekistan': 'Uzbekistán', 'Venezuela': 'Venezuela', 'Vietnam': 'Vietnam', 'Wales': 'Gales',
  'Yemen': 'Yemen', 'Zambia': 'Zambia', 'Zimbabwe': 'Zimbabue'
};

// Mapa de ligas destacadas
const LEAGUE_MAP = {
  'Spanish La Liga': 'La Liga (España)',
  'English Premier League': 'Premier League (Inglaterra)',
  'Italian Serie A': 'Serie A (Italia)',
  'French Ligue 1': 'Ligue 1 (Francia)',
  'German Bundesliga': 'Bundesliga (Alemania)',
  'Portuguese Primeira Liga': 'Primeira Liga (Portugal)',
  'Dutch Eredivisie': 'Eredivisie (Países Bajos)',
  'American Major League Soccer': 'MLS (EE.UU.)',
  'Argentinian Primera Division': 'Primera División (Argentina)',
  'Brazilian Serie A': 'Serie A (Brasil)',
  'Mexican Liga MX': 'Liga MX (México)',
  'Copa Libertadores': 'Copa Libertadores',
  'UEFA Champions League': 'Champions League',
  'UEFA Europa League': 'Europa League',
  'English League Championship': 'Championship (Inglaterra)',
};

export function translateLeague(leagueEN) {
  if (!leagueEN) return 'N/A';
  return LEAGUE_MAP[leagueEN] || leagueEN;
}

export function translateCountry(countryEN) {
  if (!countryEN) return 'N/A';
  return COUNTRY_MAP[countryEN] || countryEN;
}

// Timeout helper para cancelar búsquedas largas
const fetchWithTimeout = async (url, timeout = 9000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch {
    clearTimeout(id);
    return null;
  }
};

export async function fetchLeagues() {
  if (cache.leagues) return cache.leagues;

  const res = await fetchWithTimeout(`${BASE_URL}/all_leagues.php`);
  if (!res || !res.ok) {
    if (cache.leagues) return cache.leagues; // Fallback a caché si la red falla
    throw new Error('La API está ocupada. Reintenta en unos instantes.');
  }

  const data = await res.json();
  const leagues = (data.leagues || []).filter(l => l.strSport === 'Soccer');

  // Actualizar caché y disco
  cache.leagues = leagues;
  saveStorageCache({ leagues, teams: cache.teams, lastEvents: cache.lastEvents });

  return leagues;
}

export async function fetchTeamsByLeague(leagueName) {
  if (cache.teams[leagueName]) return cache.teams[leagueName];

  const res = await fetchWithTimeout(`${BASE_URL}/search_all_teams.php?l=${encodeURIComponent(leagueName)}`);
  if (!res || !res.ok) {
    if (cache.teams[leagueName]) return cache.teams[leagueName];
    throw new Error('Límite de API alcanzado. Espera un momento.');
  }

  const data = await res.json();
  const teams = data.teams || [];

  // Actualizar caché y disco
  cache.teams[leagueName] = teams;
  saveStorageCache({ leagues: cache.leagues, teams: cache.teams, lastEvents: cache.lastEvents });

  return teams;
}

/**
 * Función Optimizada: Busca partidos recientes.
 * Implementa caché en memoria y DISCO para evitar error 429.
 */
export async function fetchLastEvents(teamId, leagueId) {
  // 1. Cargar lo que ya tenemos en caché (si existe)
  let matches = cache.lastEvents[teamId] || [];
  const TARGET_MATCHES = 5;

  // Si ya tenemos los 5, devolver de inmediato sin peticiones
  if (matches.length >= TARGET_MATCHES) {
    console.log(`[CACHÉ] Lista completa (5/5) para equipo ${teamId}`);
    return matches;
  }

  console.log(`[DIAGNÓSTICO] Caché incompleta (${matches.length}/${TARGET_MATCHES}). Intentando completar...`);

  // Paso 1: Intentar obtener los últimos partidos directos (Si no tenemos nada aún)
  if (matches.length === 0) {
    try {
      const url = `${BASE_URL}/eventslast.php?id=${teamId}`;
      const res = await fetchWithTimeout(url, 3000);
      if (res && res.ok) {
        const data = await res.json();
        const results = data.results || [];
        matches = [...results];
      }
    } catch (e) {
      console.error('[DIAGNÓSTICO] Error en Paso 1:', e);
    }
  }

  // Paso 2: Búsqueda incremental por Rondas (Si faltan partidos)
  if (leagueId && matches.length < TARGET_MATCHES) {
    const season = '2025-2026';
    // Rondas a escanear (20 a 30 son las más probables en Feb 2026)
    const roundsToTry = [30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20];

    for (const round of roundsToTry) {
      if (matches.length >= 10) break; // Recopilamos un poco más para asegurar orden

      try {
        const url = `${BASE_URL}/eventsround.php?id=${leagueId}&r=${round}&s=${season}`;
        const res = await fetchWithTimeout(url, 2000);

        // Si el servidor responde con error (posible 429), detenemos este intento pero guardamos lo que tenemos
        if (!res || !res.ok) {
          console.warn(`[DIAGNÓSTICO] Servidor ocupado en Ronda ${round}. Deteniendo búsqueda incremental.`);
          break;
        }

        const data = await res.json();
        const events = data.events || [];
        const found = events.filter(e =>
          (e.idHomeTeam == teamId || e.idAwayTeam == teamId) && e.intHomeScore != null
        );
        if (found.length > 0) {
          // Fusionar con los que ya tenemos cuidando duplicados
          matches = [...matches, ...found];
        }
      } catch {
        break; // Detener en caso de timeout
      }
    }
  }

  // Limpieza, Eliminar Duplicados y Ordenación Final
  const unique = new Map();
  matches.forEach(m => {
    if (m.idEvent) unique.set(m.idEvent, m);
  });

  const final = Array.from(unique.values())
    .map(m => ({
      ...m,
      _sortDate: new Date(`${m.dateEvent}T${m.strTime || '00:00:00'}`).getTime()
    }))
    .sort((a, b) => b._sortDate - a._sortDate)
    .slice(0, TARGET_MATCHES);

  // 2. Guardar progreso en memoria y disco (incluso si no llegamos a 5 aún)
  if (final.length > 0) {
    console.log(`[CACHÉ] Actualizando persistencia (${final.length} partidos) para equipo ${teamId}`);
    cache.lastEvents[teamId] = final;
    saveStorageCache({
      leagues: cache.leagues,
      teams: cache.teams,
      lastEvents: cache.lastEvents
    });
  }

  return final;
}

export async function searchTeams(query) {
  const res = await fetchWithTimeout(`${BASE_URL}/searchteams.php?t=${encodeURIComponent(query)}`);
  if (!res || !res.ok) throw new Error('Error al buscar. Prueba de nuevo en unos segundos.');
  const data = await res.json();
  return data.teams || [];
}
