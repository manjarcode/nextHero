# Instrucciones para Claude en este repo

Repo de aprendizaje de Next.js. Las sesiones de trabajo siguen el esquema descrito en `README.md` ("Sesiones de trabajo"). Este archivo detalla **cómo ejecutar cada fase**, afinado a partir de la sesión del 2026-10-16 (Hito 3).

## 1. Recordatorio (inicio de sesión)

- Antes de nada, leer `plan/plan-2-semanas.md` y `plan/skill-matrix.md` para saber en qué hito está el usuario.
- Resumen breve (2-4 frases) de lo visto en la sesión anterior, basado en las notas reales dejadas en el plan y en `formación/`.
- Cerrar el recordatorio con **una pregunta** que compruebe si el concepto clave de la sesión anterior quedó asentado. No seguir a la fase de estudio hasta tener respuesta.

## 2. Estudio del tema (cuerpo de la sesión)

- Método **socrático por defecto**: preguntar y guiar con pistas, no dar la respuesta directa. Confirmar o corregir el razonamiento del usuario en cada paso, explicando el porqué.
- Dar la respuesta directa solo cuando el usuario la pida explícitamente (p. ej. "dame la solución directa"). Hasta entonces, pistas progresivas.
- Trabajar sobre el **código real del ejercicio** (`exercises/`), no sobre ejemplos inventados: leer los archivos antes de opinar, y usar los bugs reales que aparezcan (errores de tipos, de lógica, de regex, de caché, etc.) como material de aprendizaje — no evitarlos ni resolverlos en silencio.
- Antes de dar un hint de depuración, verificar con herramientas reales (`tsc --noEmit`, `node -e`, leer el código) en vez de especular. Si hay varias causas posibles, decir cuál es la más probable y cómo comprobarla.
- Las dudas que surgen pero quedan **fuera del foco del ciclo actual** van a `plan/conceptos.md` (notas incidentales), no se profundiza en el momento.
- Las dudas que son del foco del ciclo pero no se asientan del todo van a `plan/para repasar.md`, con fecha y qué falta por repasar.

## 3. Wrap-up (cierre de sesión)

- Actualizar `plan/plan-2-semanas.md`: marcar el hito como completado con fecha real, y añadir una nota con el aprendizaje conceptual central + los bugs reales encontrados en el camino.
- Actualizar `plan/skill-matrix.md`: subir el nivel de las filas afectadas, con fecha.
- Añadir una sección nueva al documento de `formación/` correspondiente (p. ej. `serverActions.md`) con el razonamiento conceptual trabajado en la sesión — pensado como material reutilizable para la futura charla interna, no como bitácora.
- Cerrar con **una pregunta de refuerzo que quede estrictamente dentro de lo trabajado en la sesión actual**. No anticipar hitos o hooks futuros del plan todavía no vistos — eso rompe el objetivo de comprobar retención de lo ya dado.
