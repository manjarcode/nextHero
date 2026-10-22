# Plan incremental — Ciclo 1 (2 semanas)

**Objetivo del ciclo:** dominar Server Actions en App Router (mutaciones, validación, manejo de errores, revalidación y UI reactiva), partiendo de nivel 1/10 hasta un 8/10 realista.

**No objetivo de este ciclo** (se posponen a ciclo 2): Middleware, PPR, `generateStaticParams`. Si aparecen de forma incidental, se anota pero no se profundiza.

Progreso a registrar en [skill-matrix.md](skill-matrix.md) al cierre de cada hito.

---

## Hito 1 (días 1-2): Server Action mínima funcionando ✅ Completado — 2026-10-15

**Qué:** montar el proyecto base (`create-next-app`, App Router, TypeScript) dentro de `exercises/01-server-actions-basico/` y crear la primera Server Action real: un formulario que guarda un dato en memoria/JSON local.

**Tareas:**
- Crear `app/actions.ts` con una función `'use server'`.
- Formulario con `<form action={...}>`, sin `onSubmit` ni `useState`.
- Leer el valor con `formData.get(...)`.
- Verificar que el componente del formulario sigue siendo Server Component (no `'use client'`).

**Criterio de aceptación:** el formulario funciona con JS deshabilitado en el navegador (progressive enhancement) — es la prueba de que está bien implementado.

---

## Hito 2 (días 3-4): Revalidación tras la mutación ✅ Completado — 2026-10-15

**Qué:** la lista de datos mostrada en la página no se actualiza automáticamente tras guardar. Resolverlo con `revalidatePath`.

**Tareas:**
- Añadir una Server Component que liste los datos guardados.
- Llamar a `revalidatePath('/ruta-correspondiente')` dentro de la Server Action tras la mutación.
- Experimento deliberado: quitar el `revalidatePath` y comprobar que el listado queda desactualizado (caché estática) — documentar la observación en el propio ejercicio (comentario o README corto).

**Criterio de aceptación:** poder explicar, sin mirar documentación, por qué sin `revalidatePath` el dato queda obsoleto.

> Nota real: el experimento no salió como se planteó originalmente (vía caché de `fetch`), sino al revés — se encontró el bug en vivo al mover `getMemory` a un módulo plano, lo que desactivó el refresco automático. Se resolvió añadiendo `revalidatePath`, y la causa real resultó ser la **Router Cache del cliente**, no una caché de `fetch`. Detalle completo en `formación/serverActions.md`. Pendiente de profundizar en Full Route Cache, ver `plan/para repasar.md`.

---

## Hito 3 (días 5-6): Validación y manejo de errores ✅ Completado — 2026-10-16

**Qué:** las Server Actions reales necesitan validar input y devolver errores a la UI sin recurrir a `try/catch` + estado manual en el cliente.

**Tareas:**
- Introducir validación (manual o con `zod`) dentro de la Server Action.
- Usar `useActionState` (antes `useFormState`) en el componente cliente del formulario para mostrar errores de validación devueltos por la Server Action.
- Cubrir al menos: campo vacío, formato inválido, error simulado del "servidor" (p.ej. fetch que falla).

**Criterio de aceptación:** el usuario ve el mensaje de error correcto sin recargar la página y sin perder lo ya escrito en otros campos.

> Nota real: implementado en `exercises/01-server-actions-basico/app/advanced/`, con validación manual (sin `zod` todavía, queda para una iteración futura si hace falta). El punto conceptual fuerte de la sesión fue entender *por qué* `useActionState` exige que la Server Action reciba `(prevState, formData)` — la acción no tiene memoria propia entre invocaciones, así que modelarla como un reducer puro (estado anterior + input → estado nuevo) es lo que permite a React mantener consistencia incluso con envíos concurrentes/encolados. Detalle completo en `formación/serverActions.md`. Bugs reales encontrados y resueltos en el camino: mismatch de tipos (`values` vs `user` en el objeto de retorno, detectado con `tsc --noEmit`), input bloqueado al escribir por usar `value` sin `onChange` en vez de `defaultValue`, y una regex de validación mal escrita (`/(0-9)+/` en vez de `/^[0-9]+$/`).

---

## Hito 4 (días 7-8): Estado de carga y feedback (`useFormStatus`) ✅ Completado — 2026-10-22

