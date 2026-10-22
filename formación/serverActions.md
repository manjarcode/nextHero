# Server Actions

## `'use server'` y `'use client'` son directivas de React, no de Next.js

Ambas pertenecen al estándar de **React Server Components (RSC)**, definido por el propio equipo de React. Next.js fue el primer framework en implementarlas, pero no son exclusivas suyas — otros frameworks que soportan RSC (Waku, Parcel RSC) también las usan. Lo que sí depende de Next.js es el mecanismo concreto por debajo (serialización, generación del endpoint, etc.).

## Cuándo usar una Server Action

Definición de referencia: cuando se produce una **mutación** en el servidor tras una **interacción del usuario con la UI** (formulario, botón, etc.), la mejor herramienta debería ser una Server Action.

No aplica si la mutación la dispara algo externo a la UI (ver nota de webhooks en `plan/conceptos.md`) o si no hay mutación de por medio (solo lectura).

### Respuesta tipo entrevista

> Usamos una server action cuando una interacción del usuario en la UI, como un formulario o un botón, dispara una mutación en el servidor; aporta type-safety end-to-end y sigue funcionando sin JavaScript, a diferencia de un fetch manual.

## Progressive enhancement: funciona sin JavaScript

Pendiente de comprobar: desactivar JavaScript en el navegador y verificar que un `<form action={miServerAction}>` sigue funcionando. El navegador hace un submit HTTP normal y Next.js lo intercepta en el servidor igual, sin depender del bundle de cliente.

**Cómo funciona por debajo:**
- Next.js compila `<form action={miServerAction}>` para que el `action` del formulario apunte a una URL real (la propia página) y añade un campo oculto que identifica qué Server Action ejecutar.
- **Sin JS:** el navegador hace lo que sabe hacer con cualquier `<form>` HTML — un POST normal de página completa. El servidor ejecuta la Server Action y devuelve HTML nuevo (recarga completa).
- **Con JS:** React intercepta el submit antes de la recarga, manda la misma petición vía `fetch` por debajo, y actualiza solo lo necesario del DOM (sin recarga, sensación instantánea).
- La idea central: la base (sin JS) ya es funcional por sí misma con capacidades nativas de HTML; JS solo mejora la experiencia, no es un requisito. Es lo contrario a una SPA tradicional.

**No depende de si el componente es Server o Client Component.** Una Server Action funciona igual la llame uno u otro, y el progressive enhancement también se mantiene en ambos casos (el HTML del `<form>` se renderiza igual). La razón para preferir Server Component cuando no hace falta interactividad de cliente es otra: evita enviar JS innecesario al navegador, no es un requisito técnico para que la Server Action o el progressive enhancement funcionen.

## Seguridad: el ID de la Server Action no es una barrera de seguridad

El `<form action={...}>` genera un campo oculto con un ID único (hash en build time) que actúa como clave en una tabla `id → función` que mantiene el servidor. Así identifica qué Server Action ejecutar cuando hay varias en la app.

**Qué pasa si se manipula ese ID:**
- ID inexistente → el servidor no encuentra la función, falla.
- ID de **otra** Server Action real de la misma app → el servidor la ejecuta igualmente. No "se rompe": hace lo que el ID le indica, aunque no sea el formulario original.

**Implicación de seguridad:** nunca asumir que un usuario solo puede disparar la acción que le "mostraste" en el HTML — puede inspeccionar el DOM y cambiar el ID por el de otra acción válida de la app, con el `FormData` que quiera. Por eso **cada Server Action debe validar por sí misma** autenticación, autorización e input, sin confiar en que solo se puede llegar a ella desde un formulario concreto.

## Revalidación: por qué la lista no se actualiza sola sin `revalidatePath`

Vivido en el ejercicio `exercises/01-server-actions-basico/`: al mover `getMemory` de `actions.ts` (con `'use server'`) a un módulo plano (`memory.ts`), el refresco automático de la lista tras el submit dejó de funcionar, incluso reiniciando el dev server. Al añadir `revalidatePath('/')` dentro de `save`, volvió a funcionar.

