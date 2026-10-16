# Metodología del test de nivel

Test realizado el 2026-10-14 para establecer el punto de partida antes de iniciar el plan de aprendizaje.

## Formato

- **Mixto:** preguntas teóricas (explicar un concepto) + lectura/corrección de código + un ejercicio de escritura de código.
- 10 preguntas, dificultad creciente: 2 básicas, 3 intermedias, 5 avanzadas.
- Sin tiempo límite, respuesta libre (no opción múltiple), para evaluar comprensión real y no reconocimiento.

## Alcance

- Exclusivamente **App Router** (Next.js 13-15), por ser el modelo vigente y el relevante para posicionarse como early adopter.
- No se evaluó Pages Router.

## Bloques temáticos cubiertos

1. Server Components vs Client Components (cuándo y por qué usar `'use client'`).
2. Archivos especiales de App Router (`layout`, `loading`, `error`, `not-found`).
3. Patrón de fetching de datos en Server Components vs. patrón cliente con `useEffect`.
4. Estrategias de caching de `fetch` (`force-cache` / `no-store` / `revalidate`).
5. Server Actions (mutaciones, `'use server'`, `revalidatePath`).
6. `generateStaticParams` (equivalente a `getStaticPaths`).
7. Streaming SSR y `<Suspense>`.
8. Partial Prerendering (PPR).
9. Middleware y Edge Runtime (auth guards).
10. `revalidatePath` vs `revalidateTag`.

## Criterio de evaluación

Por cada pregunta se valoró:
- Si el concepto base es correcto, aunque la terminología sea imprecisa.
- Si hay confusión entre conceptos distintos pero relacionados (p.ej. streaming vs PPR).
- Si la respuesta reconoce explícitamente no saber (evita respuestas inventadas con falsa seguridad) — esto se valoró positivamente como señal de criterio, no como fallo.

## Posibles mejoras para futuros tests de seguimiento

- Añadir ejercicios de código ejecutable (no solo pseudocódigo) una vez haya un proyecto base para probarlos.
- Repetir el test cada hito del plan de mejora para medir progreso con el mismo rasero.
