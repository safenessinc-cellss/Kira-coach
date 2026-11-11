# KIRA Coach — SAFENESS.INC

Repositorio de aplicación para **https://kira.coach**. La base funcional se porta desde `safenessinc-cellss/KIRA2.1`; este repositorio mantiene la integración aislada hasta validar build, autenticación y reglas.

## Stack
- React 19, TypeScript, Vite 6 y Tailwind CSS 4.
- Firebase Authentication, Cloud Firestore, Storage y Cloud Messaging.
- Backend Express en `server.ts` para endpoints protegidos y llamadas de IA.
- Vercel para frontend y API.

## Desarrollo
Requiere Node.js 20 o superior.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Validación:
```bash
npm run lint
npm run build
```

## Firebase
Proyecto de referencia: `kira2-a6a20`.

1. Configura las variables `VITE_FIREBASE_*` de `.env.example` en el entorno local y en Vercel. La API key Web de Firebase es un identificador público, no una credencial de servidor; restríngela en Google Cloud por APIs y por los dominios autorizados.
2. En Firebase Authentication, habilita Google como proveedor y agrega `kira.coach` y `www.kira.coach` a los dominios autorizados. Comprueba también la configuración OAuth de Google.
3. Despliega `firestore.rules` solamente después de revisar las consultas de la aplicación y probarlas en el emulador:
   ```bash
   firebase use kira2-a6a20
   firebase deploy --only firestore:rules
   ```
4. No concedas roles privilegiados desde el navegador. El registro de Coach se guarda como solicitud pendiente; un administrador debe aprobarlo. La autoridad final está en Firestore Rules y en el servidor.
5. Los diarios personales son privados; las matrículas de pago, pedidos y ledger financiero no se escriben desde el cliente.

**Storage:** el código de carga acepta `folderPath` dinámicos. No se ha añadido ni desplegado una regla genérica de Storage porque podría abrir archivos de otros usuarios o bloquear cargas legítimas. Antes de activar cargas en producción, inventariar todos los prefijos usados y crear reglas por propietario/rol con límites de tamaño y MIME.

## Variables de entorno
- Cliente Firebase: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`, `VITE_FIREBASE_MEASUREMENT_ID`.
- Solo servidor: `GEMINI_API_KEY`, `STRIPE_SECRET_KEY`, `FIREBASE_PROJECT_ID`, secretos de firma/cifrado, CAPTCHA y cron que se enumeran en `.env.example`.
- Nunca uses el prefijo `VITE_` en secretos. No guardes `.env.local`, claves privadas ni service-account JSON en Git.

## Vercel y dominio
Configura el proyecto Vercel para este repositorio con:
- Install: `npm ci`
- Build: `npm run build`
- Output: `dist`
- Node.js: 20.x o superior
- API: `server.ts`

Asocia `kira.coach` y `www.kira.coach` al proyecto Vercel correcto y verifica DNS/TLS. El dominio no se reasigna automáticamente por crear este repositorio; actualmente la configuración de dominio del proyecto de referencia debe migrarse explícitamente en Vercel.

## Puerta de producción
Mantén `KIRA_DEMO_MODE=true` hasta configurar los secretos requeridos, completar pruebas negativas de permisos, revisar Storage, validar pagos/webhooks y comprobar un Preview del SHA exacto. Este cambio de repositorio no publica ni modifica producción.

© 2026 SAFENESS.INC — KIRA Coach