> **Repaso previo completado — 2026-10-19:** sesión dedicada a `zod` (primera vez viendo la librería, con Formik+Yup como referencia previa), aplicado en `exercises/01-server-actions-basico/app/advanced-zod/`, sustituyendo los `if` manuales del Hito 3 por `schema.safeParse()` + `fieldErrors` por campo. Aprendizaje central: no forzar el tipado de los resultados de zod con sus tipos internos (acaba en genéricos anidados con varios `NonNullable`, señal de ir contracorriente); mejor tipar a mano de forma simple (`Record<string, string[] | undefined>`) y usar la forma plana (`flatten()`) en vez de la anidada (`treeifyError()`). También se confirmó y aplicó la convención de UX de mostrar solo el primer mensaje de error por campo. Detalle completo en `formación/serverActions.md`.

**Qué:** mientras la Server Action se ejecuta (p.ej. simulando latencia con un `setTimeout`), el formulario debe reflejarlo.

**Tareas:**
- Extraer el botón de submit a un componente hijo cliente que use `useFormStatus` para deshabilitarse y mostrar "Guardando..." mientras `pending` es `true`.
- Entender por qué `useFormStatus` debe ir en un componente **hijo** del `<form>`, no en el mismo componente que lo renderiza.

**Criterio de aceptación:** poder explicar la relación entre `<form action={...}>`, `useFormStatus` y por qué no hace falta estado global para esto.

> Nota real: implementado en un ejercicio nuevo, `exercises/01-server-actions-basico/app/useFormStatus/` (formulario de valoración de producto, con zod + `useActionState` + `useFormStatus` combinados). El aprendizaje conceptual central fue entender *por qué* `useFormStatus` exige un componente hijo del `<form>`: el `<form>` actúa como un proveedor implícito (análogo a un Context de React) del estado de la petición en curso, así que llamar al hook en el mismo componente que renderiza el `<form>` preguntaría por un ancestro que todavía no existe en ese momento del render. Segundo punto trabajado: `useActionState` ya expone su propio `isPending` (tercer valor del array), así que `useFormStatus` no añade información nueva — lo que aporta es evitar el prop-drilling de ese `pending` a través de árboles de componentes grandes (wizards multi-paso), algo que el usuario ya había vivido en formularios reales fuera de este repo. Experimento adicional hecho en el camino (reutilizando el ejercicio del Hito 3): se añadió un `console.log(prevState)` + delay artificial de 3s en la Server Action para comprobar en vivo que, ante un doble submit antes de que la primera petición resuelva, React encola la segunda invocación y le pasa como `prevState` el resultado real de la primera (no el estado inicial) — confirmando empíricamente el modelo de reductor explicado en el Hito 3. Detalle completo en `formación/serverActions.md`.

---

## Hito 5 (días 9-10): UI optimista (`useOptimistic`)

**Qué:** mejorar la percepción de velocidad mostrando el resultado de la mutación antes de que el servidor confirme.

**Tareas:**
- Aplicar `useOptimistic` sobre la lista del Hito 2: al enviar el formulario, el nuevo elemento aparece inmediatamente en la lista (estado optimista) y se reconcilia cuando la Server Action responde.
- Simular un fallo del servidor y observar/manejar el rollback del estado optimista.

**Criterio de aceptación:** demo funcional donde la lista se actualiza "al instante" aunque la Server Action tarde ~1s simulado.

---

## Hito 6 (días 11-12): Consolidación — mini-feature completa

**Qué:** combinar todo lo anterior en una feature pequeña pero completa, como ejercicio integrador. Ejemplo sugerido: un CRUD simple de "notas" o "tareas" (crear, marcar como completada, borrar), todo con Server Actions.

**Tareas:**
- Crear, actualizar y borrar usando tres Server Actions distintas.
- Revalidación correcta en las tres.
- Validación + errores + loading state + UI optimista en al menos la acción de creación.

**Criterio de aceptación:** feature usable de principio a fin, sin ningún `fetch` manual del cliente a una API Route.

---

## Hitos 7-8 (días 13-14): Repaso, documentación y repetición del test

**Qué:** cerrar el ciclo consolidando conocimiento y midiendo progreso.

**Tareas:**
- Repetir las preguntas 3 y 5 del test inicial (fetch en cliente vs servidor, Server Actions) para comparar respuestas con el punto de partida.
- Actualizar [skill-matrix.md](skill-matrix.md) con los niveles reales alcanzados.
- Escribir un resumen corto (en `exercises/06-consolidacion/NOTAS.md` o similar) de los 2-3 conceptos que más costó entender — material reutilizable para una futura charla interna como early adopter.

**Criterio de cierre del ciclo:** nivel de Server Actions en la skill matrix igual o superior a 7/10, y capacidad de construir una Server Action con validación, revalidación, loading state y UI optimista sin consultar documentación para la estructura general (sí es aceptable consultar sintaxis puntual).

---

## Ritmo sugerido

~1-1.5h/día, 12-14 días naturales (incluye margen de 2 días de colchón si algún hito se alarga). Si el ritmo real es distinto, ajustar fechas, no recortar hitos.
