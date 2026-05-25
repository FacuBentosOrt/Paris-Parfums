# Paris Parfums

Aplicacion web de catalogo de perfumes con frontend en React + Vite y backend en Express.

## Estructura

```text
server/
  app.js
  index.js
  config/
  controllers/
  middleware/
  repositories/
  routes/
  services/
  validation/
  utils/
  data/
src/
  components/
  context/
  pages/
  services/
  styles/
  utils/
```

## Scripts

- `npm run dev`: frontend Vite (http://localhost:5173)
- `npm run dev:server`: backend API (http://localhost:4000)
- `npm run build`: build de frontend
- `npm run preview`: preview de frontend build
- `npm run start`: backend en modo normal

## Variables opcionales del backend

- `PORT`: puerto del backend (default `4000`)
- `CORS_ORIGIN`: origen permitido por CORS (default `http://localhost:5173`)
- `ADMIN_PASSWORD`: clave admin para endpoints protegidos
- `SUPABASE_URL`: URL del proyecto Supabase
- `SUPABASE_SERVICE_ROLE_KEY`: clave recomendada para escrituras desde backend
- `SUPABASE_PUBLISHABLE_KEY`: alternativa para solo lectura o entornos con RLS abierto
- `SUPABASE_PERFUMES_TABLE`: nombre de la tabla (default `perfumes`)

## Setup de Supabase

1. Ejecutar [server/data/supabase-schema.sql](</c:/Users/facub/Desktop/cositas/Proyectos olvidados/Paris/Paris-Parfums/server/data/supabase-schema.sql>) en SQL Editor de Supabase.
2. Configurar `.env` con:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` (recomendado)
3. Levantar backend con `npm run dev:server`.
4. Verificar estado en `GET /api/health/db`.
