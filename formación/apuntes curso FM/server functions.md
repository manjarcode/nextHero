- Para trabajar con apps dinamicas ya no vamos a hacer peticiones por fetch, se produce un cambio de paradigma con las server functions.

- Se trata de funciones asíncronas ejecutadas en servidor, pero generalmente disparadas por interacción del usuario.

- Por debajo se produce una petición HTTP al servidor, pero es trasparente para el usuario. El dev no tiene que especificar el endpoint ni manejar las peticiones, el framework lo hace por él.

- Al poner la directiva 'use server' en un fichero todas las funciones declaradas dentro se montan como un endpoint.

- Se puede poner 'use server' sobre una función, en el caso de querer usarlo solo para un componente. En general lo recomendable es separar el fichero aparte.

- Importante: al ejecutarse en servidor, no tenemos acceso a la información del cliente: por ejemplo no podemos acceder al objeto window ni al DOM. Pero por otro lado puedes acceder a todo lo disponible en servidor como sistema de ficheros, bases de datos, etc.

- Al trabajar con forms es muy común utilizar el objeto FormData nativo para recuperar los elementos del formulario

- Zod sirve para validar schemas de objetos, se definen de forma fácilmente legible:

const userSchema = z.object({
  name: z.string().max(50),
  phoneNumber: z.string().regex(/\d+/).optional()
})

- Para validar un schema se utiliza: 

const validation = schema.safeParse(model)

if (!validation.success) {
  return {
    fieldErrors: z.flattenError(validation.error).fieldErrors
  }
}

- NOTA: en el curso se utiliza validation.error.flatten().fieldErrors, pero esto está deprecado para la versión 4 de zod

- Para usar useActionState, debe aplicarse la directiva use client porque es un hook de cliente.

- useActionState se emplea para encapsular el manejo de formularios.

- El input de useActionState es similar a un reduce, tiene dos params:
1. Una función de tipo reducer (currentState, formData) que devolverá el siguiente estado (generalmente llamando a una server function)
2. Un objeto con el estado inicial

- El output de useActionState es
1. state: el estado actualizado del formulario 
2. formAction: este es el handler que pasaremos al formulario
3. pending: indica si la formAction esta en ejecución o no

- Hay que definir el name en los inputs para poder mapear correctamente el formData

- Los inputs son uncontrolled, no necesitamos manejar el estado de que se está escribiendo en ellos.

- useActionState permite encolar las peticiones de cambio de estado una tras otra, garantizando que todas se ejecutan en el orden correspondiente conectando el state resultante de cada uno como entrada para la siguiente.









Preguntas:

¿Qué diferencia hay entre una server function y un fetch normal?



¿Cómo explicariais que es una server function?


¿Por qué los inputs no llevan state en los ejemplos del curso?


¿zod os recuerda a yup que usamos con formik? ¿Notais alguna diferencia?

¿Alguien se anima a dibujar en pizarra como fluye la ejecución desde que se hace click en Submit en el ejemplo del curso?


¿Donde se rompe la barrera entre servidor y cliente en el ejemplo del curso?
https://github.com/Hendrixer/next.js-fundamentals/blob/main/lessons/07-configuring-auth-forms-with-server-actions.md

Revisar por qué no conviene utilizar una petición GET con server actions