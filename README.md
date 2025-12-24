## Test Rindegastos NestJS – Frontend

# React + TypeScript + Vite

Frontend mínimo para consumir el backend NestJS de la prueba técnica. Incluye:
- Home con acceso rápido a cada ejercicio.
- Cumpleaños: registrar y listar (días hasta el cumpleaños).
- Convensor de divisas: conversión puntual con fecha opcional (usa Open Exchange Rates vía backend).
- Números: producto concatenado y primeros 9 dígitos.

### Requisitos
- Node 20+
- Backend desplegado (NestJS) con los endpoints:
  - `GET /exchange/getConvertedAmount?from=CLP&to=USD&amount=15000&date=YYYY-MM-DD` (date opcional)
  - `POST /birthday` y `GET /birthday`
  - `GET /numbers/getTheNumber?first=192&second=3`

### Configuración local
1) Instalar deps:
```
npm install
```
2) Variables de entorno:
```
VITE_API_URL=https://prueba-rindegastos-backend.onrender.com
```
3) Correr en dev:
```
npm run dev
```
Vite usa proxy `/api` en desarrollo (ver `vite.config.ts`), por lo que las llamadas se hacen a `/api/...` sin CORS.

4) Build:
```
npm run build
```

### Estructura relevante
- `src/pages/home/Home.jsx` – landing.
- `src/pages/birthday/BirthdayUser.jsx` – registrar cumpleaños.
- `src/pages/birthday/BirthdayList.jsx` – lista de cumpleaños.
- `src/pages/exchange/Exchange.jsx` – converson con fecha opcional.
- `src/pages/numbers/Numbers.jsx` – producto concatenado (primeros 9 dígitos).
- `src/api/*.jsx` – clientes de API (usan `VITE_API_URL` o `/api` en dev).
- `src/components/Sidebar.jsx` – navegación.

### Despliegue en Render (Static Site)
1) Conectar repo y crear Static Site.
2) Build command: `npm install && npm run build`
3) Publish directory: `dist`
4) Environment: `VITE_API_URL` apuntando al backend en Render.

### Consideraciones de backend (resumen de la prueba)
- Usar NestJS con endpoints anteriores.
- Tasa de cambio: Open Exchange Rates.
- Validar inputs y fechas (no futuras).
- Persistir cumpleaños en PostgreSQL (Render) para la lista.
- Seguridad: secrets en variables de entorno, rate-limit/throttle, validación DTO.
- Rendimiento: evitar múltiples llamadas costosas; usar caché/batch si aplica.