**La causa real: Router Cache del cliente, no caché del servidor.**
- La **Router Cache** vive en memoria en el propio navegador (parte del runtime de React/Next ya cargado). Guarda el payload RSC de rutas visitadas para que la navegación (clicks en `<Link>`, o el refresco automático tras una Server Action) sea instantánea sin volver a pedir todo al servidor.
- Tras el submit, el refresco automático que dispara Next pide la ruta actual, pero el cliente respondía con la copia que ya tenía en esa Router Cache en vez de ir a buscar la versión nueva — por eso parecía que el dato no se guardaba, cuando en realidad sí se guardaba, solo que la UI mostraba una copia vieja.
- `revalidatePath`/`revalidateTag` invalidan esa Router Cache explícitamente, forzando a que el siguiente refresco pida datos frescos.

**Por qué el `F5` (recarga manual) sí mostraba el dato nuevo aunque la ruta "estuviera cacheada":** una recarga manual es una **navegación completamente nueva del navegador**, no una navegación gestionada por el router de Next. Descarta por completo el estado de JS de la pestaña (incluida la Router Cache) y pide la página desde cero al servidor — por eso ahí sí se ve el dato real.

Hay un segundo concepto de caché, el **Full Route Cache** (en el servidor, relevante sobre todo en producción/build, no tanto en `next dev`), que es distinto de la Router Cache del cliente — pendiente de profundizar, ver `plan/para repasar.md`.

## Validación y errores con `useActionState`

Vivido en `exercises/01-server-actions-basico/app/advanced/`. Cuando una Server Action necesita devolver errores de validación a la UI (sin `try/catch` + `useState` manual en el cliente), el mecanismo es `useActionState` (antes `useFormState`).

**Por qué la Server Action pasa a recibir `(prevState, formData)` en vez de solo `(formData)`:**
- La Server Action no tiene memoria propia entre invocaciones — cada envío es una ejecución aislada, sin closure sobre la llamada anterior.
- `useActionState` modela la actualización de estado como un **reducer** (igual que `useReducer`: `(state, action) => newState`), no porque la lógica de validación necesite literalmente el contenido del estado anterior (de hecho, muchas veces ni se usa dentro del cuerpo de la función), sino porque ese contrato es lo que permite a React componer "estado anterior + input nuevo → estado nuevo" de forma predecible, incluso si hay envíos encolados o concurrentes (p. ej. doble submit rápido). Si la función dependiera de una variable capturada en el cliente para "recordar" el estado anterior en vez de recibirlo como argumento, el orden de resolución entre llamadas dejaría de estar garantizado.
- El coste de usar `useActionState`: el componente que lo llama necesita `'use client'`, porque es un hook. El `<form>` deja de ser 100% Server Component — trade-off consciente a cambio de la UI reactiva.

**Repoblar el formulario tras un error de validación — `value` vs `defaultValue`:**
- `value={...}` convierte el `<input>` en **controlado**: React decide en todo momento qué contenido tiene, y espera un `onChange` que actualice ese valor. Sin `onChange`, el input queda efectivamente bloqueado para escribir — React sigue forzando el mismo valor en cada reconciliación.
- `defaultValue={...}` lo deja **no controlado**: solo fija el valor inicial (útil para repoblar tras el estado devuelto por la Server Action), y a partir de ahí el navegador gestiona las pulsaciones de teclado libremente, sin intervención de React.
- Para repoblar un campo con el valor que el usuario envió (y que falló validación), `defaultValue` es la opción correcta — `value` sin `onChange` rompe la interacción.

