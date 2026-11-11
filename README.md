# KIRA 2.1 Unificada — SAFENESS.INC

Aplicación principal de **KIRA Coach** para https://kira.coach. Stack: React 19, TypeScript, Vite, Tailwind CSS, Firebase Authentication, Cloud Firestore y backend Express.

## Desarrollo
```bash
npm install
npm run dev
npm run build
```
El servidor local inicia en `http://localhost:3000`.

## Firebase de KIRA2.1
Esta rama apunta al proyecto Firebase de referencia `kira2-a6a20`. La configuración Web de Firebase está en `firebase-applet-config.json`; esos valores son identificadores públicos de cliente, no claves privadas. La seguridad depende de Authentication, Firestore Rules, restricciones de API key y validación de tokens en el servidor.

1. En Firebase Authentication, habilita Google y añade `kira.coach`, `www.kira.coach` y los dominios Preview necesarios a Authorized domains.
2. En Google Cloud, restringe la API key Web a los dominios de KIRA y a las APIs Firebase necesarias.
3. Configura secretos de backend en Vercel usando `.env.example` como inventario. Nunca pongas secretos en variables `VITE_*` ni en archivos versionados.
4. Prueba reglas con el emulador antes de aplicarlas:
   ```bash
   firebase use kira2-a6a20
   firebase emulators:exec --only firestore --project demo-kira-rules "npm run test:rules"
   firebase deploy --only firestore:rules
   ```
5. Los diarios son privados para su propietario. Los roles Coach/Admin no se conceden desde el navegador. Las matrículas pagadas, ventas y transacciones solo se registran desde un backend/webhook confiable.

## Roles y acceso
- Alumno: acceso a su propio aprendizaje, cursos y diario.
- Coach: solo después de aprobación administrativa.
- Admin: cuenta propietaria verificada `safeness.c.a@gmail.com`.
- HR: solo mediante asignación administrativa; no hay selector público de rol HR.

El selector de acceso permite solicitar Alumno o Coach, pero una solicitud Coach queda pendiente y no concede permisos.

## IA, pagos y voz
Las solicitudes de IA requieren Firebase ID token y tienen límite por usuario. La clave Gemini permanece en el servidor y no se inyecta en el bundle. La voz Gemini Live en navegador se mantiene desactivada hasta implementar un gateway de voz con credenciales efímeras.
Los endpoints de checkout permanecen deshabilitados hasta validar precios desde Firestore, implementar webhooks firmados e idempotencia. No se simulan cobros ni se registran ventas desde el cliente.

## Storage
El código usa prefijos de carga dinámicos. No se deben desplegar reglas genéricas permisivas. Antes de habilitar cargas en producción, inventariar todos los prefijos y definir reglas por propietario/rol, tamaño y MIME. Las reglas de Storage requieren esa auditoría específica.

## Vercel y dominio
Build: `npm run build`; salida: `dist`; API Node: `server.ts`. Asocia `kira.coach` y `www.kira.coach` al proyecto Vercel correcto, valida DNS/TLS y ejecuta smoke tests. Cambiar archivos del repositorio no reasigna automáticamente el dominio.

No publiques esta rama hasta cerrar configuración de secretos, reglas, Storage, pagos y pruebas E2E. Este trabajo no modifica producción.
