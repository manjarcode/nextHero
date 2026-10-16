# Notas incidentales

Conceptos que aparecen fuera del foco del ciclo actual, encontrados en proyectos reales (no en los ejercicios de `exercises/`). Se anotan sin profundizar, como candidatos para un ciclo futuro.

## `connection()` (next/server) — 2026-10-14

Encontrado en `baco-fit` (proyecto personal, no este repo) al usar **Cache Components** (evolución de PPR) en Next.js 16.

- Problema: un Server Component dentro de un `<Suspense>` llamaba a `new Date()` para calcular la fecha de hoy por defecto. Next lo bloqueaba en build con: *"Next.js encountered the unstable value new Date() while prerendering"*.
- Causa: con Cache Components, cualquier valor no determinista (fechas, `Math.random()`, etc.) necesita una señal explícita de que depende de la petición real, aunque el componente ya esté dentro de un `Suspense`.
- Fix: `await connection()` (de `next/server`) antes de calcular el valor. Le dice a Next "esto necesita una petición real, no lo prerenderices ni lo cachees".
- Efecto de alcance: `connection()` solo excluye de caché/prerender el subárbol donde se llama, no la página entera — el resto del árbol (fuera del `Suspense`) sigue prerenderizándose como shell estático (visible en el build como "Partial Prerender" ◐ en vez de "Dynamic" ƒ).

Relacionado directamente con la fila **Partial Prerendering (PPR)** de la skill matrix (nivel 1, fuera de foco de este ciclo). Candidato a profundizar en el ciclo de Middleware/PPR.

## Webhooks — 2026-10-15

Surgió al hablar de cuándo NO usar Server Actions: un webhook (ej. Stripe) es una mutación en el servidor, pero no la dispara una interacción de la UI, sino un sistema externo. Ahí la herramienta correcta es un Route Handler, no una Server Action.

- Pendiente de investigar: cómo se modela un webhook en Next.js (Route Handler en `/api/webhooks/...`), verificación de firma/autenticidad de la petición entrante, idempotencia.
- Candidato a ciclo futuro relacionado con Route Handlers / API.