**Gotcha con estado en memoria durante pruebas manuales:** si el "almacén" de datos del ejercicio es un array en memoria del proceso de Node (sin base de datos), un valor inválido guardado *antes* de corregir una validación se queda ahí para siempre hasta reiniciar el servidor de desarrollo — el array no se vacía solo con cada guardado. Al depurar "por qué se sigue colando un valor inválido", conviene descartar primero dato residual de una prueba anterior antes de sospechar de la lógica de validación.

## Validación declarativa con `zod` (reemplazo de los `if` manuales)

Vivido en `exercises/01-server-actions-basico/app/advanced-zod/`, repasando `zod` desde cero (primera vez viendo la librería en código, con experiencia previa en Formik + Yup como punto de referencia).

**Idea central:** en vez de escribir `if`s que comprueban cada campo y concatenan errores a mano, describes la **forma y las reglas** del dato de forma declarativa (`z.object({...})`), y la librería valida y estructura los errores por ti.

**API mínima:**
```ts
const schema = z.object({
  firstname: z.string().min(5, 'mensaje'),
  phoneNumber: z.string().regex(/^\d*$/, 'mensaje').optional()
})
const result = schema.safeParse(datos) // { success, data } o { success: false, error }
if (!result.success) {
  const fieldErrors = result.error.flatten().fieldErrors // { firstname?: string[], ... }
}
```

**Gotchas reales encontrados:**
- **Orden de `.optional()`:** `z.string().optional()` envuelve el string en un tipo distinto (`ZodOptional`) que ya no expone métodos propios de string (`.regex()`, `.min()`...). Hay que encadenar las reglas específicas *antes* de `.optional()`: `z.string().regex(...).optional()`, nunca al revés. Confirmado con `node -e` ejecutando ambos órdenes.
- **"Required" no significa "no vacío":** sin `.optional()`, zod solo exige que la clave exista y no sea `undefined` — un string vacío `''` sigue siendo un string válido y pasa. Lo que de verdad falla sin `.optional()` es que la clave esté *ausente* del objeto. Como `formData.get(...)` de un `<form>` HTML siempre devuelve la clave (vacía como `''`, nunca ausente), `.optional()` resultó innecesario una vez el regex ya admitía cadena vacía (`/^\d*$/` en vez de `/^\d+$/`).
- **zod no aborta en el primer fallo por campo:** si un campo tiene varias reglas encadenas (`.min().max().regex()`), zod acumula *todos* los issues que fallen, no solo el primero. Confirmado forzando un valor que rompe 3 reglas a la vez — las 3 aparecieron en `fieldErrors`.
- **No hace falta tipar a mano el resultado de zod:** el primer intento fue tipar `fieldErrors` derivándolo de los tipos internos de zod (`z.inferFlattenedErrors`, luego `z.treeifyError` con varios `NonNullable` anidados) — funcionaba, pero era un indicador de ir contracorriente de la API. La solución real fue más simple: usar `result.error.flatten().fieldErrors` (forma plana, sin anidar) y tipar el campo a mano como `Record<string, string[] | undefined>`. Lección general: si tipar algo requiere genéricos anidados con varios `NonNullable`, casi siempre la salida es simplificar la estructura de datos, no "tipar mejor".
- **`flatten()` aparece deprecado en el IDE** (zod v4) a favor de `z.treeifyError()`, pero sigue funcionando y es más simple para este caso (da `{ campo: string[] }` directo, sin la capa extra `{ campo: { errors: string[] } }` de `treeifyError`). El hint de deprecación no es bloqueante.

**UX: mostrar solo el primer mensaje de error por campo.** Aunque zod puede devolver varios mensajes por campo, la convención estándar (la que sigue Formik por debajo vía Yup, que por defecto usa `abortEarly: true`) es mostrar solo `fieldErrors.campo?.[0]`, no todos apilados. Motivo: cuando varias reglas fallan a la vez sobre el mismo campo, casi siempre son redundantes para la acción que el usuario tiene que tomar (arreglar el formato ya resuelve ambas); mostrar todos los mensajes añade ruido sin información nueva. El resto de reglas se revela de forma progresiva en el siguiente intento si sigue habiendo problemas.

