# Plan incremental — Ciclo 2: Caché en Next.js

**Objetivo del ciclo:** entender las piezas de caché de Next.js como un sistema coherente (no capas sueltas), partiendo de lo que ya se tocó de forma incidental en Server Actions (`'use cache'`, `cacheTag`, `revalidateTag`, ver [ciclo 1.md](ciclo%201.md)) y cerrando la deuda abierta en [para repasar.md](para%20repasar.md) sobre Router Cache vs Full Route Cache.

**No objetivo de este ciclo:** Middleware, `generateStaticParams`/PPR puro, y los otros dos pendientes de `para repasar.md` que no son de caché (mecanismo interno del progressive enhancement, chunks/`.next/static` vs `.next/server`). Si aparecen de forma incidental, se anota en `conceptos.md` pero no se profundiza.

Progreso a registrar en [skill-matrix.md](skill-matrix.md) al cierre de cada hito.

## Objetivos de la skill matrix para este ciclo

| Habilidad | Nivel inicial | Objetivo de este ciclo | Hito(s) relacionado(s) |
|---|---|---|---|
| Full Route Cache (servidor) | 1 | 6 | Hito 1 |
| Data Cache (`fetch`: force-cache / no-store / revalidate) | 5 | 7 | Hito 2 |
| Router Cache (cliente) | 3 | 6 | Hito 3 |
| `'use cache'` / Cache Components (`cacheTag`, `cacheLife`) | 5 | 7 | Hito 4 |
| Revalidación (`revalidatePath` / `revalidateTag`) | 6 | 7 | Hitos 3-4 |

Los niveles iniciales de `Full Route Cache` y `Router Cache` son estimados a partir de las notas ya existentes en `para repasar.md`, no de un test formal — se confirman o corrigen en el Hito 6 con el test de cierre.

**Criterio de cierre del ciclo:** los cinco niveles de la tabla igualados o superados en la skill matrix, y capacidad de diagnosticar cuál de las cuatro cachés es responsable de un dato no actualizado en la UI sin consultar documentación (criterio de aceptación del Hito 6).

---

## Hito 1: Full Route Cache (servidor)

**Qué:** entender qué es la Full Route Cache, cuándo se aplica (`next build`/`next start` vs `next dev`) y qué Dynamic APIs la desactivan.

**Tareas:**
- Repasar las Dynamic APIs que fuerzan render dinámico: `cookies()`, `headers()`, `searchParams`, `fetch` con `no-store`.
- Hacer un `next build` real de un ejercicio propio e identificar en el output los indicadores de cada ruta (○ estática, ƒ dinámica, ◐ parcial).
- Forzar deliberadamente una ruta a dinámica (p. ej. leyendo `searchParams`) y comprobar el cambio de indicador en el build.

**Criterio de aceptación:** poder predecir, antes de hacer el build, si una ruta propia saldrá estática o dinámica, y explicar por qué.

---

## Hito 2: Data Cache (`fetch`)

**Qué:** repaso dirigido de `force-cache`/`no-store`/`revalidate` (ya en 5/10 según la skill matrix), distinguiéndola explícitamente de la Full Route Cache del Hito 1 — son capas relacionadas pero distintas, y ese solapamiento fue la raíz del lío original del Hito 2 del ciclo 1.

**Tareas:**
- Repasar las tres opciones de caché de `fetch` y cuándo aplica cada una por defecto.
- Experimento: una ruta con un `fetch` cacheado (`force-cache`) dentro de una página que, por otra Dynamic API, ya es dinámica — observar si el `fetch` se sigue cacheando igual o no.
- Documentar la diferencia operativa: la Data Cache cachea el resultado de una llamada concreta; la Full Route Cache cachea el HTML/RSC payload de la ruta completa.

**Criterio de aceptación:** poder explicar con un ejemplo propio por qué una ruta puede ser dinámica (Full Route Cache) y aun así tener `fetch`s individuales cacheados (Data Cache), sin contradicción.

---

## Hito 3: Router Cache (cliente)

