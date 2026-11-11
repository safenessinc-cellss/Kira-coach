# KIRA 2.1 Unificada — by Safeness Inc.

Plataforma SaaS integral de educación, bienestar adaptativo, coaching ontológico y CRM con Inteligencia Artificial.

> **© 2026 Safeness Inc. Todos los derechos reservados.**  
> *KIRA 2.1 · Plataforma de bienestar, coaching e inteligencia artificial.*

---

## 🚀 Inicio Rápido en Desarrollo

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor full-stack (Express + Vite)
npm run dev

# 3. Compilar para producción
npm run build
```

El servidor local inicia en `http://localhost:3000`.

---

## 👥 Portales y Roles Disponibles

La aplicación cuenta con 4 roles protegidos con navegación exclusiva:

1. **Alumno (`/dashboard`):**
   - Plan Maestro de aprendizaje y cursos activos.
   - Journaling Emocional con IA contextual.
   - Bóveda Élite con microaprendizaje, mandalas interactivos y coaching ontológico.
   - Directorio de coaches con filtros por especialidad e idioma.
   - Certificados oficiales con verificación pública en `/verify/:certId`.
   - Hub de Bienestar con detector anticipatorio de burnout.
   - Medallas de Consciencia y niveles de energía (Bronce, Plata, Oro, Platino).

2. **Coach (`/coach`):**
   - Academic Command Center con ingresos netos y liquidaciones.
   - Constructor curricular con drag-and-drop (`@dnd-kit`).
   - Session Intelligence con análisis prosódico de audio y resumen longitudinal.
   - Coach Copilot para diseño de módulos y preguntas ontológicas.
   - Nexus de trazabilidad de estudiantes (sin acceso a journals privados).
   - Chat 1-a-1 con alumnos inscritos.

3. **Super Admin (`/admin`):**
   - Centro de Mando Ejecutivo con split 70/30 (Kira Net vs Coach Payouts).
   - Cola de aprobación de coaches con otorgamiento de prueba de 30 días.
   - Aprobación y revocación de certificados con emisión manual.
   - Consola de pagos (Stripe & Mercado Pago) con reembolsos y liquidaciones.
   - Moderación de mensajes y auditoría inmutable de usuarios.
   - Personalización White-Label en vivo (colores, logo y nombre).
   - Business Insights IA con caché de 1 hora.

4. **HR / B2B (`/hr`):**
   - Portal corporativo con métricas agregadas de bienestar, licencias y burnout sin comprometer la privacidad individual.

---

## 🫁 Protocolo de Calma Proactivo

Accesible en todas las rutas autenticadas mediante el botón flotante **"🫁 Calma"**:
- **Respira conmigo:** Ciclo guiado de 2 minutos (4s inhalación, 7s retención, 8s exhalación).
- **Hablar con coach de guardia:** Conexión prioritaria con un mentor disponible.
- **Silenciar métricas 24h:** Modo descanso que suspende alertas de estrés y exigencia diaria.

---

## ⚙️ Variables de Entorno & Placeholders Pendientes para Producción

Copia `.env.example` a `.env` y configura tus credenciales reales:

| Variable | Descripción | Estado Actual / Placeholder |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Llave de API de Google Gen AI para Gemini 2.5 Flash y Pro | Configurada en el entorno de AI Studio |
| `STRIPE_SECRET_KEY` | Clave secreta de Stripe para cobros reales | Modo simulador activo si no se suministra |
| `MERCADOPAGO_ACCESS_TOKEN` | Token de acceso de Mercado Pago para pagos locales | Modo simulación activo |
| `VITE_FIREBASE_API_KEY` | Credenciales de Firebase Auth y Firestore | Conectado a proyecto `ai-studio-ae1b95fe-...` |
| `SAFENESS_PUBLIC_URL` | URL oficial de la organización | Placeholder: `https://safeness.inc` |

---

## 🛡️ Seguridad y Privacidad Zero-Leak

- Los journals personales de los alumnos nunca se exponen al Portal HR ni a los Coaches.
- Las trazas de auditoría (`activity_logs`) registran únicamente metadatos operacionales sin almacenar texto confidencial.
- Toda transacción procesada incluye verificación de idempotencia y cálculo del split de liquidación (70/30).
