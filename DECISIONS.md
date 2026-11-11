# Registro de Decisiones de Arquitectura (ADR) — KIRA 2.1 Unificada

**Producto:** KIRA 2.1 Unificada (Fusión KIRA 2.1 + kira.coach)  
**Propiedad Intelectual:** © 2026 Safeness Inc. Todos los derechos reservados.  
**Fecha:** Noviembre 2026  

---

### 1. Fusión de Marca y Autoría
- **Decisión:** Establecer a **Safeness Inc.** como el único autor, titular de propiedad intelectual y emisor legal de certificaciones.
- **Implementación:** 
  - Metadata HTML `<meta name="author" content="Safeness Inc.">` y `<title>KIRA 2.1 · by Safeness Inc.</title>`.
  - GlobalFooter visible en todas las rutas públicas y autenticadas con el copyright obligatorio.
  - Certificados públicos con sello de verificación: "Emitido por KIRA · Safeness Inc.".
  - Logotipo oficial geométrico "K" con gradiente morado/cian (`#7C5CFF` a `#22D3EE`).

### 2. Menú Unificado y Shell Responsivo (`<AppShell>`)
- **Decisión:** Unificar los portales de Alumno, Coach, Super Admin y HR en un solo layout adaptable.
- **Comportamiento:**
  - **Desktop (≥1024px):** Barra lateral expansible/colapsable con efecto Glassmorphism oscuro.
  - **Tablet (768-1023px):** Barra de iconos compacta con tooltips.
  - **Móvil (<768px):** Barra inferior de navegación rápida (Inicio, Cursos, Mensajes, Más) combinada con cajón deslizable para las secciones secundarias.
  - Separación estricta de rutas por rol mediante `ProtectedRoute`.

### 3. Protocolo de Calma Proactivo (de kira.coach)
- **Decisión:** Implementar un botón flotante permanente ("🫁 Calma") en todas las rutas autenticadas.
- **Acciones integradas:**
  - *Respira conmigo:* Ciclo guiado de respiración 4-7-8 con animación concéntrica (Inhala 4s, Retén 7s, Exhala 8s).
  - *Hablar con coach de guardia:* Redirección y apertura de canal de mensajería prioritario.
  - *Silenciar métricas 24h:* Modo relajado que suspende notificaciones de estrés por un día.
  - Registro auditable inmutable en `users/{uid}/calm_events` y `activity_logs`.

### 4. Bóveda Élite Integrada
- **Decisión:** Fusionar los recursos avanzados de KIRA con las herramientas somáticas de kira.coach:
  - *Microaprendizaje:* Píldoras de sabiduría diaria con micro-prácticas somáticas.
  - *Mandalas & Arteterapia:* Lienzo interactivo fractal para meditación con selección de paleta y botón de carga de creaciones físicas.
  - *Coaching Ontológico:* Distinciones conversacionales clave (Hechos vs. Juicios, Peticiones vs. Quejas).
  - *Masterclasses VIP:* Grabaciones magistrales para niveles Plata y Oro.

### 5. Medallas de Consciencia (Antiadictivas)
- **Decisión:** Reemplazar las mecánicas adictivas de retención basadas en horas de pantalla por gamificación somática:
  - Premiación de rachas de coherencia, desconexión nocturna ("Templo del Sueño"), cumplimiento de compromisos y pausas regenerativas.

### 6. Privacidad Zero-Leak
- **Decisión:** Los diarios íntimos (*Journaling IA*) y conversaciones privadas están completamente aislados. Ni los empleadores en el portal HR ni los administradores tienen acceso al texto de los journals.

### 7. Resiliencia y Datos Offline
- **Decisión:** Proveer datos semilla exhaustivos (`src/lib/seedData.ts`) y almacenamiento local persistente para que todas las vistas (cursos, directoriode coaches, mandalas, aprobaciones de admin, métricas y certificados) funcionen sin pantallas en blanco incluso si Firebase opera sin conexión o sin credenciales de producción.