**Qué:** cerrar el pendiente abierto desde el ciclo 1 — el concepto estaba claro pero el nombre y el mecanismo de invalidación se perdieron en un mini-test (confundido con un `invalidateCache` inexistente).

**Tareas:**
- Repasar qué guarda la Router Cache (payloads RSC de rutas ya visitadas/prefetcheadas) y su alcance (solo cliente, en memoria de la sesión de navegación).
- Repasar prefetch: cuándo Next.js prefetchea automáticamente (`<Link>`) y qué cachea de la ruta de destino.
- Clarificar invalidación: `revalidatePath`/`revalidateTag` desde una Server Action vs `router.refresh()` desde el cliente — qué invalida cada uno y cuándo hace falta uno u otro.

**Criterio de aceptación:** nombrar correctamente "Router Cache" sin dudar, y explicar la diferencia entre invalidarla desde el servidor (revalidate) y desde el cliente (`router.refresh()`).

---

## Hito 4: `'use cache'` / Cache Components, en profundidad

**Qué:** ya aplicado parcialmente en el Hito 6 del ciclo 1 (`cacheTag`, `revalidateTag` en `06-consolidacion`). Aquí toca profundizar en `cacheLife` y cerrar la confusión detectada en el test de cierre de ese hito.

**Tareas:**
- Repasar `cacheLife` y sus perfiles (`default`, `seconds`, `minutes`, `hours`, etc., o un perfil propio).
- Clarificar, con ejemplo propio, por qué invalidar por tag (`revalidateTag`) no tiene que ver con cómo React reconcilia el DOM, sino con qué entradas de la caché de datos se recalculan en el siguiente render.
- Relacionar `'use cache'` con las piezas de los hitos 1-3: qué sustituye (parte de la Full Route Cache y la Data Cache) y qué no toca (Router Cache).

**Criterio de aceptación:** poder decidir, ante un dato nuevo a cachear, si usar `'use cache'` + `cacheTag`/`cacheLife` o el modelo clásico de `fetch` + `revalidatePath`, y justificar la elección.

---

## Hito 5: Mapa integrador

**Qué:** las cuatro piezas (Request Memoization, Data Cache, Full Route Cache, Router Cache) más cómo `'use cache'`/Cache Components se relaciona con ellas, como sistema único.

**Tareas:**
- Repasar brevemente **Request Memoization** (deduplicación de `fetch` idénticos dentro del mismo render, no vista aún en este repo) para completar el mapa.
- Construir un diagrama propio (papel, Miro, lo que sea más natural) de qué pasa con una misma petición a través de las cuatro capas, sin consultar documentación mientras se dibuja.
- Contrastar el diagrama contra la documentación oficial solo al final, para detectar huecos.

**Criterio de aceptación:** explicar el recorrido completo de una petición a través de las cuatro capas, de memoria, señalando en qué punto actúa cada una.

---

## Hito 6: Consolidación y test de cierre

**Qué:** mini-ejercicio donde se vea fallar deliberadamente cada caché (como se hizo en el Hito 2 del ciclo 1), y test de cierre del ciclo.

**Tareas:**
- Ejercicio con al menos dos rutas que comparten datos, demostrando: una Full Route Cache que deja datos obsoletos sin revalidar, una Data Cache con `fetch` `no-store` innecesario (sobrecoste visible), y una Router Cache que no refleja un cambio hecho fuera de una Server Action.
- Test de cierre con preguntas tipo test + abiertas + alguna de código mínimo, igual que el del ciclo 1.
- Repetir la pregunta que falló en el mini-test del ciclo 1 (nombre y mecanismo de invalidación de la Router Cache) para confirmar que ya no se confunde.

**Criterio de cierre del ciclo:** poder diagnosticar, ante un caso de "este dato no se actualiza en la UI", cuál de las cuatro cachés es la responsable, sin consultar documentación para descartar las otras tres.

---

## Ritmo sugerido

Sin fecha límite fija, dado que el ciclo 1 mostró que el ritmo real no es diario. Se revisa el avance real al cierre de cada hito y se ajusta, sin recortar hitos.
