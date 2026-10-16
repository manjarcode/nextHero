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

## Cuándo NO conviene usar una Server Action

Ejemplo claro: un **autocompletado de búsqueda** (input que dispara `onChange` para buscar sugerencias mientras el usuario escribe).

Motivos:
- Necesita **debounce** (esperar a que el usuario deje de escribir antes de disparar la petición).
- Necesita **cancelación** de peticiones anteriores (`AbortController`) para evitar que una respuesta vieja pise a la nueva.
- Es una **lectura**, no una mutación.

Las Server Actions están pensadas para "disparar una vez, esperar respuesta, revalidar caché", no para este patrón. Aquí lo correcto es un Route Handler + `fetch` manual (o `useSWR`/React Query, que ya resuelven debounce/cancelación).
