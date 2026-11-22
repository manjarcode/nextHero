# Hito 6 — Consolidación: CRUD de tareas

Mini-feature completa de "tareas" (`Task`) que combina todo lo trabajado en
los hitos 1-5 de Server Actions, organizada por lo que la **solución final**
necesita hacer, no por técnica.

## Scaffolding (dado, no es parte del ejercicio)

`tasks.ts` en esta misma carpeta ya resuelve la persistencia en memoria del
servidor (`getTasks`, `addTask`, `toggleTask`, `removeTask`). Trátalo como una
caja negra, igual que `users.ts` en los hitos anteriores: lo importas y lo
usas desde tus Server Actions, no lo modificas.

## Pasos

Cada paso deja la feature en un estado usable. No hay pasos "a medias" para
completar más adelante (p. ej. la validación va incluida desde el paso 2, no
se añade después).

1. **Listado de tareas** — Server Component que lee `getTasks()` y pinta la
   lista (título + estado de completada). Sin mutaciones todavía.
2. **Alta de tarea** — formulario con Server Action `createTask`, completa
   desde el principio: valida el título con `zod` (vacío, longitud mínima),
   devuelve errores de campo con `useActionState`, y revalida la lista con
   `revalidatePath`.
3. **Marcar como completada** — un botón en la misma fila de cada tarea.
   Server Action `toggleTask` como acción directa de un `<form>` por fila
   (sin `useActionState`: aquí no aporta nada, no hay errores de validación
   que mostrar). Revalida la lista.
4. **Borrar tarea** — mismo patrón que el paso 3: botón en la fila, Server
   Action `deleteTask`, revalidación.
5. **Loading state en la creación** — `useFormStatus` en el botón de "Añadir
   tarea" del formulario del paso 2 (deshabilitado + "Guardando..." mientras
   está pendiente).
6. **UI optimista en la creación** — `useOptimistic` sobre el mismo
   formulario: la tarea aparece al instante en el listado y se reconcilia
   (o revierte, si simulas un fallo con un `Math.random()` como en
   `users.ts` del Hito 5) cuando la Server Action responde.

## Criterio de aceptación

- Tres Server Actions distintas (`createTask`, `toggleTask`, `deleteTask`).
- Revalidación correcta en las tres.
- Validación + errores + loading state + UI optimista en la creación.
- Ningún `fetch` manual del cliente a una API Route.

## Guía rápida (para no tener que buscar en documentación)

### Server Action básica

```ts
'use server'

export async function miAccion(formData: FormData) {
  const valor = formData.get('campo') as string
  // ...mutación...
}
```

El `<form action={miAccion}>` se la pasa directamente; React la invoca con el
`FormData` del envío. [`'use server'` (React)](https://react.dev/reference/rsc/use-server) ·
[Server Actions (Next.js)](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) ·
[`FormData` (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/FormData)

### `revalidatePath`

```ts
import { revalidatePath } from 'next/cache'

revalidatePath('/06-consolidacion')
```

Invalida la caché de esa ruta para que el siguiente render vuelva a leer los
datos frescos. [Documentación](https://nextjs.org/docs/app/api-reference/functions/revalidatePath)

### Validación con `zod`

```ts
import z from 'zod'

const schema = z.object({
  title: z.string().min(1, 'El título es obligatorio')
})

const result = schema.safeParse({ title })
if (!result.success) {
  const fieldErrors = z.flattenError(result.error).fieldErrors
  // fieldErrors.title -> string[] | undefined
}
```

`safeParse` nunca lanza excepción; devuelve `{ success, data | error }`.
[Documentación de `zod`](https://zod.dev/)

### `useActionState`

```ts
'use client'
import { useActionState } from 'react'

const [state, formAction] = useActionState(miAccion, estadoInicial)
// miAccion ahora debe tener la forma (prevState, formData) => nuevoEstado
```

El `state` es el último valor devuelto por la Server Action; `formAction` es
lo que le pasas al `<form action={...}>`.
[Documentación](https://react.dev/reference/react/useActionState)

### `useFormStatus`

```tsx
'use client'
import { useFormStatus } from 'react-dom'

function BotonSubmit() {
  const { pending } = useFormStatus()
  return <button disabled={pending}>{pending ? 'Guardando...' : 'Añadir'}</button>
}
```

Solo funciona dentro de un componente **hijo** del `<form>`, nunca en el
mismo componente que lo renderiza.
[Documentación](https://react.dev/reference/react-dom/hooks/useFormStatus)

### `useOptimistic`

```ts
'use client'
import { useOptimistic } from 'react'

const [optimisticState, addOptimistic] = useOptimistic(
  state,
  (currentState, nuevoValor) => /* cómo se ve el estado con el cambio aplicado "a futuro" */
)
```

Se engancha al `state` de `useActionState` y recalcula automáticamente cuando
ese estado se consolida con la respuesta real del servidor.
[Documentación](https://react.dev/reference/react/useOptimistic)
