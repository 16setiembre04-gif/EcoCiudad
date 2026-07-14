/* eslint-disable @typescript-eslint/no-require-imports, no-undef */
const defaultConfig = require('./app.json');

/**
 * Configuración de Expo para EcoCiudad.
 *
 * Nota: tras la migración a OpenStreetMap / MapLibre ya no se requieren
 * API Keys de Google Maps. El plugin de MapLibre se lee directamente de app.json.
 */
module.exports = ({ config }) => ({
  ...defaultConfig.expo,
  ...config,
});
