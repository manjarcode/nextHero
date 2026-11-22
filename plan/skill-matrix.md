# Skill Matrix — Next.js App Router

Escala 0-10 por habilidad. Actualizar al cierre de cada hito del plan (ver [ciclo actual.md](ciclo%20actual.md); historial en [ciclo 1.md](ciclo%201.md)).

| Habilidad | Nivel inicial (2026-10-14) | Objetivo (ciclo vigente) | Nivel actual | Última actualización |
|---|---|---|---|---|
| Server vs Client Components | 6 | 7 | 6 | 2026-10-14 |
| Convenciones de rutas (layout/loading/error/not-found) | 4 | 6 | 4 | 2026-10-14 |
| Data fetching en Server Components | 5 | 6 | 5 | 2026-10-14 |
| **Data Cache (`fetch`: force-cache / no-store / revalidate)** | 5 | **7** | 5 | 2026-10-14 |
| Server Actions (mutaciones, validación, errores) | 1 | 8 | 8 | 2026-11-22 |
| Server Actions + UI reactiva (`useOptimistic`, `useFormStatus`, `useActionState`) | 0 | 6 | 8 | 2026-11-22 |
| **Revalidación (`revalidatePath` / `revalidateTag`)** | 0 | **7** | 6 | 2026-11-22 |
| **Full Route Cache (servidor)** | **1** | **6** | 1 | 2026-11-22 |
| **Router Cache (cliente)** | **3** | **6** | 3 | 2026-11-22 |
| **`'use cache'` / Cache Components (`cacheTag`, `cacheLife`)** | **5** | **7** | 5 | 2026-11-22 |
| `generateStaticParams` / generación estática dinámica | 0 | 2 | 0 | 2026-10-14 |
| Middleware / Edge Runtime | 0 | 2 | 0 | 2026-10-14 |
| Streaming + `<Suspense>` | 4 | 5 | 4 | 2026-10-14 |
| Partial Prerendering (PPR) | 1 | 1 | 1 | 2026-10-14 |

**Nota:** las filas en negrita son el foco del ciclo vigente (ciclo 2 — caché, ver [ciclo actual.md](ciclo%20actual.md)). Las filas de Server Actions ya no son foco (objetivo del ciclo 1 cumplido y superado); se mantienen visibles para seguir el historial pero no se tocan activamente este ciclo. `Full Route Cache` y `Router Cache` son filas nuevas, añadidas al cerrar el ciclo 1 para poder medir la deuda identificada en su retrospectiva — nivel inicial estimado a partir de las notas ya existentes en `para repasar.md` (Router Cache: concepto claro pero terminología/mecanismo de invalidación inestable → 3; Full Route Cache: nunca trabajado de forma deliberada, solo mencionado → 1). `'use cache'`/Cache Components parte de 5 porque `cacheTag`+`revalidateTag` ya se aplicaron sin asistencia en el Hito 6 del ciclo 1; lo que falta es `cacheLife` y el resto de la API.

## Criterio de puntuación

- **0-2:** no conoce el concepto o solo de oídas.
- **3-5:** entiende el concepto, no lo ha aplicado o lo aplica con ayuda/documentación constante.
- **6-7:** lo aplica solo en casos estándar, sin asistencia.
- **8-9:** lo aplica en casos complejos/edge cases y puede explicarlo con criterio a otros.
- **10:** referente — detecta malas prácticas ajenas y propone patrones propios.

## Próximo ciclo (orientativo, no comprometido)

Tras cerrar el ciclo de caché, candidatos para el siguiente foco: Middleware, `generateStaticParams`, PPR, y los dos pendientes de `para repasar.md` sin relación con caché (progressive enhancement, chunks/build).