## Feedback de carga con `useFormStatus`

Vivido en `exercises/01-server-actions-basico/app/useFormStatus/` (formulario de valoración de producto, combinando zod + `useActionState` + `useFormStatus`).

**Por qué `useFormStatus` exige un componente hijo del `<form>`, no el mismo componente que lo renderiza:**
- `useFormStatus()` no recibe argumentos: siempre busca el `<form>` ancestro más cercano en el árbol ya montado.
- El `<form>`, al renderizarse, actúa como un **proveedor implícito** del estado de su propia petición — análogo a un Context de React. Igual que no se puede consumir un Context en el mismo componente que lo provee, no se puede preguntar por el estado de un `<form>` desde el componente que todavía lo está construyendo: en ese instante del render, ese `<form>` concreto aún no existe como ancestro montado al que preguntarle.
- Por eso el patrón correcto es extraer la parte de la UI que necesita `pending` (un botón, un spinner, el formulario entero) a un componente separado que se renderice **dentro** del `<form>`.

**`useFormStatus` vs el `isPending` de `useActionState` — no son redundantes, resuelven problemas distintos:**
- `useActionState` ya devuelve su propio `isPending` como tercer valor (`const [state, formAction, isPending] = useActionState(...)`). Técnicamente esa información ya existe sin necesidad de `useFormStatus`.
- La diferencia es de **alcance**, no de datos: ese `isPending` solo vive en el componente donde se llamó al hook. Para que un componente hijo lo use, habría que pasarlo por *props* explícitamente a través de toda la cadena intermedia (coste real en formularios grandes tipo wizard multi-paso, donde cada paso es un componente distinto pero el `<form>` es uno solo).
- `useFormStatus` evita ese prop-drilling: cualquier descendiente del `<form>` puede leer `pending` directamente, sin que los componentes intermedios necesiten saber que existe.
- Además, lo que devuelve `useFormStatus` (`pending`, `data`, `method`, `action`) es **genérico** — `data` es el `FormData` crudo enviado, no el `state` resuelto por el reducer de `useActionState` (que sí tiene la forma particular de cada formulario, p. ej. `fieldErrors`). Esto permite construir componentes como un `SubmitButton` reutilizable en cualquier formulario del proyecto, sin acoplarlo a la forma del estado de ninguna Server Action concreta.

**Confirmación empírica del modelo de reductor del Hito 3 (encolado de `prevState`):** añadiendo temporalmente un `console.log(prevState)` + `await new Promise(r => setTimeout(r, 3000))` al principio de una Server Action, y haciendo doble submit antes de que la primera petición resuelva, se comprobó que:
- La segunda invocación no se descarta ni se ejecuta en paralelo — se **encola**, y el tiempo total de espera percibido es la suma de ambas latencias (6s con dos delays de 3s), no el máximo.
- Esa segunda invocación recibe como `prevState` el resultado real que acaba de producir la primera invocación (no el estado inicial que se le pasó a `useActionState` al montar el componente) — justo lo que permite modelar la Server Action como un reductor puro y mantener consistencia entre envíos encolados.

## Cuándo NO conviene usar una Server Action

Ejemplo claro: un **autocompletado de búsqueda** (input que dispara `onChange` para buscar sugerencias mientras el usuario escribe).

Motivos:
- Necesita **debounce** (esperar a que el usuario deje de escribir antes de disparar la petición).
- Necesita **cancelación** de peticiones anteriores (`AbortController`) para evitar que una respuesta vieja pise a la nueva.
- Es una **lectura**, no una mutación.

Las Server Actions están pensadas para "disparar una vez, esperar respuesta, revalidar caché", no para este patrón. Aquí lo correcto es un Route Handler + `fetch` manual (o `useSWR`/React Query, que ya resuelven debounce/cancelación).
