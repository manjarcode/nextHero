# Skill Matrix — Next.js App Router

Escala 0-10 por habilidad. Actualizar al cierre de cada hito del plan (ver [plan-2-semanas.md](plan-2-semanas.md)).

| Habilidad | Nivel inicial (2026-10-14) | Objetivo (2 semanas) | Nivel actual | Última actualización |
|---|---|---|---|---|
| Server vs Client Components | 6 | 7 | 6 | 2026-10-14 |
| Convenciones de rutas (layout/loading/error/not-found) | 4 | 6 | 4 | 2026-10-14 |
| Data fetching en Server Components | 5 | 6 | 5 | 2026-10-14 |
| Caching de `fetch` (force-cache / no-store / revalidate) | 5 | 6 | 5 | 2026-10-14 |
| **Server Actions (mutaciones, validación, errores)** | **1** | **8** | 6 | 2026-10-16 |
| **Server Actions + UI reactiva (`useOptimistic`, `useFormStatus`, `useActionState`)** | **0** | **6** | 4 | 2026-10-16 |
| Revalidación (`revalidatePath` / `revalidateTag`) | 0 | 5 | 3 | 2026-10-15 |
| `generateStaticParams` / generación estática dinámica | 0 | 2 | 0 | 2026-10-14 |
| Middleware / Edge Runtime | 0 | 2 | 0 | 2026-10-14 |
| Streaming + `<Suspense>` | 4 | 5 | 4 | 2026-10-14 |
| Partial Prerendering (PPR) | 1 | 1 | 1 | 2026-10-14 |

**Nota:** las filas en negrita son el foco de este ciclo de 2 semanas. El resto se mantiene o sube ligeramente como efecto colateral (p.ej. revalidación se toca de forma natural al trabajar Server Actions), pero no son objetivo explícito — se abordarán en el siguiente ciclo.

## Criterio de puntuación

- **0-2:** no conoce el concepto o solo de oídas.
- **3-5:** entiende el concepto, no lo ha aplicado o lo aplica con ayuda/documentación constante.
- **6-7:** lo aplica solo en casos estándar, sin asistencia.
- **8-9:** lo aplica en casos complejos/edge cases y puede explicarlo con criterio a otros.
- **10:** referente — detecta malas prácticas ajenas y propone patrones propios.

## Próximo ciclo (orientativo, no comprometido)

Tras cerrar este ciclo, candidatos para el siguiente foco: Middleware, `generateStaticParams`, PPR.
