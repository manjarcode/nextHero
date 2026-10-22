# Para repasar

Conceptos ya explicados que conviene volver a repasar en profundidad más adelante, porque la primera explicación no quedó del todo asentada.

## Progressive enhancement en Server Actions — 2026-10-15

El concepto general ya quedó claro: es una filosofía de desarrollo por capas (HTML funcional como base, CSS y JS como mejoras opcionales que nunca son requisito) — lo contrario a una SPA donde sin JS no hay nada. Lo que falta por repasar es el **mecanismo técnico interno** de cómo Next.js lo aplica a las Server Actions:

- Qué pasa exactamente con el `action` del `<form>` cuando Next.js lo compila (la URL real a la que apunta, el campo oculto que identifica la Server Action).
- Diferencia entre el POST de página completa (sin JS) y la interceptación vía `fetch` (con JS) — qué hace React exactamente en ese punto.
- Comprobarlo de forma práctica: desactivar JS en el navegador sobre el ejercicio de `exercises/01-server-actions-basico/` y observar la recarga completa de página, en contraste con el comportamiento con JS activado.

## Router Cache vs Full Route Cache — 2026-10-15

Surgió al depurar por qué la lista de `exercises/01-server-actions-basico/` no se actualizaba sola tras el submit (resuelto con `revalidatePath`, ver resumen en `formación/serverActions.md`). Quedó claro el concepto de **Router Cache** (cliente, en memoria del navegador, guarda payloads RSC de rutas visitadas), pero falta profundizar en:

- **Full Route Cache:** caché del lado del servidor del resultado de renderizar una ruta — cómo funciona exactamente, cuándo se activa en `next dev` vs `next build`/`next start`, y qué señales de "dinamismo" hacen que Next no la aplique (Dynamic APIs: `cookies()`, `headers()`, `searchParams`, `fetch` con `no-store`, etc.).
- Diferencia práctica entre invalidar Router Cache (`revalidatePath`/`revalidateTag` desde una Server Action) e invalidar Full Route Cache, y si son la misma invalidación o dos mecanismos distintos.
- Por qué, en el ejercicio, mover una función de lectura de un archivo `'use server'` a un módulo plano pareció cambiar el comportamiento de caché — entender si fue por Router Cache, Full Route Cache, o un artefacto de compilación de Turbopack en dev.

> **Mini test 2026-10-20:** el concepto (caché del cliente, F5 fuerza navegación nueva) seguía claro, pero el nombre exacto se perdió ("Router Cache" recordado como algo tipo "ClientCache") y la función de invalidación se confundió con un `invalidateCache` inexistente — es `revalidatePath`. Repasar específicamente la terminología, no solo el mecanismo.

## Chunks, proceso de build y `.next/static` vs `.next/server` — 2026-10-15

Surgió al revisar en `frontend-ij--web-app` (monorepo de InfoJobs) un ADR sobre resolución de sourcemaps en errores de producción. El concepto quedó razonablemente asentado, pero conviene repasarlo con más calma y, sobre todo, verlo en la práctica dentro de un proyecto Next.js propio (inspeccionar un `.next/` real tras un build):

- **`.next/static`**: código que se sirve al navegador. Dentro, los **chunks** (`.next/static/chunks/`) son el JS dividido en fragmentos por el bundler (Webpack/Turbopack) — no un único bundle. Repasar bien el *por qué* del code splitting: código compartido entre páginas vs. código específico de una ruta vs. dependencias de terceros, y cómo el hash en el nombre del chunk (`foo.a1b2c3.js`) permite cachear en el navegador sin invalidar lo que no cambió entre builds.
- **`.next/server`**: código que el propio proceso Node.js ejecuta para SSR/RSC, route handlers y middlewares. Nunca se expone como recurso HTTP descargable — es distinto de `.next/static` en ese sentido. Repasar la diferencia entre "lo que el servidor necesita para arrancar y renderizar" (el `.js`, imprescindible) y piezas opcionales que pueden viajar o no según el caso de uso (p.ej. los `.map` de sourcemaps, que el servidor no lee nunca para renderizar — solo los necesita herramental externo para traducir stacktraces).
- **Minificación y sourcemaps**: por qué el JS en producción va minificado (peso en red) y cómo un `.map` permite reconstruir, a partir de una posición en el código minificado, la línea/columna del código fuente original — repasar el mecanismo de `//# sourceMappingURL=` al final de un chunk y cómo un bundler decide el nombre del `.map` asociado.
- Pendiente de comprobar en la práctica: generar un build (`next build`) de un proyecto propio, inspeccionar `.next/static` y `.next/server`, identificar chunks, y provocar un error para ver un stacktrace minificado vs. resuelto.
